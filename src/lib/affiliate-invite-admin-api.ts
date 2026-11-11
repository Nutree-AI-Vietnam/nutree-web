import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';
import type {
  AffiliateInviteCreatedResponse,
  AffiliateInviteCreateRequest,
  AffiliateInviteListResponse,
  AffiliateInviteRevokedResponse,
} from '@/types/affiliate-invite-admin';

export function fetchAffiliateInvites(
  params: { limit: number; offset: number },
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<AffiliateInviteListResponse> {
  const search = new URLSearchParams({ limit: String(params.limit), offset: String(params.offset) });
  return requestAdminJson(`/affiliate-invites?${search.toString()}`, token, environment);
}

/** Issues an invite; the response is the only time its link is ever returned. */
export function createAffiliateInvite(
  request: AffiliateInviteCreateRequest,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<AffiliateInviteCreatedResponse> {
  return requestAdminJson('/affiliate-invites', token, environment, { method: 'POST', body: request });
}

export function revokeAffiliateInvite(
  inviteId: string,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<AffiliateInviteRevokedResponse> {
  return requestAdminJson(`/affiliate-invites/${encodeURIComponent(inviteId)}/revoke`, token, environment, {
    method: 'POST',
  });
}
