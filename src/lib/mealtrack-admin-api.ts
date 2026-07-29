import type {
  GenerateMealImageResponse,
  HasImageFilter,
  MealCatalogItem,
  MealCatalogListParams,
  MealCatalogListResponse,
  MealCatalogImportRequest,
  MealCatalogImportResponse,
  MealCatalogEnrichmentResponse,
} from '@/types/meal-catalog';

const USE_PROXY = process.env.NEXT_PUBLIC_MEALTRACK_ADMIN_USE_PROXY === 'true';
const API_BASE_URL = process.env.NEXT_PUBLIC_MEALTRACK_API_URL?.replace(/\/$/, '');

export class MealTrackAdminApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'MealTrackAdminApiError';
  }
}

export function hasMealTrackApiUrl(): boolean {
  return USE_PROXY || Boolean(API_BASE_URL);
}

export async function fetchMealCatalog(
  params: MealCatalogListParams,
  token: string
): Promise<MealCatalogListResponse> {
  if (!USE_PROXY && !API_BASE_URL) {
    return getPreviewMealCatalog(params);
  }

  const response = await fetch(`${adminBasePath()}/meal-catalog?${toQuery(params)}`, {
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    throw new MealTrackAdminApiError(await readError(response), response.status);
  }

  return response.json() as Promise<MealCatalogListResponse>;
}

export async function generateMealCatalogImage(
  catalogId: string,
  token: string
): Promise<GenerateMealImageResponse> {
  if (!USE_PROXY && !API_BASE_URL) {
    throw new MealTrackAdminApiError('Preview mode: backend generate endpoint is not configured.');
  }

  const response = await fetch(
    `${adminBasePath()}/meal-catalog/${encodeURIComponent(catalogId)}/generate-image`,
    {
      method: 'POST',
      headers: buildHeaders(token),
    }
  );

  if (!response.ok) {
    throw new MealTrackAdminApiError(await readError(response), response.status);
  }

  return response.json() as Promise<GenerateMealImageResponse>;
}

export async function resolveMealCatalogManifest(
  request: MealCatalogImportRequest,
  token: string
): Promise<MealCatalogImportResponse> {
  return postMealCatalogImportAction<MealCatalogImportResponse>('resolve', request, token);
}

export async function importMealCatalogManifest(
  request: MealCatalogImportRequest,
  token: string
): Promise<MealCatalogImportResponse> {
  return postMealCatalogImportAction<MealCatalogImportResponse>('import', request, token);
}

export async function enrichMealCatalogManifest(
  request: MealCatalogImportRequest,
  token: string
): Promise<MealCatalogEnrichmentResponse> {
  return postMealCatalogImportAction<MealCatalogEnrichmentResponse>('enrich', request, token);
}

async function postMealCatalogImportAction<T>(
  action: 'enrich' | 'resolve' | 'import',
  request: MealCatalogImportRequest,
  token: string
): Promise<T> {
  if (!USE_PROXY && !API_BASE_URL) {
    throw new MealTrackAdminApiError('Configure the MealTrack API before using catalog import.');
  }
  const response = await fetch(`${adminBasePath()}/meal-catalog/${action}`, {
    method: 'POST',
    headers: { ...buildHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new MealTrackAdminApiError(await readError(response), response.status);
  }
  return response.json() as Promise<T>;
}

function adminBasePath(): string {
  return USE_PROXY ? '/api/mealtrack-admin' : `${API_BASE_URL}/v1/admin`;
}

function buildHeaders(token: string): HeadersInit {
  const headers: HeadersInit = { Accept: 'application/json' };
  if (token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}

function toQuery(params: MealCatalogListParams): string {
  const search = new URLSearchParams();
  search.set('limit', String(params.limit));
  search.set('offset', String(params.offset));
  appendIfPresent(search, 'q', params.q);
  appendIfPresent(search, 'cuisine', params.cuisine);
  appendIfPresent(search, 'meal_type', params.meal_type);
  appendIfPresent(search, 'has_image', filterValue(params.has_image));
  appendIfPresent(search, 'is_active', filterValue(params.is_active));
  return search.toString();
}

function filterValue(value?: HasImageFilter | 'all' | 'true' | 'false'): string {
  return !value || value === 'all' ? '' : value;
}

function appendIfPresent(search: URLSearchParams, key: string, value?: string): void {
  if (value && value.trim()) {
    search.set(key, value.trim());
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: unknown; message?: unknown };
    const detail = payload.detail || payload.message;
    if (typeof detail === 'string') return detail;
    if (detail) return JSON.stringify(detail);
    return `MealTrack request failed (${response.status})`;
  } catch {
    return `MealTrack request failed (${response.status})`;
  }
}

function getPreviewMealCatalog(params: MealCatalogListParams): MealCatalogListResponse {
  const filtered = PREVIEW_MEALS.filter((meal) => {
    const query = (params.q || '').toLowerCase();
    const matchesQuery =
      !query ||
      meal.name.toLowerCase().includes(query) ||
      meal.cuisine.toLowerCase().includes(query) ||
      meal.catalog_key.toLowerCase().includes(query);
    const matchesCuisine = !params.cuisine || meal.cuisine === params.cuisine;
    const matchesType = !params.meal_type || meal.meal_types.includes(params.meal_type);
    const matchesImage =
      params.has_image === 'false'
        ? !meal.image_url
        : params.has_image === 'true'
          ? Boolean(meal.image_url)
          : true;
    const matchesActive =
      params.is_active === 'false'
        ? !meal.is_active
        : params.is_active === 'true'
          ? meal.is_active
          : true;
    return matchesQuery && matchesCuisine && matchesType && matchesImage && matchesActive;
  });

  return {
    items: filtered.slice(params.offset, params.offset + params.limit),
    total: filtered.length,
    limit: params.limit,
    offset: params.offset,
  };
}

const PREVIEW_MEALS: MealCatalogItem[] = [
  {
    id: 'preview-001',
    catalog_key: 'vietnamese-chicken-rice',
    name: 'Vietnamese Chicken Rice',
    cuisine: 'vietnamese',
    description: 'Lean chicken, jasmine rice, herbs, cucumber, and light dipping sauce.',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    meal_types: ['lunch', 'dinner'],
    calories: 520,
    protein_g: 38,
    carbs_g: 58,
    fat_g: 14,
    fiber_g: 5,
    ingredient_count: 7,
    ingredients: [{ display_name: 'Chicken breast' }, { display_name: 'Jasmine rice' }],
    is_active: true,
  },
  {
    id: 'preview-002',
    catalog_key: 'korean-tofu-breakfast-bowl',
    name: 'Korean Tofu Breakfast Bowl',
    cuisine: 'korean',
    description: 'Soft tofu, egg, brown rice, kimchi, spinach, and sesame.',
    image_url: null,
    meal_types: ['breakfast'],
    calories: 430,
    protein_g: 27,
    carbs_g: 44,
    fat_g: 16,
    fiber_g: 7,
    ingredient_count: 8,
    ingredients: [{ display_name: 'Soft tofu' }, { display_name: 'Egg' }],
    is_active: true,
  },
  {
    id: 'preview-003',
    catalog_key: 'japanese-salmon-bento',
    name: 'Japanese Salmon Bento',
    cuisine: 'japanese',
    description: 'Grilled salmon, rice, edamame, pickles, and roasted vegetables.',
    image_url: null,
    meal_types: ['lunch'],
    calories: 610,
    protein_g: 42,
    carbs_g: 62,
    fat_g: 21,
    fiber_g: 8,
    ingredient_count: 9,
    ingredients: [{ display_name: 'Salmon' }, { display_name: 'Edamame' }],
    is_active: true,
  },
];
