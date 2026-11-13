'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { DataPackRecipeEditor } from '@/components/admin/DataPackRecipeEditor';
import { DataPackTable } from '@/components/admin/DataPackTable';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import {
  adoptLegacyDataPack,
  deletePackRecipe,
  fetchDataPacks,
  fetchPackRecipes,
  rollbackDataPack,
  savePackRecipe,
  uploadDataPack,
} from '@/lib/data-pack-admin-api';
import {
  KNOWN_DATA_PACKS,
  type DataPack,
  type DataPackListResponse,
  type PackRecipe,
  type PackRecipeListResponse,
} from '@/types/data-pack-admin';

const PAGE_SIZE = 50;
const BUTTON = 'whitespace-nowrap border border-border bg-white px-3 py-1.5 text-xs font-bold disabled:text-muted';

type Message = { tone: 'info' | 'error'; text: string };

export function AdminDataPacksPageClient() {
  const [packs, setPacks] = useState<DataPackListResponse>({ updated_at: '', packs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [recipePack, setRecipePack] = useState('recipes_en');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [page, setPage] = useState(0);
  const [recipes, setRecipes] = useState<PackRecipeListResponse | null>(null);
  const [editing, setEditing] = useState<{ recipe: PackRecipe; isNew: boolean } | null>(null);
  const latestRecipes = useRef(0);

  const reset = useCallback(() => {
    setPacks({ updated_at: '', packs: [] });
    setRecipes(null);
    setEditing(null);
    setMessage(null);
    setError(null);
  }, []);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReset: reset, onReload: reload });
  const { environment, getValidToken, isPreviewMode, session } = admin;

  useEffect(() => {
    if (isPreviewMode || !session) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    (async () => {
      try {
        const response = await fetchDataPacks(await getValidToken(), environment);
        if (!cancelled) setPacks(response);
      } catch (requestError) {
        if (!cancelled) setError(adminErrorMessage(requestError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [environment, getValidToken, isPreviewMode, session, reloadKey]);

  useEffect(() => {
    if (isPreviewMode || !session) return;
    const request = ++latestRecipes.current;
    (async () => {
      try {
        const response = await fetchPackRecipes(
          recipePack,
          { q: submittedQuery, offset: page * PAGE_SIZE, limit: PAGE_SIZE },
          await getValidToken(),
          environment
        );
        if (request === latestRecipes.current) setRecipes(response);
      } catch (requestError) {
        if (request === latestRecipes.current) {
          setRecipes(null);
          setMessage({ tone: 'error', text: adminErrorMessage(requestError) });
        }
      }
    })();
  }, [environment, getValidToken, isPreviewMode, session, recipePack, submittedQuery, page, reloadKey]);

  const listed = useMemo(() => new Set(packs.packs.map((pack) => pack.pack_id)), [packs]);
  const unlisted = KNOWN_DATA_PACKS.filter((packId) => !listed.has(packId));
  const recipePacks = KNOWN_DATA_PACKS.filter((packId) => packId.startsWith('recipes_'));
  const versionOf = (packId: string) => packs.packs.find((pack) => pack.pack_id === packId)?.current.version ?? 0;

  const run = useCallback(
    async (key: string, action: (token: string) => Promise<unknown>, done: string) => {
      setBusy(key);
      setMessage(null);
      try {
        await action(await getValidToken());
        setMessage({ tone: 'info', text: done });
        reload();
        return true;
      } catch (requestError) {
        setMessage({ tone: 'error', text: adminErrorMessage(requestError) });
        return false;
      } finally {
        setBusy(null);
      }
    },
    [getValidToken, reload]
  );

  const handleUpload = (pack: DataPack | string, file: File, note: string) => {
    const packId = typeof pack === 'string' ? pack : pack.pack_id;
    const base = typeof pack === 'string' ? 0 : pack.current.version;
    void run(
      packId,
      (token) => uploadDataPack(packId, file, note, base, token, environment),
      `${packId} published. Apps download it the next time they check (within a few hours).`
    );
  };

  const handleRollback = (pack: DataPack, version: number) => {
    if (!window.confirm(`Publish ${pack.pack_id} v${version} again as the current version?`)) return;
    void run(
      pack.pack_id,
      (token) => rollbackDataPack(pack.pack_id, version, pack.current.version, token, environment),
      `${pack.pack_id} rolled back to the file of v${version}.`
    );
  };

  const handleAdopt = (packId: string) =>
    void run(packId, (token) => adoptLegacyDataPack(packId, token, environment), `${packId} is now version 1.`);

  const handleSave = async (recipe: PackRecipe) => {
    const ok = await run(
      recipePack,
      (token) => savePackRecipe(recipePack, recipe, recipes?.version ?? versionOf(recipePack), token, environment),
      `Saved "${recipe.name || recipe.id}" and published ${recipePack}.`
    );
    if (ok) setEditing(null);
  };

  const handleDelete = async (recipe: PackRecipe) => {
    const ok = await run(
      recipePack,
      (token) => deletePackRecipe(recipePack, recipe.id, recipes?.version ?? versionOf(recipePack), token, environment),
      `Removed "${recipe.name || recipe.id}" and published ${recipePack}.`
    );
    if (ok) setEditing(null);
  };

  const total = recipes?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visibleStart = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const visibleEnd = Math.min(page * PAGE_SIZE + (recipes?.items.length ?? 0), total);

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/data-packs"
      title="Data packs"
      description="Recipe, food and supplement packs the app downloads from R2. Every publish is a new version; apps check the manifest and download the new file. Older versions stay available to roll back."
    >
      {isPreviewMode && (
        <AdminBanner
          tone="warning"
          title="Backend not configured"
          message="Set NEXT_PUBLIC_MEALTRACK_API_URL, or enable the admin proxy, to manage packs."
        />
      )}
      {error && <AdminBanner tone="error" title="Could not load packs" message={error} />}
      {message && (
        <AdminBanner
          tone={message.tone}
          title={message.tone === 'error' ? 'Action failed' : 'Done'}
          message={message.text}
        />
      )}

      {isLoading ? (
        <p className="border border-border bg-white p-6 text-sm text-muted">Loading packs…</p>
      ) : (
        <DataPackTable
          packs={packs.packs}
          unlisted={unlisted}
          busy={busy}
          onUpload={handleUpload}
          onRollback={handleRollback}
          onAdopt={handleAdopt}
        />
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Recipes</h2>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(0);
            setSubmittedQuery(query.trim());
          }}
        >
          <label className="flex flex-col gap-1 text-xs font-bold">
            Pack
            <select
              className="border border-border bg-white px-2 py-1.5 text-sm font-normal"
              value={recipePack}
              onChange={(event) => {
                setRecipePack(event.target.value);
                setPage(0);
                setEditing(null);
              }}
            >
              {recipePacks.map((packId) => (
                <option key={packId} value={packId}>
                  {packId}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold">
            Name or id
            <input
              className="w-64 border border-border px-2 py-1.5 text-sm font-normal"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button type="submit" className={BUTTON}>
            Search
          </button>
          <button
            type="button"
            className={BUTTON}
            disabled={!listed.has(recipePack)}
            onClick={() =>
              setEditing({
                isNew: true,
                recipe: {
                  id: crypto.randomUUID(),
                  name: '',
                  calories: 0,
                  macros: { protein_g: 0, carbs_g: 0, fat_g: 0 },
                  prep_time_minutes: 0,
                  meal_types: ['lunch'],
                  ingredients: [],
                  steps: [],
                  image_url: null,
                },
              })
            }
          >
            Add recipe
          </button>
        </form>

        {!listed.has(recipePack) && !isLoading && (
          <p className="text-sm text-muted">Adopt or upload {recipePack} above before editing its recipes.</p>
        )}

        {editing && (
          <DataPackRecipeEditor
            key={editing.recipe.id}
            recipe={editing.recipe}
            isNew={editing.isNew}
            isBusy={busy === recipePack}
            onSave={(recipe) => void handleSave(recipe)}
            onDelete={(recipe) => void handleDelete(recipe)}
            onClose={() => setEditing(null)}
          />
        )}

        {recipes && (
          <>
            <MealCatalogPagination
              isLoading={false}
              page={page}
              totalPages={totalPages}
              total={total}
              visibleStart={visibleStart}
              visibleEnd={visibleEnd}
              onPrevious={() => setPage((value) => Math.max(0, value - 1))}
              onNext={() => setPage((value) => value + 1)}
            />
            <section className="overflow-x-auto border-y border-border bg-white">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="border-b border-border bg-background text-xs text-muted">
                  <tr>
                    <th className="px-4 py-3 font-bold">Name</th>
                    <th className="px-4 py-3 font-bold">kcal</th>
                    <th className="px-4 py-3 font-bold">Meals</th>
                    <th className="px-4 py-3 font-bold">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.items.map((recipe) => (
                    <tr key={recipe.id} className="border-b border-border">
                      <td className="px-4 py-2">{recipe.name || recipe.id}</td>
                      <td className="px-4 py-2">{recipe.calories ?? '—'}</td>
                      <td className="px-4 py-2 text-muted">{(recipe.meal_types ?? []).join(', ')}</td>
                      <td className="px-4 py-2 text-right">
                        <button type="button" className={BUTTON} onClick={() => setEditing({ recipe, isNew: false })}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </section>
    </AdminPageShell>
  );
}
