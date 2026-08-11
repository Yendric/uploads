import { File, MAX_TEXT_PREVIEW_BYTES } from "@/components/file";
import WriteCodeModal from "@/components/modals/write-code-modal";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import useIsAuth from "@/hooks/use-is-auth";
import { useModal } from "@/hooks/use-modal";
import { toast } from "@/hooks/use-toast";
import {
    type FileResourceType,
    FileType,
    type FolderResourceType,
} from "@/types/types";
import { Head, router, usePage } from "@inertiajs/react";
import { ChevronDownIcon, DownloadIcon } from "@radix-ui/react-icons";
import {
    CodeIcon,
    PencilIcon,
    SquareArrowUpRightIcon,
    TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import AreYouSure from "../../components/modals/are-you-sure";

export default function FileShow({ file }: { file: FileResourceType }) {
    const folders = usePage().props.folders as FolderResourceType[];
    const isAuth = useIsAuth();

    const { open: areYouSureDelete } = useModal(AreYouSure, {
        action: () => {
            router.delete(route("file.destroy", file.uuid), {
                data: { redirect: true },
            });
        },
    });

    function toggleFolder(id: number) {
        const folders = file.folders.includes(id)
            ? file.folders.filter((folderId) => folderId !== id)
            : [...file.folders, id];

        router.put(route("file.update", file.uuid), { folders });
    }

    const { open: openCodeEditor } = useModal(WriteCodeModal, { file });

    const [nameEdit, setNameEdit] = useState(false);
    const [name, setName] = useState(file.name);

    // keep the title in sync when the file is renamed elsewhere
    useEffect(() => setName(file.name), [file.name]);

    function updateName() {
        router.put(
            route("file.update", file.uuid),
            { name },
            {
                onError: (msg) => {
                    toast({
                        title: "Error",
                        description: msg.name,
                        variant: "destructive",
                    });
                    setName(file.name);
                },
            },
        );
        setNameEdit(false);
    }

    return (
        <>
            <Head title={name} />
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-1">
                    {!nameEdit ? (
                        <h2
                            className="text-2xl whitespace-pre font-semibold tracking-tight cursor-pointer inline break-all text-wrap"
                            onClick={() => isAuth && setNameEdit(true)}
                        >
                            {name}{" "}
                            {isAuth && (
                                <PencilIcon className="h-4 w-4 inline" />
                            )}
                        </h2>
                    ) : (
                        <input
                            className="mt-0! bg-transparent text-2xl font-semibold tracking-tight cursor-pointer inline"
                            value={name}
                            size={name.length || 1}
                            autoFocus
                            onChange={(e) => setName(e.target.value)}
                            onBlur={updateName}
                            onKeyDown={(e) => e.key === "Enter" && updateName()}
                        ></input>
                    )}
                    <p className="text-sm text-muted-foreground">
                        {file.date} - {file.size}
                    </p>
                </div>
                <div className="flex gap-1 flex-wrap">
                    {isAuth && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary">
                                    Mappen{" "}
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                    Selecteer mappen
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {folders.map((folder) => (
                                    <DropdownMenuCheckboxItem
                                        key={folder.id}
                                        className="cursor-pointer"
                                        onCheckedChange={(e) =>
                                            toggleFolder(folder.id)
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                        checked={file.folders.includes(
                                            folder.id,
                                        )}
                                    >
                                        {folder.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {isAuth &&
                        file.type == FileType.Text &&
                        file.size_bytes <= MAX_TEXT_PREVIEW_BYTES && (
                            <Button
                                variant="secondary"
                                onClick={openCodeEditor}
                            >
                                <CodeIcon className="h-4 w-4" />
                                Bewerken
                            </Button>
                        )}

                    <a href={route("file.download", file.uuid)} download>
                        <Button variant="secondary">
                            <DownloadIcon className=" h-4 w-4" />
                            Download
                        </Button>
                    </a>

                    <a href={file.url} target="_blank">
                        <Button variant="secondary">
                            <SquareArrowUpRightIcon className="h-4 w-4" />
                            Bekijk
                        </Button>
                    </a>

                    {isAuth && (
                        <Button
                            variant="destructive"
                            onClick={areYouSureDelete}
                        >
                            <TrashIcon className="h-4 w-4" />
                            Verwijderen
                        </Button>
                    )}
                </div>
            </div>

            <Separator className="my-4" />
            <div className="min-h-0 flex-1 space-y-3">
                <File className="mx-auto" file={file} controls={true} />
            </div>
        </>
    );
}
