'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminLoginPanel } from '@/components/admin/AdminLoginPanel';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { MealCatalogFilters } from '@/components/admin/MealCatalogFilters';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { MealCatalogStats } from '@/components/admin/MealCatalogStats';
import { MealCatalogTable } from '@/components/admin/MealCatalogTable';
import { MealCatalogImportWorkspace } from '@/components/admin/MealCatalogImportWorkspace';
import { AdminEnvironmentSwitcher } from '@/components/admin/AdminEnvironmentSwitcher';
import {
  MealTrackAdminApiError,
  fetchMealCatalog,
  generateMealCatalogImage,
  hasMealTrackApiUrl,
  isMealTrackAdminProxyEnabled,
  enrichMealCatalogManifest,
  importMealCatalogManifest,
  approveMealCatalogFoodReference,
  resolveMealCatalogManifest,
} from '@/lib/mealtrack-admin-api';
import {
  type AdminAuthSession,
  FirebaseAdminAuthError,
  hasFirebaseAdminAuthConfig,
  refreshAdminSession,
  signInAdminWithEmailPassword,
} from '@/lib/firebase-admin-auth';
import type {
  HasImageFilter,
  MealCatalogItem,
  MealCatalogListParams,
  MealCatalogListResponse,
  MealCatalogImportRequest,
  MealCatalogImportResponse,
  MealCatalogEnrichmentResponse,
  MealTrackAdminEnvironment,
  MealType,
} from '@/types/meal-catalog';

const PAGE_SIZE = 25;
const SESSION_STORAGE_KEY = 'nutree-admin-auth-session';
const ENVIRONMENT_STORAGE_KEY = 'nutree-admin-target-environment';

