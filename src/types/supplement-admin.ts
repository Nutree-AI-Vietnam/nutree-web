export const SUPPLEMENT_FORMS = [
  'capsule',
  'softgel',
  'tablet',
  'chewable',
  'gummy',
  'effervescent',
  'powder',
  'liquid',
  'drops',
  'sachet',
] as const;

export type SupplementForm = (typeof SUPPLEMENT_FORMS)[number];

/** Tracked nutrients per unit, in the backend's canonical units. */
export const SUPPLEMENT_NUTRIENT_UNITS: Record<string, string> = {
  vitamin_a: 'mcg RAE',
  vitamin_a_preformed: 'mcg (preformed)',
  vitamin_c: 'mg',
  vitamin_d: 'mcg',
  vitamin_e: 'mg',
  vitamin_k: 'mcg',
  thiamin: 'mg',
  riboflavin: 'mg',
  niacin: 'mg',
  vitamin_b6: 'mg',
  vitamin_b12: 'mcg',
  folate: 'mcg DFE',
  calcium: 'mg',
  iron: 'mg',
  magnesium: 'mg',
  phosphorus: 'mg',
  potassium: 'mg',
  sodium: 'mg',
  zinc: 'mg',
  selenium: 'mcg',
};

export type SupplementReviewKind = 'catalog' | 'scan';
export type SupplementReviewAction = 'approve' | 'edit' | 'reject';

export interface SupplementLabelRow {
  name: string;
  amount: number | null;
  unit: string | null;
  nutrient: string | null;
}

export interface SupplementReviewItem {
  id: string;
  kind: SupplementReviewKind;
  catalog_key: string | null;
  brand: string | null;
  name: string;
  name_original: string | null;
  form: SupplementForm;
  unit_label: string;
  units_per_serving: number;
  nutrients: Record<string, number>;
  label_rows: SupplementLabelRow[];
  barcodes: string[];
  origin_country: string | null;
  sold_in_vn: boolean;
  is_medicine_in_vn: boolean;
  /** Logged as food (protein powder, gainer, shake), never as a dose. */
  macro_bearing: boolean;
  source: string;
  source_name: string | null;
  source_url: string | null;
  label_image_url: string | null;
  reasons: string[];
  review_status: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string | null;
}

export interface SupplementReviewListResponse {
  items: SupplementReviewItem[];
  total: number;
  limit: number;
  offset: number;
}

/** Only the fields sent are changed; only `brand` may be null. */
export interface SupplementEdits {
  brand?: string | null;
  name?: string;
  form?: SupplementForm;
  unit_label?: string;
  units_per_serving?: number;
  nutrients?: Record<string, number>;
  sold_in_vn?: boolean;
  is_medicine_in_vn?: boolean;
  macro_bearing?: boolean;
}

export interface SupplementReviewResponse {
  item: SupplementReviewItem;
  merged_into: string | null;
}
