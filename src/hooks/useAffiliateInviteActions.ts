'use client';

import { useCallback, useState } from 'react';
import { adminErrorMessage } from '@/hooks/useAdminSession';
import { revokeAffiliateInvite, retryAffiliatePremium } from '@/lib/affiliate-invite-admin-api';
import { MealTrackAdminApiError } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';
import type {
  AffiliateInvite,
  AffiliateInviteAction,
  AffiliateInviteRevokedResponse,
} from '@/types/affiliate-invite-admin';

export interface ActionMessage {
  tone: 'info' | 'warning' | 'error';
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

/** Revoke, revoke again and retry-Premium for a row, with per-row progress. */
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
    async (invite: AffiliateInvite, action: AffiliateInviteAction, work: (token: string) => Promise<ActionMessage>) => {
      onBeforeAction();
      setBusy((current) => new Map(current).set(invite.id, action));
      onMessage(null);
      try {
        onMessage(await work(await getValidToken()));
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

  const sendRevoke = useCallback(
    (invite: AffiliateInvite) =>
      run(invite, 'revoke', async (token) => {
        const response = await revokeAffiliateInvite(invite.id, token, environment);
        onUpdated(response.invite);
        return revokeOutcome(invite, response);
      }),
    [environment, onUpdated, run]
  );

  const revoke = useCallback(
    (invite: AffiliateInvite) => {
      if (window.confirm(revokePrompt(invite))) void sendRevoke(invite);
    },
    [sendRevoke]
  );

  /** Already revoked: only retries taking back the Premium, so no prompt. */
  const revokeAgain = useCallback((invite: AffiliateInvite) => void sendRevoke(invite), [sendRevoke]);

  const retryPremium = useCallback(
    (invite: AffiliateInvite) => {
      void run(invite, 'premium', async (token) => {
        const response = await retryAffiliatePremium(invite.id, token, environment);
        onUpdated(response.invite);
        return { tone: 'info', text: `Premium granted to ${response.invite.claimed_by_email ?? invite.label}.` };
      });
    },
    [environment, onUpdated, run]
  );

  return { busy, revoke, revokeAgain, retryPremium };
}

function revokePrompt(invite: AffiliateInvite): string {
  return invite.claimed_by_user_id
    ? `Revoke the invite for "${invite.label}"? Their code stops working for new friends and their free Premium is taken back. Friends who already used the code still earn them ${invite.commission_percent}%. This is final.`
    : `Revoke the invite for "${invite.label}"? The link stops working. This is final.`;
}

function revokeOutcome(invite: AffiliateInvite, response: AffiliateInviteRevokedResponse): ActionMessage {
  const code = response.disabled_code ? ` Code ${response.disabled_code} no longer works for new friends.` : '';
  if (response.premium === 'failed') {
    return {
      tone: 'warning',
      text: `Revoked the invite for ${invite.label}.${code} RevenueCat did not take the Premium back; use Revoke again.`,
    };
  }
  const premium = response.premium === 'removed' ? ' Premium removed.' : '';
  return { tone: 'info', text: `Revoked the invite for ${invite.label}.${code}${premium}` };
}

function actionError(action: AffiliateInviteAction, error: unknown): string {
  const status = error instanceof MealTrackAdminApiError ? error.status : undefined;
  if (action === 'premium' && status === 409 && adminErrorMessage(error) === 'invite_revoked') {
    return 'This invite is revoked, so it cannot get Premium.';
  }
  if (action === 'premium' && status === 502) {
    return 'RevenueCat did not take the Premium grant. Try again later.';
  }
  return adminErrorMessage(error);
}
