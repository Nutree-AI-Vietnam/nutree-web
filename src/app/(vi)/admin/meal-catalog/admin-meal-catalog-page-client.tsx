'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { MealCatalogFilters } from '@/components/admin/MealCatalogFilters';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { MealCatalogStats } from '@/components/admin/MealCatalogStats';
import { MealCatalogTable } from '@/components/admin/MealCatalogTable';
import { MealCatalogEditor } from '@/components/admin/MealCatalogEditor';
import { MealCatalogImportWorkspace } from '@/components/admin/MealCatalogImportWorkspace';
import { adminErrorMessage as toErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import {
  fetchMealCatalog,
  generateMealCatalogImage,
  enrichMealCatalogManifest,
  importMealCatalogManifest,
  approveMealCatalogFoodReference,
  resolveMealCatalogManifest,
  updateMealCatalog,
  type MealCatalogUpdate,
} from '@/lib/mealtrack-admin-api';
import type {
  HasImageFilter,
  MealCatalogItem,
  MealCatalogListParams,
  MealCatalogListResponse,
  MealCatalogImportRequest,
  MealCatalogImportResponse,
  MealCatalogEnrichmentResponse,
  MealType,
} from '@/types/meal-catalog';

const PAGE_SIZE = 25;

export function AdminMealCatalogPageClient() {
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState<MealType | ''>('');
  const [hasImage, setHasImage] = useState<HasImageFilter>('all');
  const [isActive, setIsActive] = useState<'all' | 'true' | 'false'>('true');
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<MealCatalogListResponse>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MealCatalogItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeView, setActiveView] = useState<'catalog' | 'import'>('catalog');
  const [importResult, setImportResult] = useState<MealCatalogImportResponse | null>(null);
  const [enrichmentResult, setEnrichmentResult] = useState<MealCatalogEnrichmentResponse | null>(null);
  const [lastImportAction, setLastImportAction] = useState<'enrich' | 'import' | 'preview' | 'resolve' | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImportBusy, setIsImportBusy] = useState(false);

  const resetPageData = useCallback(() => {
    setPage(0);
    setData(emptyData);
    setError(null);
    setActionMessage(null);
    setImportResult(null);
    setEnrichmentResult(null);
    setLastImportAction(null);
    setImportError(null);
  }, []);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReset: resetPageData, onReload: reload });
  const { environment, getValidToken, isPreviewMode, session } = admin;
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
    if (!isPreviewMode && !session) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = isPreviewMode ? '' : await getValidToken();
      const response = await fetchMealCatalog(params, token, environment);
      setData(response);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [environment, getValidToken, isPreviewMode, params, session]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog, reloadKey]);

  const resetPage = useCallback((callback: () => void) => {
    setPage(0);
    callback();
  }, []);

  useEffect(() => {
    const image = new URLSearchParams(window.location.search).get('has_image');
    if (image === 'true' || image === 'false') setHasImage(image);
  }, []);

  const handleGenerateImage = useCallback(
    async (item: MealCatalogItem, force = false) => {
      if (force && !window.confirm(`Tạo lại ảnh cho “${item.name}”? Ảnh hiện tại sẽ bị thay.`)) return;
      setGeneratingId(item.id);
      setActionMessage(null);
      try {
        const token = await getValidToken();
        const response = await generateMealCatalogImage(item.id, token, environment, force);
        setData((current) => ({
          ...current,
          items: current.items.map((currentItem) =>
            currentItem.id === item.id ? response.item : currentItem
          ),
        }));
        setActionMessage(force ? `Đã tạo lại ảnh cho ${item.name}.` : `Đã tạo ảnh cho ${item.name}.`);
        setEditing((current) => (current?.id === item.id ? response.item : current));
      } catch (requestError) {
        setActionMessage(toErrorMessage(requestError));
      } finally {
        setGeneratingId(null);
      }
    },
    [environment, getValidToken]
  );

  const handleSave = useCallback(
    async (item: MealCatalogItem, changes: MealCatalogUpdate) => {
      setIsSaving(true);
      setActionMessage(null);
      try {
        const token = await getValidToken();
        const saved = await updateMealCatalog(item.id, changes, token, environment);
        setData((current) => ({
          ...current,
          items: current.items.map((row) => (row.id === item.id ? saved : row)),
        }));
        setEditing(null);
        setActionMessage(`Đã lưu ${saved.name}. Nhập lại file seed sau này có thể ghi đè tên, bữa ăn và nguyên liệu.`);
      } catch (requestError) {
        setActionMessage(toErrorMessage(requestError));
      } finally {
        setIsSaving(false);
      }
    },
    [environment, getValidToken]
  );

  const runImportAction = useCallback(
    async (action: 'enrich' | 'resolve' | 'import', request: MealCatalogImportRequest) => {
      setIsImportBusy(true);
      setImportError(null);
      try {
        const token = await getValidToken();
        if (action === 'enrich') {
          const response = await enrichMealCatalogManifest(request, token, environment);
          setEnrichmentResult(response);
          setImportResult(null);
          setLastImportAction('enrich');
          return;
        }
        setEnrichmentResult(null);
        const response = action === 'resolve'
          ? await resolveMealCatalogManifest(request, token, environment)
          : await importMealCatalogManifest(request, token, environment);
        setImportResult(response);
        setLastImportAction(action === 'resolve' ? 'resolve' : request.dry_run ? 'preview' : 'import');
        if (response.applied) {
          setActionMessage(`Đã nhập ${response.inserted} món ăn.`);
          setReloadKey((value) => value + 1);
        }
      } catch (requestError) {
        setImportError(toErrorMessage(requestError));
      } finally {
        setIsImportBusy(false);
      }
    },
    [environment, getValidToken]
  );

  const approveFoodReference = useCallback(async (foodReferenceId: number): Promise<void> => {
    setIsImportBusy(true);
    setImportError(null);
    try {
      const token = await getValidToken();
      const response = await approveMealCatalogFoodReference(foodReferenceId, token, environment);
      setActionMessage(`Đã xác minh ${response.name} để đăng lên danh mục.`);
    } catch (requestError) {
      setImportError(toErrorMessage(requestError));
      throw requestError;
    } finally {
      setIsImportBusy(false);
    }
  }, [environment, getValidToken]);

  const approveFoodReferences = useCallback(async (foodReferenceIds: number[]): Promise<void> => {
    const uniqueIds = Array.from(new Set(foodReferenceIds));
    setIsImportBusy(true);
    setImportError(null);
    try {
      const token = await getValidToken();
      for (const foodReferenceId of uniqueIds) {
        await approveMealCatalogFoodReference(foodReferenceId, token, environment);
      }
      setActionMessage(`Đã xác minh ${uniqueIds.length} thực phẩm tham chiếu để đăng lên danh mục.`);
    } catch (requestError) {
      setImportError(toErrorMessage(requestError));
      throw requestError;
    } finally {
      setIsImportBusy(false);
    }
  }, [environment, getValidToken]);

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const visibleStart = data.total === 0 ? 0 : data.offset + 1;
  const visibleEnd = Math.min(data.offset + data.items.length, data.total);

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/meal-catalog"
      title="Danh mục món ăn"
      description="Catalog máy chủ dùng để lập kế hoạch bữa ăn. Thư viện công thức là file điện thoại tải về, và hai bên không tự cập nhật cho nhau. Sửa một món ở đây; nhập lại file seed có thể ghi đè tên, bữa ăn và nguyên liệu."
      toolbar={<>
        <button type="button" onClick={() => setActiveView('catalog')} className={`border px-3 py-2 text-xs font-medium ${activeView === 'catalog' ? 'border-[#1B4336] bg-[#1B4336] text-[#F4F1EA]' : 'border-[#D5CFC3] text-[#5C6B62] hover:border-[#1B4336]'}`}>Xem danh mục</button>
        <button type="button" onClick={() => { setActiveView('import'); setImportError(null); }} className={`border px-3 py-2 text-xs font-medium ${activeView === 'import' ? 'border-[#1B4336] bg-[#1B4336] text-[#F4F1EA]' : 'border-[#D5CFC3] text-[#5C6B62] hover:border-[#1B4336]'}`}>Nhập &amp; đối chiếu</button>
      </>}
    >
        {isPreviewMode && (
          <AdminBanner
            tone="warning"
            title="Chưa cấu hình backend"
            message="Hãy đặt NEXT_PUBLIC_MEALTRACK_API_URL để kết nối MealTrack. Các dòng này chỉ là dữ liệu mẫu để xem giao diện."
          />
        )}
        {error && <AdminBanner tone="error" title="Không tải được danh mục" message={error} />}
        {actionMessage && (
          <AdminBanner tone="info" title="Trạng thái thao tác" message={actionMessage} />
        )}

        {activeView === 'import' ? (
          <MealCatalogImportWorkspace
            isConnected={!isPreviewMode && Boolean(session)}
            isBusy={isImportBusy}
            result={importResult}
            enrichment={enrichmentResult}
            lastAction={lastImportAction}
            error={importError}
            onEnrich={(request) => void runImportAction('enrich', request)}
            onResolve={(request) => void runImportAction('resolve', request)}
            onPreview={(request) => void runImportAction('import', request)}
            onImport={(request) => void runImportAction('import', request)}
            onApproveFoodReference={approveFoodReference}
            onApproveFoodReferences={approveFoodReferences}
          />
        ) : <>
        <MealCatalogStats items={data.items} total={data.total} isPreviewMode={isPreviewMode} />
        <MealCatalogFilters
          q={q}
          cuisine={cuisine}
          mealType={mealType}
          hasImage={hasImage}
          isActive={isActive}
          onQChange={(value) => resetPage(() => setQ(value))}
          onCuisineChange={(value) => resetPage(() => setCuisine(value))}
          onMealTypeChange={(value) => resetPage(() => setMealType(value))}
          onHasImageChange={(value) => resetPage(() => setHasImage(value))}
          onIsActiveChange={(value) => resetPage(() => setIsActive(value))}
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
          onEdit={setEditing}
        />
        <MealCatalogEditor item={editing} isBusy={isSaving} onClose={() => setEditing(null)} onSave={(item, changes) => void handleSave(item, changes)} />
        </>}
    </AdminPageShell>
  );
}

const emptyData: MealCatalogListResponse = {
  items: [],
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
};
