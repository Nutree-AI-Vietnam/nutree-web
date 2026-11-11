'use client';

import { useCallback, useState } from 'react';
import { adminErrorMessage } from '@/hooks/useAdminSession';
import { revokeAffiliateInvite, retryAffiliatePremium } from '@/lib/affiliate-invite-admin-api';
import { MealTrackAdminApiError } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';
import type { AffiliateInvite, AffiliateInviteAction } from '@/types/affiliate-invite-admin';

export interface ActionMessage {
  tone: 'info' | 'error';
  text: string;
}

interface Options {
  environment: MealTrackAdminEnvironment;
  getValidToken: () => Promise<string>;
  /** Puts the server's copy of a changed invite into the table. */
  onUpdated: (invite: AffiliateInvite) => void;
  onMessage: (message: ActionMessage | null) => void;
  /** Called before an action, so an older list fetch cannot paint over it. */
  onBeforeAction: () => void;
  reload: () => void;
}

/** Revoke and retry-Premium for a row, with per-row progress. */
export function useAffiliateInviteActions({
  environment,
  getValidToken,
  onUpdated,
  onMessage,
  onBeforeAction,
  reload,
}: Options) {
  const [busy, setBusy] = useState<ReadonlyMap<string, AffiliateInviteAction>>(new Map());

  const run = useCallback(
    async (invite: AffiliateInvite, action: AffiliateInviteAction, work: (token: string) => Promise<string>) => {
      onBeforeAction();
      setBusy((current) => new Map(current).set(invite.id, action));
      onMessage(null);
      try {
        onMessage({ tone: 'info', text: await work(await getValidToken()) });
      } catch (requestError) {
        onMessage({ tone: 'error', text: actionError(action, requestError) });
        reload();
      } finally {
        setBusy((current) => {
          const next = new Map(current);
          next.delete(invite.id);
          return next;
        });
      }
    },
    [getValidToken, onBeforeAction, onMessage, reload]
  );

  const revoke = useCallback(
    (invite: AffiliateInvite) => {
      if (!window.confirm(revokePrompt(invite))) return;
      void run(invite, 'revoke', async (token) => {
        const response = await revokeAffiliateInvite(invite.id, token, environment);
        onUpdated(response.invite);
        const ended = response.ended_code ? ` Code ${response.ended_code} is now an ordinary referral code.` : '';
        return `Revoked the invite for ${invite.label}.${ended}`;
      });
    },
    [environment, onUpdated, run]
  );

  const retryPremium = useCallback(
    (invite: AffiliateInvite) => {
      void run(invite, 'premium', async (token) => {
        const response = await retryAffiliatePremium(invite.id, token, environment);
        onUpdated(response.invite);
        return `Premium granted to ${response.invite.claimed_by_email ?? invite.label}.`;
      });
    },
    [environment, onUpdated, run]
  );

  return { busy, revoke, retryPremium };
}

function revokePrompt(invite: AffiliateInvite): string {
  return invite.claimed_by_user_id
    ? `Revoke the invite for "${invite.label}"? Their code stops earning ${invite.commission_percent}% for new friends; friends who already used it keep it. This is final.`
    : `Revoke the invite for "${invite.label}"? The link stops working. This is final.`;
}

function actionError(action: AffiliateInviteAction, error: unknown): string {
  if (action === 'premium' && error instanceof MealTrackAdminApiError && error.status === 502) {
    return 'RevenueCat did not take the Premium grant. Try again later.';
  }
  return adminErrorMessage(error);
}
