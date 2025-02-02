import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import type { FolderResourceType } from "@/types/types";
import { Link, router, usePage } from "@inertiajs/react";
import { ExitIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
    CodeIcon,
    FileIcon,
    FolderIcon,
    UserIcon,
    VideoIcon,
} from "lucide-react";
import AreYouSure from "./modals/are-you-sure";
import CreateFolderModal from "./modals/create-folder-modal";
import EditFolderModal from "./modals/edit-folder-modal";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "./ui/context-menu";

export default function Sidebar({ className }: { className: string }) {
    const { open: openFolderModal } = useModal(CreateFolderModal, {});
    const folders = usePage().props.folders as FolderResourceType[];

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Beheer
                    </h2>
                    <div className="space-y-1">
                        <Link href={route("account.edit")}>
                            <Button
                                variant={
                                    route().current("account.edit")
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                            >
                                <UserIcon className="mr-2 h-4 w-4" />
                                Account
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => router.delete(route("login"))}
                        >
                            <ExitIcon className="mr-2 h-4 w-4" />
                            Uitloggen
                        </Button>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Uploads
                    </h2>
                    <div className="space-y-1">
                        <Link href={route("media")}>
                            <Button
                                variant={
                                    route().current("media")
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                            >
                                <VideoIcon className="mr-2 h-4 w-4" />
                                Media
                            </Button>
                        </Link>
                        <Link href={route("all")}>
                            <Button
                                variant={
                                    route().current("all")
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                            >
                                <FileIcon className="mr-2 h-4 w-4" />
                                Alle bestanden
                            </Button>
                        </Link>
                        <Link href={route("code")}>
                            <Button
                                variant={
                                    route().current("code")
                                        ? "secondary"
                                        : "ghost"
                                }
                                className="w-full justify-start"
                            >
                                <CodeIcon className="mr-2 h-4 w-4" />
                                Tekst & code
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="py-2">
                    <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                        Mappen
                        <Button
                            className="ml-2 inline-block"
                            size="sm"
                            variant="outline"
                            onClick={openFolderModal}
                        >
                            Map maken
                        </Button>
                    </h2>
                    <ScrollArea className="h-[300px] px-1">
                        <div className="space-y-1 p-2">
                            {folders.map((folder) => (
                                <FolderItem folder={folder} key={folder.id} />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

export function FolderItem({ folder }: { folder: FolderResourceType }) {
    const { open: areYouSureDelete } = useModal(AreYouSure, {
        action: () => router.delete(route("folder.destroy", folder.uuid)),
    });

    const { open: editFolderModal } = useModal(EditFolderModal, { folder });

    return (
        <ContextMenu key={folder.id}>
            <ContextMenuTrigger>
                <Link href={route("folder.show", folder.uuid)}>
                    <Button
                        key={folder.id}
                        variant="ghost"
                        className="w-full justify-start font-normal"
                    >
                        <FolderIcon className="mr-2 h-4 w-4" />
                        {folder.name}
                    </Button>
                </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel inset>Acties</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem
                    className="cursor-pointer"
                    onClick={editFolderModal}
                >
                    <Pencil1Icon className="mr-2 h-4 w-4" />
                    Map bewerken
                </ContextMenuItem>
                <ContextMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={areYouSureDelete}
                >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Map verwijderen
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
