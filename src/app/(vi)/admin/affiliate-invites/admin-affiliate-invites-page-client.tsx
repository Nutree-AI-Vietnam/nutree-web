'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { AffiliateInviteForm } from '@/components/admin/AffiliateInviteForm';
import { AffiliateInviteLink } from '@/components/admin/AffiliateInviteLink';
import { AffiliateInviteTable } from '@/components/admin/AffiliateInviteTable';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import { type ActionMessage, useAffiliateInviteActions } from '@/hooks/useAffiliateInviteActions';
import { createAffiliateInvite, fetchAffiliateInvites } from '@/lib/affiliate-invite-admin-api';
import type {
  AffiliateInvite,
  AffiliateInviteCreateRequest,
  AffiliateInviteListResponse,
} from '@/types/affiliate-invite-admin';

const PAGE_SIZE = 50;
const BANNER_TITLES: Record<ActionMessage['tone'], string> = {
  info: 'Done',
  warning: 'Partly done',
  error: 'Action failed',
};

export function AdminAffiliateInvitesPageClient() {
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<AffiliateInviteListResponse>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ActionMessage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  // The new link lives in memory only, until Done, sign-out or a target switch.
  const [created, setCreated] = useState<{ label: string; link: string } | null>(null);
  const latestRequest = useRef(0);

  const resetPageData = useCallback(() => {
    setPage(0);
    setData(emptyData);
    setError(null);
    setMessage(null);
    setCreated(null);
  }, []);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReset: resetPageData, onReload: reload });
  const { environment, getValidToken, isPreviewMode, session } = admin;

  const loadInvites = useCallback(async () => {
    if (isPreviewMode || !session) {
      setIsLoading(false);
      return;
    }
    const request = ++latestRequest.current;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getValidToken();
      const response = await fetchAffiliateInvites({ limit: PAGE_SIZE, offset: page * PAGE_SIZE }, token, environment);
      if (request === latestRequest.current) setData(response);
    } catch (requestError) {
      if (request === latestRequest.current) setError(adminErrorMessage(requestError));
    } finally {
      if (request === latestRequest.current) setIsLoading(false);
    }
  }, [environment, getValidToken, isPreviewMode, page, session]);

  useEffect(() => {
    void loadInvites();
  }, [loadInvites, reloadKey]);

  const handleCreate = useCallback(
    async (request: AffiliateInviteCreateRequest): Promise<boolean> => {
      setIsCreating(true);
      setMessage(null);
      setCreated(null);
      try {
        const token = await getValidToken();
        const response = await createAffiliateInvite(request, token, environment);
        setCreated({ label: response.invite.label, link: response.link });
        setPage(0);
        reload();
        return true;
      } catch (requestError) {
        setMessage({ tone: 'error', text: adminErrorMessage(requestError) });
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [environment, getValidToken, reload]
  );

  const updateRow = useCallback((invite: AffiliateInvite) => {
    setData((current) => ({
      ...current,
      items: current.items.map((row) => (row.id === invite.id ? invite : row)),
    }));
  }, []);
  const cancelInFlightLoad = useCallback(() => {
    latestRequest.current += 1;
  }, []);
  const actions = useAffiliateInviteActions({
    environment,
    getValidToken,
    onUpdated: updateRow,
    onMessage: setMessage,
    onBeforeAction: cancelInFlightLoad,
    reload,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const visibleStart = data.total === 0 ? 0 : data.offset + 1;
  const visibleEnd = Math.min(data.offset + data.items.length, data.total);

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/affiliate-invites"
      title="Affiliate invites"
      description="Create a one-time invite link for an affiliate. Whoever opens it and signs in earns the set percent of each referred friend's first purchase."
    >
      {isPreviewMode && (
        <AdminBanner
          tone="warning"
          title="Backend not configured"
          message="Set NEXT_PUBLIC_MEALTRACK_API_URL, or enable the admin proxy, to manage invites."
        />
      )}
      <AffiliateInviteForm isBusy={isCreating} isDisabled={isPreviewMode} onCreate={handleCreate} />
      {created && <AffiliateInviteLink label={created.label} link={created.link} onDone={() => setCreated(null)} />}
      {error && <AdminBanner tone="error" title="Could not load invites" message={error} />}
      {message && (
        <AdminBanner tone={message.tone} title={BANNER_TITLES[message.tone]} message={message.text} />
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
      {!isLoading && data.items.length === 0 && !error ? (
        <p className="border border-border bg-white p-6 text-sm text-muted">No invites yet.</p>
      ) : (
        <AffiliateInviteTable
          items={data.items}
          busy={actions.busy}
          onRevoke={actions.revoke}
          onRevokeAgain={actions.revokeAgain}
          onRetryPremium={actions.retryPremium}
        />
      )}
    </AdminPageShell>
  );
}

const emptyData: AffiliateInviteListResponse = {
  items: [],
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
};
