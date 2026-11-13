'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { Button } from '@/components/admin/ui/AdminUi';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { SupplementReviewCard } from '@/components/admin/SupplementReviewCard';
import { adminErrorMessage, type AdminSession } from '@/hooks/useAdminSession';
import { MealTrackAdminApiError } from '@/lib/mealtrack-admin-api';
import { shrinkPhotoForUpload } from '@/lib/shrink-photo-for-upload';
import {
  fetchSupplementReview,
  removeSupplementPhoto,
  reviewSupplement,
  shareWaitingScans,
  uploadSupplementPhoto,
} from '@/lib/supplement-admin-api';
import type {
  SupplementEdits,
  SupplementPhotoFilter,
  SupplementReviewAction,
  SupplementReviewItem,
  SupplementReviewKind,
  SupplementReviewListResponse,
} from '@/types/supplement-admin';

const PAGE_SIZE = 20;
type QueueView = SupplementReviewKind | 'all' | 'approved';
const VIEWS: { value: QueueView; label: string }[] = [
  { value: 'all', label: 'Tất cả đang chờ' },
  { value: 'scan', label: 'Ảnh chụp nhãn' },
  { value: 'catalog', label: 'Sản phẩm bị giữ lại khi nhập' },
  // Live products, to correct one; past doses keep their own amounts.
  { value: 'approved', label: 'Đã có trong danh mục' },
];
const PHOTO_FILTERS: { value: SupplementPhotoFilter; label: string }[] = [
  { value: 'all', label: 'Mọi ảnh' },
  { value: 'missing', label: 'Thiếu ảnh' },
  { value: 'with', label: 'Có ảnh' },
];

/**
 * Products not in the catalog yet: rows held back on import, and label scans
 * that could not join on their own. Good scans join automatically.
 */
