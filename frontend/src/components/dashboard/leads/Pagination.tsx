interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/**
 * Returns the page numbers to display.
 * Always shows: 1, 2, 3, …, last — matching the HTML source.
 */
function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '…')[] = [1, 2, 3];

  if (current > 4 && current < total - 1) {
    pages.push('…', current - 1, current, current + 1);
  }

  if (!pages.includes('…') && total > 4) {
    pages.push('…');
  }

  pages.push(total);

  return [...new Set(pages)];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm">
      {/* Summary */}
      <span className="font-body-sm text-secondary text-center sm:text-left">
        Mostrando{' '}
        <span className="font-semibold text-on-surface">
          {firstItem} a {lastItem}
        </span>{' '}
        de{' '}
        <span className="font-semibold text-on-surface">{totalItems}</span> resultados
      </span>

      {/* Page buttons */}
      <div className="flex flex-wrap items-center justify-center gap-space-xs" role="navigation" aria-label="Paginação">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
          className="w-9 h-9 rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_left</span>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) =>
          page === '…' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-secondary font-label-sm" aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className={
                currentPage === page
                  ? 'w-9 h-9 rounded-lg bg-primary-container text-on-primary font-label-sm font-semibold flex items-center justify-center shadow-sm cursor-pointer'
                  : 'w-9 h-9 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm font-semibold flex items-center justify-center transition-colors cursor-pointer'
              }
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Próxima página"
          className="w-9 h-9 rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
