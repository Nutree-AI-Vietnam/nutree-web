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
