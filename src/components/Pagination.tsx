import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  colorTheme?: 'green' | 'teal';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  colorTheme = 'green',
}) => {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);

      if (currentPage === 1) {
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = generatePages();

  const themeClasses = {
    green: {
      active: 'bg-green-500 text-white border-green-500',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600',
      arrowHover: 'hover:border-green-400 hover:text-green-600'
    },
    teal: {
      active: 'bg-teal-500 text-white border-teal-500',
      inactive: 'bg-white border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600',
      arrowHover: 'hover:border-teal-400 hover:text-teal-600'
    }
  };

  const theme = themeClasses[colorTheme];

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-30 transition-all ${theme.arrowHover}`}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) => {
        const isEllipsis = p === '...';
        const isActive = p === currentPage;

        return (
          <button
            key={i}
            onClick={() => !isEllipsis && typeof p === 'number' && onPageChange(p)}
            disabled={isEllipsis}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold border transition-all
              ${isEllipsis ? 'bg-transparent border-transparent text-gray-400 cursor-default' : isActive ? theme.active : theme.inactive}`}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-30 transition-all ${theme.arrowHover}`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
