import { cn } from "@/lib/utils";
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

function PreviewImage({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={cn(
                "overflow-hidden rounded-md bg-muted",
                !loaded && "animate-pulse",
            )}
        >
            <img
                className={cn(
                    className,
                    "transition-opacity duration-300",
                    !loaded && "opacity-0",
                )}
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                // cached images can already be complete before onLoad is attached
                ref={(img) => {
                    if (img?.complete) setLoaded(true);
                }}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

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
                <PreviewImage
                    className={props.className}
                    src={props.file.thumbnail_url}
                    alt={props.file.name}
                />
            ) : props.file.type == FileType.Image ? (
                <PreviewImage
                    className={props.className}
                    src={props.file.url}
                    alt={props.file.name}
                />
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
                ) : preview.state == "loading" ? (
                    <div className="space-y-2.5 rounded-md border-gray border p-4">
                        <div className="h-3.5 w-3/5 animate-pulse rounded bg-muted" />
                        <div className="h-3.5 w-4/5 animate-pulse rounded bg-muted" />
                        <div className="h-3.5 w-2/5 animate-pulse rounded bg-muted" />
                    </div>
                ) : (
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
