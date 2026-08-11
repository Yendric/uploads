import AreYouSure from "@/components/modals/are-you-sure";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/context-menu";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal";
import { toast } from "@/hooks/use-toast";
import {
    type FileResourceType,
    FileType,
    type FolderResourceType,
} from "@/types/types";
import { router, usePage } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
    FileCode2Icon,
    FileIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    FilmIcon,
    ImageIcon,
    type LucideIcon,
} from "lucide-react";

const typeIcons: Record<FileType, LucideIcon> = {
    [FileType.Image]: ImageIcon,
    [FileType.Video]: FilmIcon,
    [FileType.Text]: FileCode2Icon,
    [FileType.Pdf]: FileTextIcon,
    [FileType.Office]: FileSpreadsheetIcon,
    [FileType.Other]: FileIcon,
};

export default function FileTable({ files }: { files: FileResourceType[] }) {
    const folders = usePage().props.folders;

    return (
        <div className="rounded-md border mb-2">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bestand</TableHead>
                        <TableHead className="hidden md:table-cell">
                            Mappen
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            Grootte
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                            Laatst gewijzigd
                        </TableHead>
                        <TableHead className="w-10">
                            <span className="sr-only">Acties</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files.length ? (
                        files.map((file) => (
                            <FileRow
                                key={file.uuid}
                                file={file}
                                folders={folders}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="h-24 text-center"
                            >
                                Geen resultaten.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function FileRow({
    file,
    folders,
}: {
    file: FileResourceType;
    folders: FolderResourceType[];
}) {
    const { open: areYouSureDelete } = useModal(AreYouSure, {
        action: () => router.delete(route("file.destroy", file.uuid)),
    });

    async function share() {
        await navigator.clipboard.writeText(route("file.show", file.uuid));
        toast({ title: "Link gekopieerd naar klembord" });
    }

    function toggleFolder(id: number) {
        const next = file.folders.includes(id)
            ? file.folders.filter((folderId) => folderId !== id)
            : [...file.folders, id];

        router.put(route("file.update", file.uuid), { folders: next });
    }

    const TypeIcon = typeIcons[file.type];
    const fileFolders = folders.filter((folder) =>
        file.folders.includes(folder.id)
    );

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <TableRow
                    className="cursor-pointer"
                    onClick={() =>
                        router.visit(route("file.show", file.uuid))
                    }
                >
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="break-all">{file.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {fileFolders.length ? (
                            <div className="flex flex-wrap gap-1">
                                {fileFolders.map((folder) => (
                                    <Badge
                                        key={folder.id}
                                        variant="secondary"
                                    >
                                        {folder.name}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                        {file.size}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted-foreground lg:table-cell">
                        {file.date}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                >
                                    <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Beheer mappen
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-48">
                                        {folders.map((folder) => (
                                            <DropdownMenuCheckboxItem
                                                key={folder.id}
                                                className="cursor-pointer"
                                                onCheckedChange={() =>
                                                    toggleFolder(folder.id)
                                                }
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                                checked={file.folders.includes(
                                                    folder.id
                                                )}
                                            >
                                                {folder.name}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={share}
                                >
                                    Delen
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <a href={file.url} target="_blank">
                                    <DropdownMenuItem className="cursor-pointer">
                                        Bekijk
                                    </DropdownMenuItem>
                                </a>
                                <a
                                    href={route("file.download", file.uuid)}
                                    download
                                >
                                    <DropdownMenuItem className="cursor-pointer">
                                        Download
                                    </DropdownMenuItem>
                                </a>
                                <DropdownMenuItem
                                    className="text-red-600 cursor-pointer"
                                    onClick={areYouSureDelete}
                                >
                                    Verwijderen
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
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
                                onCheckedChange={() =>
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
                <ContextMenuItem className="cursor-pointer" onClick={share}>
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
                    Verwijderen
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
