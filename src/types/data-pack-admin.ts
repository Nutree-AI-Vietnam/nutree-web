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
  current: DataPackEntry;
  history: DataPackEntry[];
}

export interface DataPackListResponse {
  updated_at: string;
  packs: DataPack[];
}

/** One recipe as the app reads it; other keys pass through untouched. */
export interface PackRecipe {
  id: string;
  name?: string;
  calories?: number;
  image_url?: string | null;
  meal_types?: string[];
  [key: string]: unknown;
}

export interface PackRecipeListResponse {
  pack_id: string;
  version: number;
  total: number;
  items: PackRecipe[];
}

/** Every pack the app reads; the manifest may not list all of them yet. */
export const KNOWN_DATA_PACKS = [
  'recipes_en',
  'recipes_en_AU',
  'recipes_en_GB',
  'recipes_en_CA',
  'recipes_de',
  'recipes_es',
  'recipes_ko',
  'food_vi',
  'food_en',
  'supplements',
] as const;