export function SupplementReviewPanel({ admin, onCatalogChanged }: { admin: AdminSession; onCatalogChanged?: () => void }) {
  const [kind, setKind] = useState<QueueView>('all');
  const [photo, setPhoto] = useState<SupplementPhotoFilter>('all');
  const [query, setQuery] = useState('');
  const [draftQuery, setDraftQuery] = useState('');
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<SupplementReviewListResponse>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<ReadonlySet<string>>(new Set());
  const [actionTone, setActionTone] = useState<'info' | 'error'>('info');
  // Only the newest queue request may paint, so a fetch started before a
  // decision (or by a token refresh) cannot bring a decided card back.
  const latestRequest = useRef(0);

  const resetPageData = useCallback(() => {
    setPage(0);
    setData(emptyData);
    setError(null);
    setActionMessage(null);
  }, []);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const { environment, getValidToken, isPreviewMode, session } = admin;
  // A new target or sign-in starts the queue over.
  useEffect(() => {
    resetPageData();
  }, [environment, session, resetPageData]);
  const [isSharing, setIsSharing] = useState(false);
  const shareNow = useCallback(async () => {
    setIsSharing(true);
    setActionMessage(null);
    try {
      const result = await shareWaitingScans(await getValidToken(), environment);
      setActionTone('info');
      setActionMessage(
        result.shared + result.merged === 0
          ? 'Không có ảnh chụp nhãn nào sẵn sàng để thêm.'
          : `Đã thêm ${result.shared} sản phẩm mới vào danh mục và gộp ${result.merged} sản phẩm vào sản phẩm có sẵn.` +
              (result.skipped ? ` Còn ${result.skipped} mục cần xem bên dưới.` : '')
      );
      reload();
      onCatalogChanged?.();
    } catch (requestError) {
      setActionTone('error');
      setActionMessage(adminErrorMessage(requestError));
    } finally {
      setIsSharing(false);
    }
  }, [environment, getValidToken, onCatalogChanged, reload]);

  const loadQueue = useCallback(async () => {
    if (isPreviewMode || !session) {
      setIsLoading(false);
      return;
    }
    const request = ++latestRequest.current;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getValidToken();
      const response = await fetchSupplementReview(
        {
          kind: kind === 'approved' ? 'all' : kind,
          approved: kind === 'approved',
          photo,
          q: query,
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE,
        },
        token,
        environment
      );
      if (request !== latestRequest.current) return;
      const lastPage = Math.max(0, Math.ceil(response.total / PAGE_SIZE) - 1);
      if (response.items.length === 0 && page > lastPage) {
        // Decisions emptied this page; step back to the last one that has rows.
        setPage(lastPage);
        return;
      }
      setData(response);
    } catch (requestError) {
      if (request === latestRequest.current) setError(adminErrorMessage(requestError));
    } finally {
      if (request === latestRequest.current) setIsLoading(false);
    }
  }, [environment, getValidToken, isPreviewMode, kind, page, photo, query, session]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue, reloadKey]);

  const setBusy = useCallback((id: string, busy: boolean) => {
    setBusyIds((current) => {
      const next = new Set(current);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleReview = useCallback(
    async (item: SupplementReviewItem, action: SupplementReviewAction, changes: SupplementEdits | null) => {
      if (action === 'reject' && !window.confirm(rejectPrompt(item))) return;
      // A queue fetch already in flight predates this decision; never let it paint.
      latestRequest.current += 1;
      setBusy(item.id, true);
      setActionMessage(null);
      try {
        const token = await getValidToken();
        const response = await reviewSupplement(item.id, action, changes, token, environment);
        if (action === 'edit') {
          setData((current) => ({
            ...current,
            items: current.items.map((row) => (row.id === item.id ? response.item : row)),
          }));
        } else {
          setData((current) => ({
            ...current,
            items: current.items.filter((row) => row.id !== item.id),
            total: Math.max(0, current.total - 1),
          }));
          // Later rows move up into this page; fetch it again so none is skipped.
          reload();
        }
        setActionTone('info');
        setActionMessage(outcomeMessage(item, action, response.merged_into));
      } catch (requestError) {
        setActionTone('error');
        setActionMessage(adminErrorMessage(requestError));
        // Decided elsewhere or gone: refresh so the card stops offering actions.
        const status = requestError instanceof MealTrackAdminApiError ? requestError.status : undefined;
        if (status === 404 || status === 409) reload();
      } finally {
        setBusy(item.id, false);
      }
    },
    [environment, getValidToken, reload, setBusy]
  );

  const handlePhoto = useCallback(
    async (item: SupplementReviewItem, file: File | null) => {
      if (!file && !window.confirm(`Xóa ảnh của "${item.name}"? Ứng dụng sẽ hiện lại biểu tượng mặc định.`)) return;
      setBusy(item.id, true);
      setActionMessage(null);
      try {
        const token = await getValidToken();
        const saved = file
          ? await uploadSupplementPhoto(item.id, await shrinkPhotoForUpload(file), token, environment)
          : await removeSupplementPhoto(item.id, token, environment);
        setData((current) => ({
          ...current,
          items: current.items.map((row) => (row.id === item.id ? { ...row, image_url: saved.image_url } : row)),
        }));
        // A photo change keeps updated_at, so the reload keeps the card (and
        // its unsaved edits) and replaces any fetch read before the change.
        reload();
        setActionTone('info');
        setActionMessage(file ? `Đã lưu ảnh của ${item.name}.` : `Đã xóa ảnh của ${item.name}.`);
      } catch (requestError) {
        setActionTone('error');
        setActionMessage(adminErrorMessage(requestError));
        const status = requestError instanceof MealTrackAdminApiError ? requestError.status : undefined;
        if (status === 404 || status === 409) reload();
      } finally {
        setBusy(item.id, false);
      }
    },
    [environment, getValidToken, reload, setBusy]
  );

  const search = useCallback((nextQuery: string) => {
    setDraftQuery(nextQuery);
    setQuery(nextQuery);
    setPage(0);
  }, []);
  // The row blocking a scan waits for review, so it is found among those waiting.
  const find = useCallback((nextQuery: string) => {
    search(nextQuery);
    setKind('all');
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const visibleStart = data.total === 0 ? 0 : data.offset + 1;
  const visibleEnd = Math.min(data.offset + data.items.length, data.total);

  return (
    <>
      <p className="text-sm text-slate-500">
        Ảnh chụp nhãn có thương hiệu và dưỡng chất đọc được sẽ tự vào danh mục trong vòng một phút. Ở lại đây gồm: sản phẩm bị giữ lại khi nhập và ảnh chụp nhãn trùng với một sản phẩm đang chờ. Khi duyệt, sản phẩm được thêm vào danh mục dưới dạng phiên bản mới.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setKind(option.value);
              setPage(0);
            }}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold ${kind === option.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            {option.label}
          </button>
        ))}
        <select
          aria-label="Lọc theo ảnh sản phẩm"
          value={photo}
          onChange={(event) => {
            setPhoto(event.target.value as SupplementPhotoFilter);
            setPage(0);
          }}
          className="border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-500 rounded-lg"
        >
          {PHOTO_FILTERS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <form
          className="flex min-w-0 flex-1 gap-1 sm:flex-none"
          onSubmit={(event) => {
            event.preventDefault();
            search(draftQuery.trim());
          }}
        >
          <input
            aria-label="Tìm theo mã danh mục, tên hoặc thương hiệu"
            className="min-w-0 flex-1 border border-slate-200 bg-white px-3 py-2 text-xs sm:w-64 rounded-lg"
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Mã danh mục, tên hoặc thương hiệu"
            value={draftQuery}
          />
          {query && (
            <button type="button" onClick={() => search('')} className="border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:border-slate-300 rounded-lg">
              Xóa
            </button>
          )}
        </form>
        <Button size="sm" icon="refresh" onClick={() => void shareNow()} isBusy={isSharing} className="ml-auto">
          Thêm ngay ảnh chụp nhãn đã sẵn sàng
        </Button>
      </div>
      {isPreviewMode && (
        <AdminBanner
          tone="warning"
          title="Chưa cấu hình backend"
          message="Hãy đặt NEXT_PUBLIC_MEALTRACK_API_URL hoặc bật admin proxy để tải hàng chờ duyệt."
        />
      )}
      {error && <AdminBanner tone="error" title="Không tải được hàng chờ duyệt" message={error} />}
      {actionMessage && (
        <AdminBanner tone={actionTone} title={actionTone === 'error' ? 'Thao tác thất bại' : 'Trạng thái thao tác'} message={actionMessage} />
      )}

      <MealCatalogPagination
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={data.total}
        visibleStart={visibleStart}
        visibleEnd={visibleEnd}
        onPrevious={() => setPage((value) => Math.max(0, value - 1))}
        onNext={() => setPage((value) => value + 1)}
      />

      {!isLoading && data.items.length === 0 && !error && (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Không có mục nào đang chờ. Ảnh chụp nhãn mới được tự động thêm vào danh mục.</p>
      )}
      {data.items.map((item) => (
        <SupplementReviewCard key={`${item.id}:${item.reviewed_at ?? ''}:${item.updated_at ?? ''}`} item={item} isBusy={busyIds.has(item.id)} onReview={(...args) => void handleReview(...args)} onFind={find} onPhoto={(...args) => void handlePhoto(...args)} />
      ))}
    </>
  );
}

function rejectPrompt(item: SupplementReviewItem): string {
  return item.kind === 'scan'
    ? `Từ chối "${item.name}"? Sản phẩm vẫn nằm trong danh sách riêng của người dùng nhưng sẽ không vào danh mục. Không thể hoàn tác.`
    : `Từ chối "${item.name}"? Sản phẩm sẽ bị ẩn khỏi tìm kiếm và tra mã vạch, và nhập lại cũng không đưa nó trở lại. Không thể hoàn tác.`;
}

function outcomeMessage(item: SupplementReviewItem, action: SupplementReviewAction, mergedInto: string | null): string {
  if (action === 'edit') {
    return item.review_status === 'approved'
      ? `Đã lưu chỉnh sửa cho ${item.name}. Các liều sau sẽ dùng thông tin mới; liều đã ghi giữ nguyên lượng cũ.`
      : `Đã lưu chỉnh sửa cho ${item.name}. Sản phẩm vẫn đang chờ duyệt.`;
  }
  if (action === 'reject') return `Đã từ chối ${item.name}.`;
  if (mergedInto) return `${item.name} trùng mã vạch với một sản phẩm trong danh mục; danh sách và các liều của người dùng giờ dùng sản phẩm đó, và ảnh chụp nhãn của họ đã bị xóa.`;
  return `Đã duyệt ${item.name}. Sản phẩm đã có trong danh mục chung.`;
}

const emptyData: SupplementReviewListResponse = {
  items: [],
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
};
