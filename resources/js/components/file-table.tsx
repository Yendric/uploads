import AreYouSure from "@/components/modals/are-you-sure";
import { Button } from "@/components/ui/button";
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
import type { FileResourceType, FolderResourceType } from "@/types/types";
import { Link, router, usePage } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function FileTable({ files }: { files: FileResourceType[] }) {
    const folders = usePage().props.folders;

    return (
        <div className="rounded-md border mb-2">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bestand</TableHead>
                        <TableHead>Mappen</TableHead>
                        <TableHead>Grootte</TableHead>
                        <TableHead>Laatst gewijzigd</TableHead>
                        <TableHead>Acties</TableHead>
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

    function share(url: string) {
        navigator.clipboard.writeText(url);
        toast({ title: "Link naar bestand gekopieerd." });
    }

    function toggleFolder(id: number) {
        const next = file.folders.includes(id)
            ? file.folders.filter((folderId) => folderId !== id)
            : [...file.folders, id];

        router.put(route("file.update", file.uuid), { folders: next });
    }

    return (
        <TableRow>
            <TableCell width={800}>{file.name}</TableCell>
            <TableCell>
                {file.folders
                    .map((id) => folders.find((f) => f.id == id)?.name)
                    .join(",")}
            </TableCell>
            <TableCell>{file.size}</TableCell>
            <TableCell>{file.date}</TableCell>
            <TableCell>
                <div className="flex gap-1 justify">
                    <Link href={route("file.show", file.uuid)}>
                        <Button variant="outline">Open</Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
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
                                            onSelect={(e) => e.preventDefault()}
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
                                onClick={() => share(file.url)}
                            >
                                Delen
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <a href={file.url} target="_blank">
                                <DropdownMenuItem className="cursor-pointer">
                                    Bekijk
                                </DropdownMenuItem>
                            </a>
                            <a href={route("file.download", file.uuid)} download>
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
                </div>
            </TableCell>
        </TableRow>
    );
}
