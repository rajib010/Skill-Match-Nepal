"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationComponentProps {
  totalpages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function PaginationComponent({
  totalpages,
  currentPage,
  hasNextPage,
  hasPreviousPage,
}: PaginationComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalpages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    router.push(createPageURL(pageNumber));
  };

  //generate page numbers to show

  const getVisiblePages = () => {
    const pages = [];
    const showEllipsis = totalpages > 7; // only show ellipsis if more than 7 pages

    if (!showEllipsis) {
      for (let i = 1; i <= totalpages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        //show first five, ellipsis and last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalpages > 6) pages.push(-1); //-1 represent ellipsis
        pages.push(totalpages);
      } else if (currentPage >= totalpages - 3) {
        //show first page, ellipsis and last 5 pages
        for (let i = totalpages - 4; i <= totalpages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalpages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full mt-10 mb-5 flex justify-between items-center">
      <p className="m-0 leading-none text-sm w-full">
        Page {currentPage} of {totalpages}
      </p>
      <Pagination className="m-0 justify-end">
        <PaginationContent>
          {/* previous button */}
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              onClick={(e) => {
                if (!hasPreviousPage) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={
                !hasPreviousPage
                  ? "pointer-events-none opacity-50 "
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {/* visible pages */}

          {getVisiblePages().map((page, index) => {
            if (page === -1) {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={createPageURL(page)}
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* next button */}
          <PaginationItem>
            <PaginationNext
              href={hasNextPage ? createPageURL(currentPage + 1) : "#"}
              onClick={(e) => {
                if (!hasNextPage) {
                  e.preventDefault();
                  return;
                }
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={
                !hasNextPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
