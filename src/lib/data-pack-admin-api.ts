import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';
import type {
  DataPackEntry,
  DataPackListResponse,
  PackRecipe,
  PackRecipeListResponse,
} from '@/types/data-pack-admin';

const pack = (packId: string) => `/data-packs/${encodeURIComponent(packId)}`;

export function fetchDataPacks(
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackListResponse> {
  return requestAdminJson('/data-packs', token, environment);
}

/** Publishes a .json.gz or .sqlite.gz file as the pack's next version. */
export function uploadDataPack(
  packId: string,
  file: File,
  note: string,
  baseVersion: number,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry> {
  const form = new FormData();
  form.append('file', file, file.name);
  form.append('note', note);
  form.append('base_version', String(baseVersion));
  return requestAdminJson(pack(packId), token, environment, { method: 'POST', form });
}

export function rollbackDataPack(
  packId: string,
  version: number,
  baseVersion: number,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry> {
  return requestAdminJson(`${pack(packId)}/rollback`, token, environment, {
    method: 'POST',
    body: { version, base_version: baseVersion },
  });
}

/** One time: lists the pack's pre-manifest file as version 1. */
export function adoptLegacyDataPack(
  packId: string,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry | null> {
  return requestAdminJson(`${pack(packId)}/adopt-legacy`, token, environment, { method: 'POST' });
}

export function fetchPackRecipes(
  packId: string,
  params: { q: string; offset: number; limit: number },
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PackRecipeListResponse> {
  const search = new URLSearchParams({
    q: params.q,
    offset: String(params.offset),
    limit: String(params.limit),
  });
  return requestAdminJson(`${pack(packId)}/recipes?${search.toString()}`, token, environment);
}

export function savePackRecipe(
  packId: string,
  recipe: PackRecipe,
  baseVersion: number,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry> {
  return requestAdminJson(`${pack(packId)}/recipes/${encodeURIComponent(recipe.id)}`, token, environment, {
    method: 'PUT',
    body: { base_version: baseVersion, item: recipe },
  });
}

export function deletePackRecipe(
  packId: string,
  recipeId: string,
  baseVersion: number,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry> {
  const search = new URLSearchParams({ base_version: String(baseVersion) });
  return requestAdminJson(
    `${pack(packId)}/recipes/${encodeURIComponent(recipeId)}?${search.toString()}`,
    token,
    environment,
    { method: 'DELETE' }
  );
}
