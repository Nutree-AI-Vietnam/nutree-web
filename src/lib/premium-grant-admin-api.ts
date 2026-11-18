import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

export interface PremiumGrantResponse {
  email: string;
  firebase_uid: string;
  firebase_user_created: boolean;
  already_entitled: boolean;
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
