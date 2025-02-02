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
    let window_size = currentPage == 1 || currentPage == lastPage ? 4 : 1;
    let startPage = Math.max(1, currentPage - window_size);
    let endPage = Math.min(lastPage, currentPage + window_size);

    const items = [];
    for (let i = startPage; i <= endPage; ++i) items.push(i);

    return (
        <ShadcnPagination>
            <PaginationContent>
                {currentPage !== 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={`?page=${currentPage - 1}`}
                            className="cursor-pointer"
                        />
                    </PaginationItem>
                )}
                {startPage > 1 && (
                    <>
                        <PaginationItem key={1}>
                            <PaginationLink
                                href={`?page=${1}`}
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
                            href={`?page=${i}`}
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
                                href={`?page=${lastPage}`}
                                className="cursor-pointer"
                            >
                                {lastPage}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}
                {currentPage !== lastPage && (
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            href={`?page=${currentPage + 1}`}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </ShadcnPagination>
    );
}
