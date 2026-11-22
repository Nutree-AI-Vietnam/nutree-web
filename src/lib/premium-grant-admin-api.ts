import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

export interface PremiumGrantResponse {
  email: string;
  firebase_uid: string;
  firebase_user_created: boolean;
  already_entitled: boolean;
}

export type PremiumEntitlement = 'entitled' | 'not_entitled' | 'unavailable' | 'no_account' | 'account_disabled';

export interface PremiumAccount {
  email: string;
  account_exists: boolean;
  account_disabled: boolean;
  firebase_uid: string | null;
  entitlement: PremiumEntitlement;
}

/** Lifetime Premium for this email, created in Firebase first when they have never signed in. */
export function grantPremiumByEmail(
  email: string,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PremiumGrantResponse> {
  return requestAdminJson('/premium-grants', token, environment, {
    method: 'POST',
    body: { email },
  });
}

/** Live RevenueCat state. Does not create a Firebase account. */
export function lookupPremiumByEmail(
  email: string,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PremiumAccount> {
  const search = new URLSearchParams({ email });
  return requestAdminJson(`/premium-grants?${search.toString()}`, token, environment);
}

/** Takes back a promotional grant. A subscription the person paid for stays. */
export function revokePremiumByEmail(
  email: string,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PremiumAccount> {
  return requestAdminJson('/premium-grants/revoke', token, environment, {
    method: 'POST',
    body: { email },
  });
}
