import { getFileExtension } from "@/components/highlight";
import { toast } from "@/hooks/use-toast";
import type { FileResourceType } from "@/types/types";
import { router } from "@inertiajs/react";
import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { type Extension } from "@uiw/react-codemirror";
import axios from "axios";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Input } from "../form";
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
    // when set modal goes into edit mode
    file?: FileResourceType;
}

export default function WriteCodeModal({ open, onClose, file }: Props) {
    const [code, setCode] = useState<string>("");
    const [fileName, setFileName] = useState<string>(file?.name ?? "code.txt");
    const [loading, setLoading] = useState(!!file);
    const [saving, setSaving] = useState(false);

    const extensions = useMemo<Extension[]>(() => {
        const lang = (langs as Record<string, (() => Extension) | undefined>)[
            getFileExtension(fileName)
        ];

        return lang ? [lang()] : [];
    }, [fileName]);

    useEffect(() => {
        if (!file) return;

        const controller = new AbortController();

        fetch(file.url, { redirect: "follow", signal: controller.signal })
            .then((response) => response.text())
            .then((text) => {
                setCode(text);
                setLoading(false);
            })
            .catch(() => {
                if (controller.signal.aborted) return;
                toast({
                    title: "Laden mislukt",
                    description: "Kon de inhoud van het bestand niet laden.",
                    variant: "destructive",
                });
            });

        return () => controller.abort();
    }, [file]);

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (file) {
            router.put(
                route("file.update", file.uuid),
                { name: fileName, content: code },
                {
                    onStart: () => setSaving(true),
                    onFinish: () => setSaving(false),
                    onSuccess: () => onClose(),
                    onError: (errors) =>
                        toast({
                            title: "Opslaan mislukt",
                            description: Object.values(errors).join(" "),
                            variant: "destructive",
                        }),
                },
            );
            return;
        }

        const newFile = new File([code], fileName, { type: "text/plain" });

        setSaving(true);
        try {
            const presign = await axios.post<{ url: string; uuid: string }>(
                route("file.presign"),
            );
            await axios.put(presign.data.url, newFile);

            router.post(route("file.complete"), {
                uuid: presign.data.uuid,
                name: fileName,
                mime: "text/plain",
            });

            onClose();
        } catch {
            toast({
                title: "Opslaan mislukt",
                description:
                    "Er is iets misgegaan bij het opslaan van het bestand. Probeer het opnieuw.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="flex max-h-[90dvh] max-w-(--breakpoint-2xl) flex-col">
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {file ? "Code bewerken" : "Code schrijven"}
                    </DialogTitle>
                </DialogHeader>
                <Input
                    className="shrink-0"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    label="Bestandsnaam"
                />
                <div className="min-h-32 shrink grow basis-[500px] overflow-hidden rounded-md">
                    <CodeMirror
                        value={code}
                        theme={"dark"}
                        height="100%"
                        className="h-full"
                        extensions={extensions}
                        readOnly={loading}
                        onChange={(code) => setCode(code)}
                    />
                </div>
                <DialogFooter className="shrink-0">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={saving}
                    >
                        Annuleer
                    </Button>
                    <form onSubmit={submit}>
                        <Button type="submit" disabled={saving || loading}>
                            {saving
                                ? "Opslaan..."
                                : file
                                  ? "Opslaan"
                                  : "Uploaden"}
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
