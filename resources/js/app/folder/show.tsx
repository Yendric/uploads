import FileTable from "@/components/file-table";
import MediaCard from "@/components/media-card";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useIsAuth from "@/hooks/use-is-auth";
import { useModal } from "@/hooks/use-modal";
import { toast } from "@/hooks/use-toast";
import type { FileResourceType, FolderResourceType } from "@/types/types";
import { Head, router } from "@inertiajs/react";
import { DownloadIcon } from "@radix-ui/react-icons";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import AreYouSure from "../../components/modals/are-you-sure";

export default function MediaView({
    folder,
    mediaOnly,
    files,
}: {
    folder: FolderResourceType;
    mediaOnly: boolean;
    files: {
        data: FileResourceType[];
        meta: {
            last_page: number;
            current_page: number;
        };
    };
}) {
    const { open: areYouSureDelete } = useModal(AreYouSure, {
        action: () =>
            router.delete(route("folder.destroy", folder.uuid), {
                data: { redirect: true },
            }),
    });

    const isAuth = useIsAuth();

    const [nameEdit, setNameEdit] = useState(false);
    const [name, setName] = useState(folder.name);
    function updateName() {
        router.put(
            route("folder.update", folder.uuid),
            { name },
            {
                onError: (msg) => {
                    toast({
                        title: "Error",
                        description: msg.name,
                        variant: "destructive",
                    });
                    setName(folder.name);
                },
            }
        );
        setNameEdit(false);
    }

    return (
        <>
            <Head title={`Map ${name}`} />
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight cursor-pointer inline break-all text-wrap">
                        Map -{" "}
                    </h2>
                    {!nameEdit ? (
                        <h2
                            className="text-2xl font-semibold tracking-tight cursor-pointer inline break-all text-wrap"
                            onClick={() => isAuth && setNameEdit(true)}
                        >
                            {name}{" "}
                            {isAuth && (
                                <PencilIcon className="h-4 w-4 inline" />
                            )}
                        </h2>
                    ) : (
                        <input
                            className="mt-0! whitespace-pre bg-transparent text-2xl font-semibold tracking-tight cursor-pointer inline"
                            value={name}
                            size={name.length || 1}
                            autoFocus
                            onChange={(e) => setName(e.target.value)}
                            onBlur={updateName}
                            onKeyDown={(e) => e.key === "Enter" && updateName()}
                        ></input>
                    )}
                </div>
                <div className="flex gap-1 flex-wrap">
                    <a href={route("folder.zip", folder.uuid)}>
                        <Button variant="secondary">
                            <DownloadIcon className=" h-4 w-4" />
                            Download als zip
                        </Button>
                    </a>

                    {isAuth && (
                        <Button
                            variant="destructive"
                            onClick={areYouSureDelete}
                        >
                            <TrashIcon className=" h-4 w-4" />
                            Verwijderen
                        </Button>
                    )}
                </div>
            </div>
            <Separator className="my-4" />
            {mediaOnly ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {files.data.map((file) => (
                        <MediaCard key={file.uuid} file={file} />
                    ))}
                </div>
            ) : (
                <>
                    <FileTable files={files.data} />

                    <Pagination
                        currentPage={files.meta.current_page}
                        lastPage={files.meta.last_page}
                    />
                </>
            )}
        </>
    );
}
