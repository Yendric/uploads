import { type FileResourceType, FileType } from "@/types/types";
import { useEffect, useState } from "react";
import AutoHighlight from "./highlight";

interface MediaLibraryImageProps {
    file: FileResourceType;
    className?: string;
    controls?: boolean;
}

// files bigger than this will not be loaded as text preview
const MAX_TEXT_PREVIEW_BYTES = 512 * 1024;

export function File(props: MediaLibraryImageProps) {
    const [code, setCode] = useState("");
    const [truncated, setTruncated] = useState(false);

    useEffect(() => {
        if (props.file.type != FileType.Text) return;

        fetch(props.file.url, {
            redirect: "follow",
            headers: { Range: `bytes=0-${MAX_TEXT_PREVIEW_BYTES - 1}` },
        }).then(async (response) => {
            const text = await response.text();
            if (text.length >= MAX_TEXT_PREVIEW_BYTES) {
                setTruncated(true);
                setCode(text.slice(0, MAX_TEXT_PREVIEW_BYTES));
            } else {
                setCode(text);
            }
        });
    }, [props.file.url, props.file.type]);

    return (
        <>
            {props.file.type == FileType.Image ? (
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
            ) : (
                props.file.type == FileType.Text && (
                    <div className="rounded-md border-gray border p-2">
                        <AutoHighlight
                            code={code}
                            ext={getFileExtension(props.file.name)}
                        />
                        {truncated && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Preview beperkt tot de eerste 512 KB — download
                                het bestand voor de volledige inhoud.
                            </p>
                        )}
                    </div>
                )
            )}
        </>
    );
}

function getFileExtension(filename: string) {
    const parts = filename.split(".");
    return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? "") : "";
}
