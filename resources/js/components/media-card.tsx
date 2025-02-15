import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import type { FileResourceType, FolderResourceType } from "@/types/types";
import { Link, router, usePage } from "@inertiajs/react";
import { File } from "./file";
import AreYouSure from "./modals/are-you-sure";
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "./ui/context-menu";

export default function MediaCard({ file }: { file: FileResourceType }) {
    const folders = usePage().props.folders as FolderResourceType[];

    const { open: areYouSureDelete } = useModal(AreYouSure, {
        action: () => router.delete(route("file.destroy", file.uuid)),
    });

    function toggleFolder(id: number) {
        let folders = file.folders;
        if (folders.includes(id)) {
            folders = folders.filter((folderId) => folderId !== id);
        } else {
            folders.push(id);
        }

        router.put(route("file.update", file.uuid), { folders });
    }

    return (
        <div className={cn("space-y-3")}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <Link href={route("file.show", file.uuid)}>
                        <File
                            file={file}
                            className="w-full aspect-[3/4] object-cover transition-all hover:scale-105 pointer-events-none"
                        />
                    </Link>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            Beheer mappen
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                            {folders.map((folder) => (
                                <ContextMenuCheckboxItem
                                    key={folder.id}
                                    className="cursor-pointer"
                                    onCheckedChange={(e) =>
                                        toggleFolder(folder.id)
                                    }
                                    onSelect={(e) => e.preventDefault()}
                                    checked={file.folders.includes(folder.id)}
                                >
                                    {folder.name}
                                </ContextMenuCheckboxItem>
                            ))}
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuItem className="cursor-pointer">
                        Delen
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <a href={file.url} target="_blank">
                        <ContextMenuItem className="cursor-pointer">
                            Bekijk
                        </ContextMenuItem>
                    </a>
                    <a href={route("file.download", file.uuid)} download>
                        <ContextMenuItem className="cursor-pointer">
                            Download
                        </ContextMenuItem>
                    </a>
                    <ContextMenuItem
                        className="cursor-pointer text-red-600"
                        onClick={areYouSureDelete}
                    >
                        Verwijder
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none text-lg break-all text-wrap">
                    {file.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                    {file.date} - {file.size}
                </p>
            </div>
        </div>
    );
}
