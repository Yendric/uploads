import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";
import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Pagination as ShadcnPagination,
} from "./ui/pagination";

interface PaginationProps {
    lastPage: number;
    currentPage: number;
}

export default function Pagination({ lastPage, currentPage }: PaginationProps) {
    const { url } = usePage();

    // keep other query params (like search) when switching pages
    function pageHref(page: number) {
        const params = new URLSearchParams(url.split("?")[1] ?? "");
        params.set("page", String(page));
        return `?${params.toString()}`;
    }

    let window_size = currentPage == 1 || currentPage == lastPage ? 2 : 1;
    let startPage = Math.max(1, currentPage - window_size);
    let endPage = Math.min(lastPage, currentPage + window_size);

    const items = [];
    for (let i = startPage; i <= endPage; ++i) items.push(i);

    if (lastPage <= 1) return null;

    return (
        <ShadcnPagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={pageHref(Math.max(1, currentPage - 1))}
                        aria-disabled={currentPage === 1}
                        className={cn(
                            "[&>span]:hidden sm:[&>span]:inline",
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        )}
                    />
                </PaginationItem>
                {startPage > 1 && (
                    <>
                        <PaginationItem key={1}>
                            <PaginationLink
                                href={pageHref(1)}
                                className="cursor-pointer"
                            >
                                {1}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem key="start-ellipsis">
                            <PaginationEllipsis />
                        </PaginationItem>
                    </>
                )}
                {items.map((i) => (
                    <PaginationItem key={i}>
                        <PaginationLink
                            href={pageHref(i)}
                            className="cursor-pointer"
                            isActive={i === currentPage}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                {endPage !== lastPage && (
                    <>
                        <PaginationItem key="end-ellipsis">
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem key={1}>
                            <PaginationLink
                                href={pageHref(lastPage)}
                                className="cursor-pointer"
                            >
                                {lastPage}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}
                <PaginationItem>
                    <PaginationNext
                        href={pageHref(Math.min(lastPage, currentPage + 1))}
                        aria-disabled={currentPage === lastPage}
                        className={cn(
                            "[&>span]:hidden sm:[&>span]:inline",
                            currentPage === lastPage
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        )}
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    );
}
