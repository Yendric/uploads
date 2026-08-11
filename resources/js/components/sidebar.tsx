import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import type { FolderResourceType } from "@/types/types";
import { Link, router, usePage } from "@inertiajs/react";
import { ExitIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import {
    CodeIcon,
    FileIcon,
    FolderIcon,
    UserIcon,
    VideoIcon,
} from "lucide-react";
import type { ReactNode } from "react";
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

export default function Sidebar({ className }: { className?: string }) {
    const { open: openFolderModal } = useModal(CreateFolderModal, {});
    const { folders, appVersion } = usePage().props;

    return (
        <div className={cn("flex h-full flex-col", className)}>
            <div className="px-3 py-4">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Uploads
                </h2>
                <div className="space-y-1">
                    <NavItem
                        href={route("media")}
                        active={route().current("media")}
                        icon={<VideoIcon className="mr-2 h-4 w-4" />}
                    >
                        Media
                    </NavItem>
                    <NavItem
                        href={route("all")}
                        active={route().current("all")}
                        icon={<FileIcon className="mr-2 h-4 w-4" />}
                    >
                        Alle bestanden
                    </NavItem>
                    <NavItem
                        href={route("code")}
                        active={route().current("code")}
                        icon={<CodeIcon className="mr-2 h-4 w-4" />}
                    >
                        Tekst & code
                    </NavItem>
                </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col px-3 pb-2">
                <div className="mb-2 flex items-center justify-between px-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                        Mappen
                    </h2>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={openFolderModal}
                    >
                        Map maken
                    </Button>
                </div>
                <ScrollArea className="min-h-0 flex-1">
                    <div className="space-y-1">
                        {folders.map((folder) => (
                            <FolderItem folder={folder} key={folder.id} />
                        ))}
                        {folders.length === 0 && (
                            <p className="px-4 py-2 text-sm text-muted-foreground">
                                Nog geen mappen.
                            </p>
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className="border-t px-3 py-3">
                <div className="space-y-1">
                    <ThemeToggle />
                    <NavItem
                        href={route("account.edit")}
                        active={route().current("account.edit")}
                        icon={<UserIcon className="mr-2 h-4 w-4" />}
                    >
                        Account
                    </NavItem>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => router.delete(route("login"))}
                    >
                        <ExitIcon className="mr-2 h-4 w-4" />
                        Uitloggen
                    </Button>
                </div>
                <p className="mt-2 px-4 text-xs text-muted-foreground">
                    Versie {appVersion}
                </p>
            </div>
        </div>
    );
}

function NavItem({
    href,
    active,
    icon,
    children,
}: {
    href: string;
    active: boolean;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <Link href={href}>
            <Button
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start"
            >
                {icon}
                {children}
            </Button>
        </Link>
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
