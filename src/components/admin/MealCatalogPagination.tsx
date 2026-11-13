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
    <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
      <p>{isLoading ? 'Loading catalog...' : `Showing ${visibleStart}-${visibleEnd} of ${total}`}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={onPrevious}
          className="h-9 border border-slate-200 bg-white px-3 font-semibold text-slate-900 disabled:text-slate-400 rounded-lg"
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
          className="h-9 border border-slate-200 bg-white px-3 font-semibold text-slate-900 disabled:text-slate-400 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