export function AdminMealCatalogPageClient() {
  const [q, setQ] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState<MealType | ''>('');
  const [hasImage, setHasImage] = useState<HasImageFilter>('all');
  const [isActive, setIsActive] = useState<'all' | 'true' | 'false'>('true');
  const [session, setSession] = useState<AdminAuthSession | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<MealCatalogListResponse>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'catalog' | 'import'>('catalog');
  const [importResult, setImportResult] = useState<MealCatalogImportResponse | null>(null);
  const [enrichmentResult, setEnrichmentResult] = useState<MealCatalogEnrichmentResponse | null>(null);
  const [lastImportAction, setLastImportAction] = useState<'enrich' | 'import' | 'preview' | 'resolve' | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImportBusy, setIsImportBusy] = useState(false);
  const [environment, setEnvironment] = useState<MealTrackAdminEnvironment>('sit');

  const isPreviewMode = !hasMealTrackApiUrl();
  const isProxyEnabled = isMealTrackAdminProxyEnabled();
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

  useEffect(() => {
    const restored = readStoredSession();
    if (restored) {
      setSession(restored);
      setLoginEmail(restored.email);
    }
    setEnvironment(readStoredEnvironment());
    setIsRestoringSession(false);
  }, []);

  const getValidToken = useCallback(async (): Promise<string> => {
    if (!session) {
      throw new MealTrackAdminApiError('Sign in before calling MealTrack admin endpoints.', 401);
    }
    if (Date.now() < session.expiresAt - 60_000) {
      return session.idToken;
    }

    const refreshed = await refreshAdminSession(session.refreshToken);
    const nextSession = {
      ...refreshed,
      email: session.email,
    };
    storeSession(nextSession);
    setSession(nextSession);
    return nextSession.idToken;
  }, [session]);

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

  const handleGenerateImage = useCallback(
    async (item: MealCatalogItem) => {
      setGeneratingId(item.id);
      setActionMessage(null);
      try {
        const token = await getValidToken();
        const response = await generateMealCatalogImage(item.id, token, environment);
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
    [environment, getValidToken]
  );

  const handleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    setLoginError(null);
    try {
      const nextSession = await signInAdminWithEmailPassword(
        loginEmail.trim(),
        loginPassword
      );
      storeSession(nextSession);
      setSession(nextSession);
      setLoginPassword('');
      setReloadKey((value) => value + 1);
    } catch (requestError) {
      setLoginError(toErrorMessage(requestError));
    } finally {
      setIsSigningIn(false);
    }
  }, [loginEmail, loginPassword]);

  const handleSignOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setData(emptyData);
    setError(null);
    setActionMessage(null);
    setImportResult(null);
    setEnrichmentResult(null);
    setLastImportAction(null);
    setImportError(null);
  }, []);

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
          setActionMessage(`Imported ${response.inserted} meal${response.inserted === 1 ? '' : 's'}.`);
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
      setActionMessage(`Verified ${response.name} for catalog publication.`);
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
      setActionMessage(`Verified ${uniqueIds.length} food reference${uniqueIds.length === 1 ? '' : 's'} for catalog publication.`);
    } catch (requestError) {
      setImportError(toErrorMessage(requestError));
      throw requestError;
    } finally {
      setIsImportBusy(false);
    }
  }, [environment, getValidToken]);

  const handleEnvironmentChange = useCallback((nextEnvironment: MealTrackAdminEnvironment) => {
    if (nextEnvironment === environment) return;
    if (nextEnvironment === 'prod' && !window.confirm('Switch to PROD? You will be viewing and operating on live production data.')) return;
    sessionStorage.setItem(ENVIRONMENT_STORAGE_KEY, nextEnvironment);
    setEnvironment(nextEnvironment);
    setPage(0);
    setData(emptyData);
    setError(null);
    setActionMessage(null);
    setImportResult(null);
    setEnrichmentResult(null);
    setLastImportAction(null);
    setImportError(null);
    setReloadKey((value) => value + 1);
  }, [environment]);

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const visibleStart = data.total === 0 ? 0 : data.offset + 1;
  const visibleEnd = Math.min(data.offset + data.items.length, data.total);

  if (isRestoringSession) {
    return <div className="min-h-screen bg-[#EEF3F0]" />;
  }

  if (!isPreviewMode && !session) {
    return (
      <AdminLoginPanel
        email={loginEmail}
        error={loginError}
        isConfigured={hasFirebaseAdminAuthConfig()}
        isSigningIn={isSigningIn}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onSubmit={handleSignIn}
        password={loginPassword}
      />
    );
  }

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
          <div className="flex flex-wrap items-center gap-2">
            <AdminEnvironmentSwitcher environment={environment} isProxyEnabled={isProxyEnabled} onChange={handleEnvironmentChange} />
            {!isPreviewMode && session && (
              <div className="border border-border bg-background px-3 py-2 text-xs font-semibold text-muted">
                {session.email}
              </div>
            )}
            {!isPreviewMode && (
              <button
                className="border border-border bg-white px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-primary-teal hover:text-primary-forest"
                onClick={handleSignOut}
                type="button"
              >
                Sign out
              </button>
            )}
            <div className="border border-border bg-background px-3 py-2 text-xs font-semibold text-muted">
              {isPreviewMode
                ? 'Contract preview'
                : !isProxyEnabled
                  ? 'Direct API target'
                  : environment === 'prod'
                    ? 'PROD — live data'
                    : 'SIT — test data'}
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] gap-1 px-4 pb-4 md:px-6">
          <button type="button" onClick={() => setActiveView('catalog')} className={`border px-3 py-2 text-xs font-bold ${activeView === 'catalog' ? 'border-primary-forest bg-primary-forest text-white' : 'border-border text-muted hover:border-primary-teal'}`}>Catalog viewer</button>
          <button type="button" onClick={() => { setActiveView('import'); setImportError(null); }} className={`border px-3 py-2 text-xs font-bold ${activeView === 'import' ? 'border-primary-forest bg-primary-forest text-white' : 'border-border text-muted hover:border-primary-teal'}`}>Import &amp; resolve</button>
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
        />
        </>}
      </main>
    </div>
  );
}

function toErrorMessage(error: unknown): string {
  if (error instanceof MealTrackAdminApiError || error instanceof FirebaseAdminAuthError) {
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

function readStoredSession(): AdminAuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const session = JSON.parse(raw) as AdminAuthSession;
    if (!session.idToken || !session.refreshToken || !session.email) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function storeSession(session: AdminAuthSession): void {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function readStoredEnvironment(): MealTrackAdminEnvironment {
  return sessionStorage.getItem(ENVIRONMENT_STORAGE_KEY) === 'prod' ? 'prod' : 'sit';
}
