export type AffiliateInviteStatus = 'open' | 'claimed' | 'expired' | 'revoked';

/** An invite as the admin API lists it; it never carries the token. */
export interface AffiliateInvite {
  id: string;
  label: string;
  commission_percent: number;
  created_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  claimed_by_user_id: string | null;
  claimed_by_email: string | null;
  claimed_at: string | null;
  /** When the claimer's free lifetime Premium went through in RevenueCat. */
  premium_granted_at: string | null;
  /** When a revoke took that Premium back; null while removal has not gone through. */
  premium_revoked_at: string | null;
  status: AffiliateInviteStatus;
}

export interface AffiliateInviteListResponse {
  items: AffiliateInvite[];
  total: number;
  limit: number;
  offset: number;
}

export interface AffiliateInviteCreateRequest {
  label: string;
  commission_percent: number;
  expires_days: number | null;
}

/** The only response that carries the token; the server keeps just its hash. */
export interface AffiliateInviteCreatedResponse {
  invite: AffiliateInvite;
  token: string;
  /** The https quiz link to send; chat apps make it tappable and it opens the app. */
  link: string;
  /** The nutree:// link that opens the app directly. */
  app_link: string;
}

/** `failed`: RevenueCat did not take the Premium back; revoking again retries. */
export type AffiliatePremiumRemoval = 'not_needed' | 'removed' | 'failed';

export interface AffiliateInviteRevokedResponse {
  invite: AffiliateInvite;
  /** The claimer's code that no longer works for new friends; null when unclaimed. */
  disabled_code: string | null;
  premium: AffiliatePremiumRemoval;
}

export interface AffiliateInvitePremiumResponse {
  invite: AffiliateInvite;
}

/** What a row is busy doing, so only that button shows progress. */
export type AffiliateInviteAction = 'revoke' | 'premium';
