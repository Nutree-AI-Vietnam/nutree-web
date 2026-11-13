'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { HistoryDrawer } from '@/components/admin/data-packs/HistoryDrawer';
import { PackList } from '@/components/admin/data-packs/PackList';
import { RecipeBrowser } from '@/components/admin/data-packs/RecipeBrowser';
import { RecipeEditorDrawer } from '@/components/admin/data-packs/RecipeEditorDrawer';
import { UploadDialog } from '@/components/admin/data-packs/UploadDialog';
import { formatRelative, packLabel, packStatus } from '@/components/admin/data-packs/pack-meta';
import { Button, Card, Tabs } from '@/components/admin/ui/AdminUi';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import {
  adoptLegacyDataPack,
  deletePackRecipe,
  fetchDataPacks,
  fetchPackRecipes,
  promoteDataPack,
  rollbackDataPack,
  savePackRecipe,
  uploadDataPack,
} from '@/lib/data-pack-admin-api';
import {
  KNOWN_DATA_PACKS,
  type DataPack,
  type DataPackEntry,
  type DataPackListResponse,
  type PackRecipe,
  type PackRecipeListResponse,
} from '@/types/data-pack-admin';

const PAGE_SIZE = 25;
const emptyPacks: DataPackListResponse = { channel: 'sit', updated_at: '', packs: [] };
const RECIPE_PACKS = KNOWN_DATA_PACKS.filter((packId) => packId.startsWith('recipes_'));

type Message = { tone: 'info' | 'error'; text: string };
type Tab = 'packs' | 'recipes';

