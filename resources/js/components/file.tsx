import { type FileResourceType, FileType } from "@/types/types";
import { useEffect, useState } from "react";
import AutoHighlight, { getFileExtension } from "./highlight";

interface MediaLibraryImageProps {
    file: FileResourceType;
    className?: string;
    controls?: boolean;
    thumbnail?: boolean;
}

// files bigger than this are not shown as a text preview or editable in the code modal
export const MAX_TEXT_PREVIEW_BYTES = 2 * 1024 * 1024;

type TextPreview =
    | { state: "loading" }
    | { state: "too-large" }
    | { state: "ready"; code: string };

export function File(props: MediaLibraryImageProps) {
    const [preview, setPreview] = useState<TextPreview>({ state: "loading" });

    useEffect(() => {
        if (props.file.type != FileType.Text) return;

        if (props.file.size_bytes > MAX_TEXT_PREVIEW_BYTES) {
            setPreview({ state: "too-large" });
            return;
        }

        const controller = new AbortController();

        fetch(props.file.url, { redirect: "follow", signal: controller.signal })
            .then((response) => response.text())
            .then((text) => setPreview({ state: "ready", code: text }))
            .catch(() => {
                /* aborted or network error: no preview */
            });

        return () => controller.abort();
    }, [props.file.url, props.file.type, props.file.size_bytes]);

    return (
        <>
            {props.thumbnail && props.file.thumbnail_url ? (
                <div className="overflow-hidden rounded-md">
                    <img
                        className={props.className}
                        src={props.file.thumbnail_url}
                        alt={props.file.name}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            ) : props.file.type == FileType.Image ? (
                <div className="overflow-hidden rounded-md">
                    <img
                        className={props.className}
                        src={props.file.url}
                        alt={props.file.name}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            ) : props.file.type == FileType.Video ? (
                <div className="overflow-hidden rounded-md">
                    <video
                        preload="metadata"
                        className={props.className}
                        src={`${props.file.url}#t=0.1`}
                        controls={props.controls}
                    />
                </div>
            ) : props.file.type == FileType.Office ? (
                <div className="overflow-hidden rounded-md h-full">
                    <iframe
                        src={`https://view.officeapps.live.com/op/view.aspx?ui=nl-NL&src=${encodeURIComponent(
                            props.file.url,
                        )}&lang=nl-NL`}
                        width="100%"
                        height="100%"
                        className="h-full w-full block"
                    ></iframe>
                </div>
            ) : props.file.type == FileType.Pdf ? (
                <div className="overflow-hidden rounded-md h-full">
                    <iframe
                        src={props.file.url}
                        width="100%"
                        height="100%"
                        className="h-full w-full block"
                    ></iframe>
                </div>
            ) : props.file.type == FileType.Text ? (
                preview.state == "ready" ? (
                    <div className="rounded-md border-gray border p-2">
                        <AutoHighlight
                            code={preview.code}
                            ext={getFileExtension(props.file.name)}
                        />
                    </div>
                ) : preview.state == "loading" ? null : (
                    <p className="rounded-md border-gray border p-6 text-center text-sm text-muted-foreground">
                        Dit bestand is te groot om hier te tonen, download het
                        om de inhoud te bekijken.
                    </p>
                )
            ) : (
                <p className="rounded-md border-gray border p-6 text-center text-sm text-muted-foreground">
                    Geen voorbeeld beschikbaar voor dit bestandstype, gebruik de
                    downloadknop.
                </p>
            )}
        </>
    );
}
