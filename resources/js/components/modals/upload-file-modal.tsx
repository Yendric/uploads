import { useForm } from "@inertiajs/react";
import type { ActualFileObject } from "filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import { useState, type FormEvent } from "react";
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
export default function UploadFileModal({ open, onClose }: Props) {
    const [pond, setPond] = useState<FilePond | null>(null);

    const { data, setData, post, errors } = useForm<{
        file?: ActualFileObject;
    }>({
        file: undefined,
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        data.file = pond?.getFile().file; // hacky
        // ^useForm uses useState internally. As such it holds a reference to the old data object. When I call setData below,
        //   the post call after it doesn't know about it yet, until rerender.
        setData({ file: pond?.getFile().file });

        post(route("file.upload"));
        onClose();
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
                        <DialogTitle>Bestand(en) uploaden</DialogTitle>
                    </DialogHeader>
                    <FilePond
                        ref={(ref) => setPond(ref)}
                        allowMultiple={false}
                        credits={false}
                        maxFiles={3}
                        id="file-upload"
                        labelIdle="Plaats je bestand(en) of klik hier..."
                    />
                    {errors.file && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.file}
                        </p>
                    )}
                    <DialogFooter>
                        <Button onClick={onClose} variant="outline">
                            Annuleer
                        </Button>
                        <form onSubmit={submit}>
                            <Button type="submit">Uploaden</Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
