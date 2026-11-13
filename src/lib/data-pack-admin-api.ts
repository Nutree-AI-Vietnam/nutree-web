import { requestAdminJson } from '@/lib/mealtrack-admin-api';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';
import type {
  DataPackEntry,
  DataPackListResponse,
  PackItem,
  PackItemListResponse,
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

/** Prod only: publishes the exact file SIT has as prod's next version. */
export function promoteDataPack(
  packId: string,
  baseVersion: number,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry> {
  return requestAdminJson(`${pack(packId)}/promote`, token, environment, {
    method: 'POST',
    body: { base_version: baseVersion },
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

export function fetchPackItems<T extends PackItem>(
  packId: string,
  params: { q: string; offset: number; limit: number },
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<PackItemListResponse<T>> {
  const search = new URLSearchParams({
    q: params.q,
    offset: String(params.offset),
    limit: String(params.limit),
  });
  return requestAdminJson(`${pack(packId)}/items?${search.toString()}`, token, environment);
}

/** Adds or replaces one row and publishes the pack as its next version. */
export function savePackItem(
  packId: string,
  item: PackItem,
  baseVersion: number,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry> {
  return requestAdminJson(`${pack(packId)}/items/${encodeURIComponent(item.id)}`, token, environment, {
    method: 'PUT',
    body: { base_version: baseVersion, item },
  });
}

export function deletePackItem(
  packId: string,
  itemId: string,
  baseVersion: number,
  token: string,
  environment: MealTrackAdminEnvironment
): Promise<DataPackEntry> {
  const search = new URLSearchParams({ base_version: String(baseVersion) });
  return requestAdminJson(
    `${pack(packId)}/items/${encodeURIComponent(itemId)}?${search.toString()}`,
    token,
    environment,
    { method: 'DELETE' }
  );
}
