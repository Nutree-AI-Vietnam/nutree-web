export interface DataPackEntry {
  version: number;
  sha256: string;
  size: number;
  path: string;
  published_at: string;
  note: string;
}

export interface DataPack {
  pack_id: string;
  /** Null on prod when only SIT has the pack so far. */
  current: DataPackEntry | null;
  history: DataPackEntry[];
  /** On prod: SIT's current version, to promote. */
  sit: DataPackEntry | null;
}

export type DataPackChannel = 'sit' | 'prod';

export interface DataPackListResponse {
  channel: DataPackChannel;
  updated_at: string;
  packs: DataPack[];
}

/** One row of a pack. Keys the editor does not know pass through untouched. */
export interface PackItem {
  id: string;
  [key: string]: unknown;
}

/** One recipe as the app reads it; other keys pass through untouched. */
export interface PackRecipe extends PackItem {
  id: string;
  name?: string;
  calories?: number;
  image_url?: string | null;
  meal_types?: string[];
  [key: string]: unknown;
}

export interface PackItemListResponse<T extends PackItem = PackItem> {
  pack_id: string;
  version: number;
  total: number;
  items: T[];
}

export interface PackFood extends PackItem {
  name: string;
  brand: string | null;
  calories_per_100g: number | null;
  protein_per_100g: number | null;
  carbs_per_100g: number | null;
  fat_per_100g: number | null;
  serving_label: string;
}

export interface PackSupplement extends PackItem {
  name: string;
  brand: string | null;
  form: string;
  unit_label: string;
  units_per_serving: number;
  sold_in_vn: boolean;
  nutrients_json: Record<string, number>;
  barcodes: string[];
  image_url: string | null;
}

/**
 * Every pack the phone catalog reads.
 * Layout on the public food-packs CDN (next app release):
 *   mobile_packs/manifest.json
 *   mobile_packs/recipes/<code>/<version>-<hash>.sqlite.gz
 *   mobile_packs/foods/<code>/<version>-<hash>.sqlite.gz
 *   mobile_packs/supplements/<version>-<hash>.sqlite.gz
 * Legacy installs still use packs/, v1/, and recipes/v1/.
 */
export const DATA_PACK_CDN_ORIGIN =
  'https://pub-b66d05049d224555a2942d7e35458ecc.r2.dev';
export const MOBILE_PACKS_MANIFEST_URL = `${DATA_PACK_CDN_ORIGIN}/mobile_packs/manifest.json`;

export const KNOWN_DATA_PACKS = [
  'recipes_en',
  'recipes_en_AU',
  'recipes_en_GB',
  'recipes_en_CA',
  'recipes_de',
  'recipes_es',
  'recipes_ko',
  'recipes_vi',
  'food_vi',
  'food_en',
  'food_en_AU',
  'food_en_GB',
  'food_en_CA',
  'food_de',
  'food_es',
  'food_ko',
  'supplements',
] as const;
