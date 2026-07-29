export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type HasImageFilter = 'all' | 'true' | 'false';

export interface MealCatalogIngredient {
  display_name: string;
  quantity?: number | null;
  unit?: string | null;
}

export interface MealCatalogItem {
  id: string;
  catalog_key: string;
  name: string;
  cuisine: string;
  description: string | null;
  image_url: string | null;
  meal_types: MealType[];
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  ingredient_count: number;
  ingredients?: MealCatalogIngredient[];
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MealCatalogListParams {
  q?: string;
  cuisine?: string;
  meal_type?: MealType | '';
  has_image?: HasImageFilter;
  is_active?: 'all' | 'true' | 'false';
  limit: number;
  offset: number;
}

export interface MealCatalogListResponse {
  items: MealCatalogItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface GenerateMealImageResponse {
  item: MealCatalogItem;
  image_url: string;
}

export interface MealCatalogImportOptions {
  dry_run?: boolean;
  partial: boolean;
  skip_exact_cuisine_count: boolean;
  expected_recipe_count: number;
  min_per_cuisine_meal_type: number;
  resolver_map: Record<string, number>;
  auto_resolve_threshold: number | null;
  resolve_all_best_effort: boolean;
}

export interface MealCatalogImportRequest extends MealCatalogImportOptions {
  manifest: Record<string, unknown>;
}

export interface MealCatalogResolutionCandidate {
  food_reference_id: number;
  name: string;
  name_normalized: string | null;
  source: string;
  is_verified: boolean;
  score: number;
}

export interface MealCatalogResolutionIssue {
  recipe_index: number;
  recipe_key: string;
  ingredient_index: number;
  ingredient_name: string;
  normalized_name: string;
  reason: string;
  candidates: MealCatalogResolutionCandidate[];
}

export interface MealCatalogUnverifiedReference {
  recipe_index: number;
  recipe_key: string;
  ingredient_index: number;
  ingredient_name: string;
  food_reference_id: number;
  food_reference_name: string;
  source: string;
}

export interface MealCatalogReviewRequired {
  recipe_index: number;
  recipe_key: string;
  reason: string;
  matched_catalog_key: string;
  ingredient_jaccard: number;
}

export interface MealCatalogImportResponse {
  validation: {
    manifest_digest: string;
    recipe_count: number;
    errors: string[];
    coverage: Record<string, Record<string, number>>;
  };
  manifest_digest: string;
  recipe_count: number;
  coverage: Record<string, Record<string, number>>;
  inserted: number;
  skipped_existing: number;
  dry_run: boolean;
  applied: boolean;
  errors: string[];
  issues: MealCatalogResolutionIssue[];
  unverified_references?: MealCatalogUnverifiedReference[];
  review_required: MealCatalogReviewRequired[];
}

export interface MealCatalogEnrichmentResponse {
  validation: MealCatalogImportResponse['validation'];
  attempted: number;
  enriched: number;
  skipped_existing: number;
}

export interface MealCatalogApproveFoodReferenceResponse {
  food_reference_id: number;
  name: string;
  source: string;
  is_verified: boolean;
}
