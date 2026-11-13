'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { SupplementReviewCard } from '@/components/admin/SupplementReviewCard';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import { MealTrackAdminApiError } from '@/lib/mealtrack-admin-api';
import { shrinkPhotoForUpload } from '@/lib/shrink-photo-for-upload';
import {
  fetchSupplementReview,
  removeSupplementPhoto,
  reviewSupplement,
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
  { value: 'all', label: 'All waiting' },
  { value: 'scan', label: 'Label scans' },
  { value: 'catalog', label: 'Held-back catalog rows' },
  // Live products, to correct one; past doses keep their own amounts.
  { value: 'approved', label: 'Approved' },
];
const PHOTO_FILTERS: { value: SupplementPhotoFilter; label: string }[] = [
  { value: 'all', label: 'Any photo' },
  { value: 'missing', label: 'Missing photo' },
  { value: 'with', label: 'Has photo' },
];

export function AdminSupplementsPageClient() {
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
  const admin = useAdminSession({ onReset: resetPageData, onReload: reload });
  const { environment, getValidToken, isPreviewMode, session } = admin;

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
      if (!file && !window.confirm(`Remove the photo of "${item.name}"? The app shows the plain mark again.`)) return;
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
        setActionMessage(file ? `Saved the photo of ${item.name}.` : `Removed the photo of ${item.name}.`);
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
    <AdminPageShell
      admin={admin}
      current="/admin/supplements"
      title="Supplements"
      description="Check held-back catalog rows and people's label scans against their source, then approve, correct or reject them. Approved rows join the shared catalog."
      toolbar={<>
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
          aria-label="Filter by product photo"
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
            aria-label="Find by catalog key, name or brand"
            className="min-w-0 flex-1 border border-slate-200 bg-white px-3 py-2 text-xs sm:w-64 rounded-lg"
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Catalog key, name or brand"
            value={draftQuery}
          />
          {query && (
            <button type="button" onClick={() => search('')} className="border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:border-slate-300 rounded-lg">
              Clear
            </button>
          )}
        </form>
      </>}
    >
      {isPreviewMode && (
        <AdminBanner
          tone="warning"
          title="Backend not configured"
          message="Set NEXT_PUBLIC_MEALTRACK_API_URL, or enable the admin proxy, to load the review queue."
        />
      )}
      {error && <AdminBanner tone="error" title="Review queue request failed" message={error} />}
      {actionMessage && (
        <AdminBanner tone={actionTone} title={actionTone === 'error' ? 'Action failed' : 'Action status'} message={actionMessage} />
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
        <p className="border border-slate-200 bg-white p-6 text-sm text-slate-500 rounded-xl">Nothing is waiting for review.</p>
      )}
      {data.items.map((item) => (
        <SupplementReviewCard key={`${item.id}:${item.reviewed_at ?? ''}:${item.updated_at ?? ''}`} item={item} isBusy={busyIds.has(item.id)} onReview={(...args) => void handleReview(...args)} onFind={find} onPhoto={(...args) => void handlePhoto(...args)} />
      ))}
    </AdminPageShell>
  );
}

function rejectPrompt(item: SupplementReviewItem): string {
  return item.kind === 'scan'
    ? `Reject "${item.name}"? It stays on the person's own list but never joins the catalog. This is final.`
    : `Reject "${item.name}"? It stays hidden from search and barcode lookups, and re-imports will not bring it back. This is final.`;
}

function outcomeMessage(item: SupplementReviewItem, action: SupplementReviewAction, mergedInto: string | null): string {
  if (action === 'edit') {
    return item.review_status === 'approved'
      ? `Saved edits to ${item.name}. Future doses use them; past doses keep their amounts.`
      : `Saved edits to ${item.name}. It is still waiting for review.`;
  }
  if (action === 'reject') return `Rejected ${item.name}.`;
  if (mergedInto) return `${item.name} matched a shared product by barcode; the person's list and doses now use that product, and their scan was removed.`;
  return `Approved ${item.name}. It is now in the shared catalog.`;
}

const emptyData: SupplementReviewListResponse = {
  items: [],
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
};
