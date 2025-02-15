import { type FileResourceType, FileType } from "@/types/types";
import { useEffect, useState } from "react";
import AutoHighlight from "./highlight";

interface MediaLibraryImageProps {
    file: FileResourceType;
    className?: string;
    controls?: boolean;
}

export function File(props: MediaLibraryImageProps) {
    const [code, setCode] = useState("");

    useEffect(() => {
        if (props.file.type != FileType.Text) return;

        fetch(props.file.url, { redirect: "follow" }).then((data) => {
            data.text().then(setCode);
        });
    }, []);

    return (
        <>
            {props.file.type == FileType.Image ? (
                <div className="overflow-hidden rounded-md">
                    <img
                        className={props.className}
                        src={props.file.url}
                        alt={props.file.name}
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
                            props.file.url
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
                    </div>
                )
            )}
        </>
    );
}

function getFileExtension(filename: string) {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() ?? "" : "";
}
