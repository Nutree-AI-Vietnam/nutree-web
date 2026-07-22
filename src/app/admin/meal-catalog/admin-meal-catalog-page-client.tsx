'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { MealCatalogFilters } from '@/components/admin/MealCatalogFilters';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { MealCatalogStats } from '@/components/admin/MealCatalogStats';
import { MealCatalogTable } from '@/components/admin/MealCatalogTable';
import {
  MealTrackAdminApiError,
  fetchMealCatalog,
  generateMealCatalogImage,
  hasMealTrackApiUrl,
} from '@/lib/mealtrack-admin-api';
import type {
  HasImageFilter,
  MealCatalogItem,
  MealCatalogListParams,
  MealCatalogListResponse,
  MealType,
} from '@/types/meal-catalog';

const PAGE_SIZE = 25;

export function AdminMealCatalogPageClient() {
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState<MealType | ''>('');
  const [hasImage, setHasImage] = useState<HasImageFilter>('all');
  const [isActive, setIsActive] = useState<'all' | 'true' | 'false'>('true');
  const [token, setToken] = useState('');
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<MealCatalogListResponse>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const isPreviewMode = !hasMealTrackApiUrl();
  const params = useMemo<MealCatalogListParams>(
    () => ({
      q,
      cuisine,
      meal_type: mealType,
      has_image: hasImage,
      is_active: isActive,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [cuisine, hasImage, isActive, mealType, page, q]
  );

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchMealCatalog(params, token);
      setData(response);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [params, token]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog, reloadKey]);

  const resetPage = useCallback((callback: () => void) => {
    setPage(0);
    callback();
  }, []);

  const handleGenerateImage = useCallback(
    async (item: MealCatalogItem) => {
      setGeneratingId(item.id);
      setActionMessage(null);
      try {
        const response = await generateMealCatalogImage(item.id, token);
        setData((current) => ({
          ...current,
          items: current.items.map((currentItem) =>
            currentItem.id === item.id ? response.item : currentItem
          ),
        }));
        setActionMessage(`Generated image for ${item.name}.`);
      } catch (requestError) {
        setActionMessage(toErrorMessage(requestError));
      } finally {
        setGeneratingId(null);
      }
    },
    [token]
  );

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const visibleStart = data.total === 0 ? 0 : data.offset + 1;
  const visibleEnd = Math.min(data.offset + data.items.length, data.total);

  return (
    <div className="min-h-screen bg-[#EEF3F0] text-foreground">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <p className="text-xs font-bold uppercase text-primary-emerald">admin.nutreeai.com</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
              Meal Catalog
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Review every catalog meal, spot missing images, and generate images once the backend endpoint is ready.
            </p>
          </div>
          <div className="border border-border bg-background px-3 py-2 text-xs font-semibold text-muted">
            {isPreviewMode ? 'Contract preview' : 'Connected to MealTrack'}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-4 px-4 py-5 md:px-6">
        {isPreviewMode && (
          <AdminBanner
            tone="warning"
            title="Backend not configured"
            message="Set NEXT_PUBLIC_MEALTRACK_API_URL to call MealTrack. These rows are contract preview data for UI review only."
          />
        )}
        {error && <AdminBanner tone="error" title="Catalog request failed" message={error} />}
        {actionMessage && (
          <AdminBanner tone="info" title="Action status" message={actionMessage} />
        )}

        <MealCatalogStats items={data.items} total={data.total} isPreviewMode={isPreviewMode} />
        <MealCatalogFilters
          q={q}
          cuisine={cuisine}
          mealType={mealType}
          hasImage={hasImage}
          isActive={isActive}
          token={token}
          onQChange={(value) => resetPage(() => setQ(value))}
          onCuisineChange={(value) => resetPage(() => setCuisine(value))}
          onMealTypeChange={(value) => resetPage(() => setMealType(value))}
          onHasImageChange={(value) => resetPage(() => setHasImage(value))}
          onIsActiveChange={(value) => resetPage(() => setIsActive(value))}
          onTokenChange={setToken}
          onRefresh={() => setReloadKey((value) => value + 1)}
        />

        <MealCatalogPagination
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          total={data.total}
          visibleStart={visibleStart}
          visibleEnd={visibleEnd}
          onPrevious={() => setPage((value) => Math.max(0, value - 1))}
          onNext={() => setPage((value) => value + 1)}
        />

        <MealCatalogTable
          items={data.items}
          generatingId={generatingId}
          isPreviewMode={isPreviewMode}
          onGenerateImage={handleGenerateImage}
        />
      </main>
    </div>
  );
}

function toErrorMessage(error: unknown): string {
  if (error instanceof MealTrackAdminApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected admin catalog error.';
}

const emptyData: MealCatalogListResponse = {
  items: [],
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
};
