import { toast } from "@/hooks/use-toast";
import { router } from "@inertiajs/react";
import axios from "axios";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useRef, useState, type FormEvent } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

interface Props {
    open: boolean;
    onClose: () => void;
}

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatTime(seconds: number) {
    if (isNaN(seconds) || !isFinite(seconds)) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function UploadFileModal({ open, onClose }: Props) {
    const [pond, setPond] = useState<FilePond | null>(null);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [eta, setEta] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [fileCounter, setFileCounter] = useState("");

    const startTimeRef = useRef<number | null>(null);
    const lastLoadedRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    function updateProgress(loaded: number, total: number) {
        const now = Date.now();
        const timeElapsed = (now - (startTimeRef.current ?? now)) / 1000;
        setElapsed(timeElapsed);

        setProgress(Math.round((loaded / total) * 100));

        const deltaLoaded = loaded - lastLoadedRef.current;
        const deltaTime = (now - lastTimeRef.current) / 1000;
        const currentSpeed = deltaTime > 0 ? deltaLoaded / deltaTime : 0;
        if (currentSpeed > 0) {
            setSpeed(currentSpeed);
            setEta((total - loaded) / currentSpeed);
        }
        lastLoadedRef.current = loaded;
        lastTimeRef.current = now;
    }

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const files = (pond?.getFiles() ?? []).map((item) => item.file as File);
        if (!files.length) {
            return toast({
                title: "Gelieve een bestand te kiezen",
                variant: "destructive",
            });
        }

        setUploading(true);
        setProgress(0);
        setSpeed(0);
        setElapsed(0);
        setEta(0);
        startTimeRef.current = Date.now();
        lastLoadedRef.current = 0;
        lastTimeRef.current = Date.now();

        const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
        let completedBytes = 0;
        let uploaded = 0;

        try {
            for (const [index, file] of files.entries()) {
                setFileCounter(
                    files.length > 1 ? `${index + 1}/${files.length}` : "",
                );

                const presign = await axios.post<{
                    url: string;
                    uuid: string;
                    expires_in: number;
                }>(route("file.presign"));

                await axios.put(presign.data.url, file, {
                    onUploadProgress(p) {
                        if (p.loaded) {
                            updateProgress(
                                completedBytes + p.loaded,
                                totalBytes,
                            );
                        }
                    },
                });

                // a single upload navigates to the file page
                if (files.length === 1) {
                    router.post(route("file.complete"), {
                        uuid: presign.data.uuid,
                        name: file.name,
                        mime: file.type,
                    });

                    onClose();
                    return;
                }

                await axios.post(
                    route("file.complete"),
                    {
                        uuid: presign.data.uuid,
                        name: file.name,
                        mime: file.type,
                    },
                    { headers: { Accept: "application/json" } },
                );

                completedBytes += file.size;
                uploaded++;
            }

            toast({ title: `${uploaded} bestanden geüpload.` });
            router.reload();
            onClose();
        } catch {
            toast({
                title: "Uploaden mislukt",
                description:
                    uploaded > 0
                        ? `${uploaded} van de ${files.length} bestanden zijn geüpload, daarna ging er iets mis. Probeer het opnieuw.`
                        : "Er is iets misgegaan bij het uploaden van het bestand. Probeer het opnieuw.",
                variant: "destructive",
            });

            if (uploaded > 0) router.reload();
        } finally {
            setUploading(false);
            setProgress(0);
            setSpeed(0);
            setElapsed(0);
            setEta(0);
            setFileCounter("");
        }
    }

    return (
        <>
            <style>{`
                .filepond--root {
                    margin-bottom: 0 !important;
                }

                .filepond--panel-root {
                    border-width: 1px !important;
                    background-color: rgb(249 250 251) !important;
                    border-color: rgb(209 213 219) !important;
                }

                @media (prefers-color-scheme: dark) {
                    .filepond--drop-label {
                        color: rgb(156 163 175) !important;
                    }

                    .filepond--panel-root {
                        background-color: rgb(32, 32, 32) !important;
                        border-color: rgb(32, 32, 32) !important;
                    }
                }
            `}</style>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="min-w-fit">
                    <DialogHeader>
                        <DialogTitle>Bestanden uploaden</DialogTitle>
                    </DialogHeader>
                    <FilePond
                        ref={(ref) => setPond(ref)}
                        allowMultiple={true}
                        credits={false}
                        id="file-upload"
                        labelIdle="Plaats je bestanden of klik hier..."
                        disabled={uploading}
                    />
                    {uploading && (
                        <div>
                            <div className="w-full h-4 bg-gray-500 rounded-lg overflow-hidden mb-1">
                                <div
                                    className="h-full bg-gray-400 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>
                                    {fileCounter && `${fileCounter} - `}
                                    {progress}%
                                </span>
                                <span>
                                    {speed > 0
                                        ? `${formatBytes(speed)}/s`
                                        : "--/s"}
                                </span>
                                <span>{formatTime(elapsed)} voorbij</span>
                                <span>
                                    {progress < 100 && speed > 0
                                        ? `${formatTime(eta)} ETA`
                                        : ""}
                                </span>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            disabled={uploading}
                        >
                            Annuleer
                        </Button>
                        <form onSubmit={submit}>
                            <Button type="submit" disabled={uploading}>
                                {uploading ? "Uploaden..." : "Uploaden"}
                            </Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
