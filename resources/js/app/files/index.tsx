import { Head } from "@inertiajs/react";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import FileTable from "@/components/file-table";
import UploadFileModal from "@/components/modals/upload-file-modal";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/use-modal";
import type { FileResourceType } from "@/types/types";

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

            <FileTable files={files.data} />

            <Pagination
                currentPage={files.meta.current_page}
                lastPage={files.meta.last_page}
            />
        </>
    );
}
