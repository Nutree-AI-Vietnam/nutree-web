import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';
import type {
  SupplementEdits,
  SupplementReviewAction,
  SupplementReviewKind,
  SupplementReviewListResponse,
  SupplementReviewResponse,
} from '@/types/supplement-admin';

export interface SupplementReviewParams {
  kind: SupplementReviewKind | 'all';
  /** A catalog key, or part of a name or brand. */
  q: string;
  /** Live catalog products instead of those waiting for review. */
  approved: boolean;
  limit: number;
  offset: number;
}

export function fetchSupplementReview(
  params: SupplementReviewParams,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<SupplementReviewListResponse> {
  const search = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
  });
  if (params.kind !== 'all') {
    search.set('kind', params.kind);
  }
  if (params.q.trim()) {
    search.set('q', params.q.trim());
  }
  if (params.approved) {
    search.set('status', 'approved');
  }
  return requestAdminJson(`/supplements/review?${search.toString()}`, token, environment);
}

export function reviewSupplement(
  productId: string,
  action: SupplementReviewAction,
  changes: SupplementEdits | null,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<SupplementReviewResponse> {
  return requestAdminJson(`/supplements/review/${encodeURIComponent(productId)}`, token, environment, {
    method: 'POST',
    body: changes ? { action, changes } : { action },
  });
}
