import MediaCard from "@/components/media-card";
import UploadFileModal from "@/components/modals/upload-file-modal";
import Pagination from "@/components/pagination";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/use-modal";
import type { FileResourceType } from "@/types/types";
import { Head } from "@inertiajs/react";
import { PlusCircledIcon } from "@radix-ui/react-icons";

interface MediaIndexProps {
    media: {
        data: FileResourceType[];
        meta: {
            last_page: number;
            current_page: number;
        };
    };
}

export default function MediaIndex({ media }: MediaIndexProps) {
    const { open: openFileModal } = useModal(UploadFileModal, {});

    return (
        <>
            <Head title="Media" />
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Media
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Afbeeldingen en video's
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <SearchInput />
                    <Button onClick={openFileModal} variant="secondary">
                        <PlusCircledIcon className=" h-4 w-4" />
                        Media uploaden
                    </Button>
                </div>
            </div>

            <Separator className="my-4" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
                {media.data.map((mediaEntry) => (
                    <MediaCard key={mediaEntry.id} file={mediaEntry} />
                ))}
            </div>
            {media.data.length === 0 && (
                <p className="py-12 text-center text-sm text-muted-foreground">
                    Geen resultaten.
                </p>
            )}

            <Pagination
                currentPage={media.meta.current_page}
                lastPage={media.meta.last_page}
            />
        </>
    );
}
