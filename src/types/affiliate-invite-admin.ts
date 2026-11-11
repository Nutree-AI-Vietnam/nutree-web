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

export interface AffiliateInviteRevokedResponse {
  invite: AffiliateInvite;
  /** The claimer's code that went back to an ordinary referral code. */
  ended_code: string | null;
}
