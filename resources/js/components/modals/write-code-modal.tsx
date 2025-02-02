import { useForm } from "@inertiajs/react";
import CodeMirror, { type Extension } from "@uiw/react-codemirror";
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
    const [lang, setLang] = useState<keyof typeof langs>("javascript");
    const [extensions, setExtensions] = useState<Extension[]>();

    const { data, setData, post, errors } = useForm<{
        file?: File;
    }>();

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const file = new File([code], fileName, { type: "text/plain" });

        data.file = file;
        setData({ file });

        post(route("file.upload"));
        onClose();
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
                <DialogContent className="max-h-3/4 max-w-screen-2xl">
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