export function AdminDataPacksPageClient() {
  const [tab, setTab] = useState<Tab>('packs');
  const [packs, setPacks] = useState<DataPackListResponse>(emptyPacks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [uploading, setUploading] = useState<string | null>(null);
  const [historyOf, setHistoryOf] = useState<string | null>(null);

  const [recipePack, setRecipePack] = useState('recipes_en');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [recipes, setRecipes] = useState<PackRecipeListResponse | null>(null);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [editing, setEditing] = useState<{ recipe: PackRecipe; isNew: boolean } | null>(null);
  const latestRecipes = useRef(0);

  const reset = useCallback(() => {
    setPacks(emptyPacks);
    setRecipes(null);
    setEditing(null);
    setMessage(null);
    setError(null);
  }, []);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReset: reset, onReload: reload });
  const { environment, getValidToken, isPreviewMode, session } = admin;
  const isProd = packs.channel === 'prod';

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

  const byId = useMemo(() => new Map(packs.packs.map((pack) => [pack.pack_id, pack])), [packs]);
  const versionOf = useCallback((packId: string) => byId.get(packId)?.current?.version ?? 0, [byId]);
  const recipePackPublished = Boolean(byId.get(recipePack)?.current);

  useEffect(() => {
    if (tab !== 'recipes' || isPreviewMode || !session || !recipePackPublished) return;
    const request = ++latestRecipes.current;
    setIsLoadingRecipes(true);
    (async () => {
      try {
        const response = await fetchPackRecipes(
          recipePack,
          { q: query, offset: page * PAGE_SIZE, limit: PAGE_SIZE },
          await getValidToken(),
          environment
        );
        if (request === latestRecipes.current) setRecipes(response);
      } catch (requestError) {
        if (request === latestRecipes.current) setMessage({ tone: 'error', text: adminErrorMessage(requestError) });
      } finally {
        if (request === latestRecipes.current) setIsLoadingRecipes(false);
      }
    })();
  }, [tab, environment, getValidToken, isPreviewMode, session, recipePack, recipePackPublished, query, page, reloadKey]);

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

  const channelName = isProd ? 'PROD' : 'SIT';
  const reachNote = isProd ? 'Store builds pick it up within a few hours.' : 'Dev and staging builds pick it up; promote it from PROD when checked.';

  const handleUpload = async (packId: string, file: File, note: string) => {
    const ok = await run(
      packId,
      (token) => uploadDataPack(packId, file, note, versionOf(packId), token, environment),
      `${packLabel(packId)} v${versionOf(packId) + 1} published to ${channelName}. ${reachNote}`
    );
    if (ok) setUploading(null);
  };

  const handleRollback = (pack: DataPack, entry: DataPackEntry) =>
    void run(
      pack.pack_id,
      (token) => rollbackDataPack(pack.pack_id, entry.version, pack.current?.version ?? 0, token, environment),
      `${packLabel(pack.pack_id)} rolled back to the file of v${entry.version}.`
    ).then((ok) => ok && setHistoryOf(null));

  const handlePromote = (pack: DataPack) =>
    void run(
      pack.pack_id,
      (token) => promoteDataPack(pack.pack_id, pack.current?.version ?? 0, token, environment),
      `${packLabel(pack.pack_id)}: SIT v${pack.sit?.version} is now live on PROD.`
    );

  const handleAdopt = (packId: string) =>
    void run(packId, (token) => adoptLegacyDataPack(packId, token, environment), `${packLabel(packId)} is now v1 on ${channelName}.`);

  const recipeBase = recipes?.version ?? versionOf(recipePack);
  const handleSave = async (recipe: PackRecipe) => {
    const ok = await run(
      recipePack,
      (token) => savePackRecipe(recipePack, recipe, recipeBase, token, environment),
      `Saved “${recipe.name || recipe.id}” — ${packLabel(recipePack)} v${recipeBase + 1} on ${channelName}.`
    );
    if (ok) setEditing(null);
  };
  const handleDelete = async (recipe: PackRecipe) => {
    const ok = await run(
      recipePack,
      (token) => deletePackRecipe(recipePack, recipe.id, recipeBase, token, environment),
      `Removed “${recipe.name || recipe.id}” — ${packLabel(recipePack)} v${recipeBase + 1} on ${channelName}.`
    );
    if (ok) setEditing(null);
  };

  const statuses = KNOWN_DATA_PACKS.map((packId) => packStatus(byId.get(packId), isProd));
  const live = statuses.filter((status) => status === 'live' || status === 'sit-ahead').length;
  const waiting = statuses.filter((status) => status === 'sit-ahead' || status === 'sit-only').length;
  const missing = statuses.filter((status) => status === 'missing').length;

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/data-packs"
      title="Data packs"
      description="Recipe, food and supplement packs the app downloads. Every publish is a new version; apps update on their next check."
      actions={
        <Button icon="refresh" onClick={reload} isBusy={isLoading && !error}>
          Refresh
        </Button>
      }
      toolbar={
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'packs', label: 'Packs' },
            { value: 'recipes', label: 'Recipe editor' },
          ]}
        />
      }
    >
      {isPreviewMode && (
        <AdminBanner tone="warning" title="Backend not configured" message="Set NEXT_PUBLIC_MEALTRACK_API_URL, or enable the admin proxy, to manage packs." />
      )}
      {error && <AdminBanner tone="error" title="Could not load packs" message={error} />}
      {message && <AdminBanner tone={message.tone} title={message.tone === 'error' ? 'Action failed' : 'Published'} message={message.text} />}

      {tab === 'packs' ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard label={`Live on ${channelName}`} value={`${live} / ${KNOWN_DATA_PACKS.length}`} hint={packs.updated_at ? `Last publish ${formatRelative(packs.updated_at)}` : 'Nothing published yet'} />
            {isProd ? (
              <SummaryCard label="Waiting on SIT" value={String(waiting)} hint={waiting ? 'Tested on SIT, not promoted yet' : 'PROD matches SIT'} tone={waiting ? 'amber' : 'neutral'} />
            ) : (
              <SummaryCard label="Channel" value="SIT" hint="Safe to try: dev and staging builds only" tone="blue" />
            )}
            <SummaryCard label="Not in manifest" value={String(missing)} hint={missing ? 'Adopt the file apps already use' : 'Every pack is versioned'} />
          </div>
          {!isLoading && (
            <PackList
              isProd={isProd}
              packIds={KNOWN_DATA_PACKS}
              packs={packs.packs}
              busy={busy}
              onUpload={setUploading}
              onHistory={(pack) => setHistoryOf(pack.pack_id)}
              onPromote={handlePromote}
              onAdopt={handleAdopt}
            />
          )}
        </>
      ) : (
        <RecipeBrowser
          packIds={RECIPE_PACKS}
          packId={recipePack}
          isPublished={recipePackPublished}
          data={recipes?.pack_id === recipePack ? recipes : null}
          isLoading={isLoadingRecipes}
          page={page}
          pageSize={PAGE_SIZE}
          onPackChange={(packId) => {
            setRecipePack(packId);
            setPage(0);
            setRecipes(null);
          }}
          onSearch={(value) => {
            setQuery(value);
            setPage(0);
          }}
          onPage={setPage}
          onOpen={(recipe) => setEditing({ recipe, isNew: false })}
          onAdd={() =>
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
        />
      )}

      <UploadDialog
        packId={uploading}
        nextVersion={uploading ? versionOf(uploading) + 1 : 1}
        isProd={isProd}
        isBusy={busy !== null}
        onClose={() => setUploading(null)}
        onUpload={(packId, file, note) => void handleUpload(packId, file, note)}
      />
      <HistoryDrawer pack={historyOf ? (byId.get(historyOf) ?? null) : null} isBusy={busy !== null} onClose={() => setHistoryOf(null)} onRollback={handleRollback} />
      <RecipeEditorDrawer
        recipe={editing?.recipe ?? null}
        isNew={editing?.isNew ?? false}
        packLabel={packLabel(recipePack)}
        nextVersion={recipeBase + 1}
        isProd={isProd}
        isBusy={busy !== null}
        onClose={() => setEditing(null)}
        onSave={(recipe) => void handleSave(recipe)}
        onDelete={(recipe) => void handleDelete(recipe)}
      />
    </AdminPageShell>
  );
}

function SummaryCard({ label, value, hint, tone = 'neutral' }: { label: string; value: string; hint: string; tone?: 'neutral' | 'amber' | 'blue' }) {
  const accent = tone === 'amber' ? 'text-amber-600' : tone === 'blue' ? 'text-sky-600' : 'text-slate-900';
  return (
    <Card className="px-5 py-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </Card>
  );
}
