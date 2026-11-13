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
        return { tone: 'info', text: `Đã cấp Premium cho ${response.invite.claimed_by_email ?? invite.label}.` };
      });
    },
    [environment, onUpdated, run]
  );

  return { busy, revoke, revokeAgain, retryPremium };
}

function revokePrompt(invite: AffiliateInvite): string {
  return invite.claimed_by_user_id
    ? `Thu hồi lời mời của "${invite.label}"? Mã của họ sẽ không dùng được cho bạn bè mới và Premium miễn phí của họ sẽ bị gỡ. Bạn bè đã dùng mã vẫn mang lại cho họ ${invite.commission_percent}%. Không thể hoàn tác.`
    : `Thu hồi lời mời của "${invite.label}"? Link sẽ ngừng hoạt động. Không thể hoàn tác.`;
}

function revokeOutcome(invite: AffiliateInvite, response: AffiliateInviteRevokedResponse): ActionMessage {
  const code = response.disabled_code ? ` Mã ${response.disabled_code} không còn dùng được cho bạn bè mới.` : '';
  if (response.premium === 'failed') {
    return {
      tone: 'warning',
      text: `Đã thu hồi lời mời của ${invite.label}.${code} RevenueCat chưa gỡ Premium; hãy bấm Thu hồi lại.`,
    };
  }
  const premium = response.premium === 'removed' ? ' Đã gỡ Premium.' : '';
  return { tone: 'info', text: `Đã thu hồi lời mời của ${invite.label}.${code}${premium}` };
}

function actionError(action: AffiliateInviteAction, error: unknown): string {
  const status = error instanceof MealTrackAdminApiError ? error.status : undefined;
  if (action === 'premium' && status === 409 && adminErrorMessage(error) === 'invite_revoked') {
    return 'Lời mời này đã bị thu hồi nên không thể cấp Premium.';
  }
  if (action === 'premium' && status === 502) {
    return 'RevenueCat chưa nhận lệnh cấp Premium. Hãy thử lại sau.';
  }
  return adminErrorMessage(error);
}
