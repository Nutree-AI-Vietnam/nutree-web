import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

export interface PromoCode {
  id: string;
  code: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
  description: string | null;
  rc_offering_id: string;
  source_offering_id: string | null;
  created_at: string | null;
}

export interface PromoCodeList {
  items: PromoCode[];
  total: number;
  limit: number;
  offset: number;
}

export interface PromoCodeDraft {
  code: string;
  max_uses: number;
  description: string | null;
  expires_at: string | null;
  rc_offering_id: string;
  source_offering_id: string | null;
}

export function fetchPromoCodes(
  params: { limit: number; offset: number; q?: string; isActive?: 'all' | 'true' | 'false' },
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PromoCodeList> {
  const search = new URLSearchParams({ limit: String(params.limit), offset: String(params.offset) });
  if (params.q?.trim()) search.set('q', params.q.trim());
  if (params.isActive && params.isActive !== 'all') search.set('is_active', params.isActive);
  return requestAdminJson(`/promo-codes?${search.toString()}`, token, environment);
}

export function createPromoCode(
  draft: PromoCodeDraft,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PromoCode> {
  return requestAdminJson('/promo-codes', token, environment, { method: 'POST', body: draft });
}

export function updatePromoCode(
  promoId: string,
  changes: Partial<Pick<PromoCode, 'max_uses' | 'description' | 'expires_at' | 'rc_offering_id' | 'source_offering_id' | 'is_active'>>,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PromoCode> {
  return requestAdminJson(`/promo-codes/${encodeURIComponent(promoId)}`, token, environment, {
    method: 'PATCH',
    body: changes,
  });
}
