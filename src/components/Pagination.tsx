'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const getPageUrl = (page: number) => {
    const separator = basePath.includes('?') ? '&' : '?';
    return `${basePath}${separator}page=${page}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-mint hover:bg-blue text-black transition-colors"
        >
          <ChevronLeft size={16} />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white text-black/40 cursor-not-allowed">
          <ChevronLeft size={16} />
          Prev
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {startPage > 1 && (
          <>
            <Link
              href={getPageUrl(1)}
              className="px-3 py-2 rounded-lg bg-mint hover:bg-blue text-black transition-colors"
            >
              1
            </Link>
            {startPage > 2 && <span className="px-2 text-black/40">...</span>}
          </>
        )}
        {pages.map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-dark-purple text-black font-medium'
                : 'bg-mint hover:bg-blue text-black'
            }`}
          >
            {page}
          </Link>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-black/40">...</span>}
            <Link
              href={getPageUrl(totalPages)}
              className="px-3 py-2 rounded-lg bg-mint hover:bg-blue text-black transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-mint hover:bg-blue text-black transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white text-black/40 cursor-not-allowed">
          Next
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
