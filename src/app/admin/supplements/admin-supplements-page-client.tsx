'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { SupplementReviewCard } from '@/components/admin/SupplementReviewCard';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import { fetchSupplementReview, reviewSupplement } from '@/lib/supplement-admin-api';
import type {
  SupplementEdits,
  SupplementReviewAction,
  SupplementReviewItem,
  SupplementReviewKind,
  SupplementReviewListResponse,
} from '@/types/supplement-admin';

const PAGE_SIZE = 20;
const KINDS: { value: SupplementReviewKind | 'all'; label: string }[] = [
  { value: 'all', label: 'All waiting' },
  { value: 'scan', label: 'Label scans' },
  { value: 'catalog', label: 'Held-back catalog rows' },
];

export function AdminSupplementsPageClient() {
  const [kind, setKind] = useState<SupplementReviewKind | 'all'>('all');
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<SupplementReviewListResponse>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
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
      const response = await fetchSupplementReview({ kind, limit: PAGE_SIZE, offset: page * PAGE_SIZE }, token, environment);
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
  }, [environment, getValidToken, isPreviewMode, kind, page, session]);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue, reloadKey]);

  const handleReview = useCallback(
    async (item: SupplementReviewItem, action: SupplementReviewAction, changes: SupplementEdits | null) => {
      if (action === 'reject' && !window.confirm(rejectPrompt(item))) return;
      setBusyId(item.id);
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
        setActionMessage(outcomeMessage(item, action, response.merged_into));
      } catch (requestError) {
        setActionMessage(adminErrorMessage(requestError));
      } finally {
        setBusyId(null);
      }
    },
    [environment, getValidToken, reload]
  );

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const visibleStart = data.total === 0 ? 0 : data.offset + 1;
  const visibleEnd = Math.min(data.offset + data.items.length, data.total);

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/supplements"
      title="Supplements"
      description="Check held-back catalog rows and people's label scans against their source, then approve, correct or reject them. Approved rows join the shared catalog."
      toolbar={KINDS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            setKind(option.value);
            setPage(0);
          }}
          className={`border px-3 py-2 text-xs font-bold ${kind === option.value ? 'border-primary-forest bg-primary-forest text-white' : 'border-border text-muted hover:border-primary-teal'}`}
        >
          {option.label}
        </button>
      ))}
    >
      {isPreviewMode && (
        <AdminBanner
          tone="warning"
          title="Backend not configured"
          message="Set NEXT_PUBLIC_MEALTRACK_API_URL, or enable the admin proxy, to load the review queue."
        />
      )}
      {error && <AdminBanner tone="error" title="Review queue request failed" message={error} />}
      {actionMessage && <AdminBanner tone="info" title="Action status" message={actionMessage} />}

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
        <p className="border border-border bg-white p-6 text-sm text-muted">Nothing is waiting for review.</p>
      )}
      {data.items.map((item) => (
        <SupplementReviewCard key={`${item.id}:${item.reviewed_at ?? ''}`} item={item} isBusy={busyId === item.id} onReview={(...args) => void handleReview(...args)} />
      ))}
    </AdminPageShell>
  );
}

function rejectPrompt(item: SupplementReviewItem): string {
  return item.kind === 'scan'
    ? `Reject "${item.name}"? It stays on the person's own list but never joins the catalog.`
    : `Reject "${item.name}"? It stays hidden from search and barcode lookups.`;
}

function outcomeMessage(item: SupplementReviewItem, action: SupplementReviewAction, mergedInto: string | null): string {
  if (action === 'edit') return `Saved edits to ${item.name}. It is still waiting for review.`;
  if (action === 'reject') return `Rejected ${item.name}.`;
  if (mergedInto) return `${item.name} matched a shared product by barcode; the person's list now uses that product.`;
  return `Approved ${item.name}. It is now in the shared catalog.`;
}

const emptyData: SupplementReviewListResponse = {
  items: [],
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
};
