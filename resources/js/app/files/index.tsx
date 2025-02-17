import { Head, Link, router, usePage } from "@inertiajs/react";
import { DotsHorizontalIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import AreYouSure from "@/components/modals/are-you-sure";
import UploadFileModal from "@/components/modals/upload-file-modal";
import Pagination from "@/components/pagination";
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
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal";
import type { FileResourceType, FolderResourceType } from "@/types/types";

interface FileIndexProps {
    files: {
        data: FileResourceType[];
        meta: {
            last_page: number;
            current_page: number;
        };
    };
}

export default function AllIndex({ files }: FileIndexProps) {
    const { open: openFileModal } = useModal(UploadFileModal, {});
    const folders = usePage().props.folders as FolderResourceType[];

    const columns = React.useMemo<ColumnDef<FileResourceType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Bestand",
                size: 800,
                cell: ({ row }) => <span>{row.getValue("name")}</span>,
            },
            {
                accessorKey: "folders",
                header: "Mappen",
                cell: ({ row }) => (
                    <span>
                        {row
                            .getValue<number[]>("folders")
                            .map((id) => folders.find((f) => f.id == id)?.name)
                            .join(",")}
                    </span>
                ),
            },
            {
                accessorKey: "size",
                header: "Grootte",
                cell: ({ row }) => <span>{row.getValue("size")}</span>,
            },
            {
                accessorKey: "date",
                header: "Laatst gewijzigd",
                cell: ({ row }) => <span>{row.getValue("date")}</span>,
            },

            {
                id: "actions",
                header: "Acties",

                cell: ({ row }) => {
                    const file = row.original;
                    const { open: areYouSureDelete } = useModal(AreYouSure, {
                        action: () =>
                            router.delete(route("file.destroy", file.uuid)),
                    });

                    function toggleFolder(id: number) {
                        let folders = file.folders;
                        if (folders.includes(id)) {
                            folders = folders.filter(
                                (folderId) => folderId !== id
                            );
                        } else {
                            folders.push(id);
                        }

                        router.put(route("file.update", file.uuid), {
                            folders,
                        });
                    }

                    return (
                        <div className="flex gap-1 justify">
                            <Link href={route("file.show", file.uuid)}>
                                <Button variant="outline">Open</Button>
                            </Link>
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
                                                    onCheckedChange={(e) =>
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
                                    <DropdownMenuItem className="cursor-pointer">
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
                        </div>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: files.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <Head title="Alle bestanden" />
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Alle bestanden
                    </h2>
                </div>
                <Button onClick={openFileModal} variant="secondary">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Bestand uploaden
                </Button>
            </div>

            <Separator className="my-4" />

            <div className="rounded-md border mb-2">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            width={cell.column.getSize()}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                currentPage={files.meta.current_page}
                lastPage={files.meta.last_page}
            />
        </>
    );
}
