import { toast } from "@/hooks/use-toast";
import { router } from "@inertiajs/react";
import CodeMirror, { type Extension } from "@uiw/react-codemirror";
import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { Input, Select } from "../form";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import { langs } from "@uiw/codemirror-extensions-langs";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function WriteCodeModal({ open, onClose }: Props) {
    const [code, setCode] = useState<string>("");
    const [fileName, setFileName] = useState<string>("code.txt");
    const [lang, setLang] = useState<keyof typeof langs>(
        "javascript" as keyof typeof langs,
    );
    const [extensions, setExtensions] = useState<Extension[]>();

    const [saving, setSaving] = useState(false);

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const file = new File([code], fileName, { type: "text/plain" });

        setSaving(true);
        try {
            const presign = await axios.post<{ url: string; uuid: string }>(
                route("file.presign"),
            );
            await axios.put(presign.data.url, file);

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

    useEffect(() => {
        if (langs[lang]) {
            setExtensions([langs[lang]()]);
        } else {
            setExtensions([]);
        }
    }, [lang]);

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-h-3/4 max-w-(--breakpoint-2xl)">
                    <DialogHeader>
                        <DialogTitle>Code schrijven</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        label="Bestandsnaam"
                    />
                    <Select
                        defaultValue={lang}
                        onValueChange={(lang) =>
                            setLang(lang as keyof typeof langs)
                        }
                        options={Object.keys(langs)}
                        label="Taal"
                    />
                    <CodeMirror
                        value={code}
                        theme={"dark"}
                        height="500px"
                        lang="typescript"
                        extensions={extensions}
                        onChange={(code) => setCode(code)}
                    />
                    <DialogFooter>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            disabled={saving}
                        >
                            Annuleer
                        </Button>
                        <form onSubmit={submit}>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Opslaan..." : "Uploaden"}
                            </Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
