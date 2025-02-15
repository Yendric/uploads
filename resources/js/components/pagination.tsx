import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    Pagination as ShadcnPagination,
} from "./ui/pagination";

interface PaginationProps {
    lastPage: number;
    currentPage: number;
}

export default function Pagination({ lastPage, currentPage }: PaginationProps) {
    let window_size = currentPage == 1 || currentPage == lastPage ? 2 : 1;
    let startPage = Math.max(1, currentPage - window_size);
    let endPage = Math.min(lastPage, currentPage + window_size);

    const items = [];
    for (let i = startPage; i <= endPage; ++i) items.push(i);

    return (
        <ShadcnPagination>
            <PaginationContent>
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
            </PaginationContent>
        </ShadcnPagination>
    );
}
