interface MealCatalogPaginationProps {
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  visibleStart: number;
  visibleEnd: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function MealCatalogPagination({
  isLoading,
  page,
  totalPages,
  total,
  visibleStart,
  visibleEnd,
  onPrevious,
  onNext,
}: MealCatalogPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted">
      <p>{isLoading ? 'Loading catalog...' : `Showing ${visibleStart}-${visibleEnd} of ${total}`}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={onPrevious}
          className="h-9 border border-border bg-white px-3 font-semibold text-foreground disabled:text-muted"
        >
          Prev
        </button>
        <span className="min-w-20 text-center">
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page + 1 >= totalPages}
          onClick={onNext}
          className="h-9 border border-border bg-white px-3 font-semibold text-foreground disabled:text-muted"
        >
          Next
        </button>
      </div>
    </div>
  );
}
