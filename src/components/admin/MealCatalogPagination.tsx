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
    <div className="flex items-center justify-between gap-3 text-[13px] text-[#5C6B62]">
      <p>{isLoading ? 'Đang tải...' : `Hiển thị ${visibleStart}–${visibleEnd} / ${total}`}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={onPrevious}
          className="h-8 border border-[#D5CFC3] bg-[#FBF9F4] px-3 text-[13px] font-medium text-[#1A2820] disabled:text-[#C9C3B6]"
        >
          Trước
        </button>
        <span className="min-w-20 text-center">
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page + 1 >= totalPages}
          onClick={onNext}
          className="h-8 border border-[#D5CFC3] bg-[#FBF9F4] px-3 text-[13px] font-medium text-[#1A2820] disabled:text-[#C9C3B6]"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
