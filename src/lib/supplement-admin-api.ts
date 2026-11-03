import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';
import type {
  SupplementEdits,
  SupplementPhotoFilter,
  SupplementReviewAction,
  SupplementReviewItem,
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
  photo: SupplementPhotoFilter;
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
  if (params.photo !== 'all') {
    search.set('has_image', String(params.photo === 'with'));
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

/** Sets a catalog product's photo; the server re-encodes it and drops the old one. */
export function uploadSupplementPhoto(
  productId: string,
  photo: Blob,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<SupplementReviewItem> {
  const form = new FormData();
  form.append('file', photo, 'photo.jpg');
  return requestAdminJson(`/supplements/${encodeURIComponent(productId)}/image`, token, environment, {
    method: 'POST',
    form,
  });
}

export function removeSupplementPhoto(
  productId: string,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<SupplementReviewItem> {
  return requestAdminJson(`/supplements/${encodeURIComponent(productId)}/image`, token, environment, {
    method: 'DELETE',
  });
}
