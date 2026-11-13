'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { RecipeBrowser } from '@/components/admin/data-packs/RecipeBrowser';
import { RecipeEditorDrawer } from '@/components/admin/data-packs/RecipeEditorDrawer';
import { ReleaseWorkspace } from '@/components/admin/data-packs/ReleaseWorkspace';
import { packIdsOf, packLabel } from '@/components/admin/data-packs/pack-meta';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { Button, Tabs } from '@/components/admin/ui/AdminUi';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import { useDataPacks } from '@/hooks/useDataPacks';
import { deletePackRecipe, fetchPackRecipes, savePackRecipe } from '@/lib/data-pack-admin-api';
import { KNOWN_DATA_PACKS, type PackRecipe, type PackRecipeListResponse } from '@/types/data-pack-admin';

const PAGE_SIZE = 25;
const RECIPE_PACKS = packIdsOf('recipes', KNOWN_DATA_PACKS);

type Tab = 'edit' | 'languages';

export function AdminRecipesPageClient() {
  const [tab, setTab] = useState<Tab>('edit');
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReload: reload });
  const packs = useDataPacks(admin, reloadKey);
  const { environment, getValidToken, isPreviewMode, session } = admin;

  const [language, setLanguage] = useState('recipes_vi');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [recipes, setRecipes] = useState<PackRecipeListResponse | null>(null);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ recipe: PackRecipe; isNew: boolean } | null>(null);
  const latest = useRef(0);

  const isPublished = Boolean(packs.byId.get(language)?.current);
  // Open on a language that has recipes once the list is known.
  useEffect(() => {
    if (packs.isLoading || packs.byId.get(language)?.current) return;
    const first = RECIPE_PACKS.find((packId) => packs.byId.get(packId)?.current);
    if (first) setLanguage(first);
  }, [packs.isLoading, packs.byId, language]);

  useEffect(() => {
    if (tab !== 'edit' || isPreviewMode || !session || !isPublished) return;
    const request = ++latest.current;
    setIsLoadingRecipes(true);
    setLoadError(null);
    (async () => {
      try {
        const response = await fetchPackRecipes(
          language,
          { q: query, offset: page * PAGE_SIZE, limit: PAGE_SIZE },
          await getValidToken(),
          environment
        );
        if (request === latest.current) setRecipes(response);
      } catch (requestError) {
        if (request === latest.current) setLoadError(adminErrorMessage(requestError));
      } finally {
        if (request === latest.current) setIsLoadingRecipes(false);
      }
    })();
  }, [tab, environment, getValidToken, isPreviewMode, session, language, isPublished, query, page, reloadKey, packs.data]);

  const base = recipes?.pack_id === language ? recipes.version : packs.versionOf(language);
  const where = packs.isProd ? 'live for users' : 'in testing';
  const save = async (recipe: PackRecipe) => {
    const ok = await packs.run(
      language,
      (token) => savePackRecipe(language, recipe, base, token, environment),
      `Saved “${recipe.name || 'recipe'}”. ${packLabel(language)} version ${base + 1} is now ${where}.`
    );
    if (ok) setEditing(null);
  };
  const remove = async (recipe: PackRecipe) => {
    const ok = await packs.run(
      language,
      (token) => deletePackRecipe(language, recipe.id, base, token, environment),
      `Removed “${recipe.name || 'recipe'}”. ${packLabel(language)} version ${base + 1} is now ${where}.`
    );
    if (ok) setEditing(null);
  };

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/recipes"
      title="Recipe library"
      description="The recipes people browse and swap in the meal planner, one library per language. Edit a recipe and save: phones get the change on their next check."
      actions={
        <Button icon="refresh" onClick={packs.reload} isBusy={packs.isLoading && !packs.error}>
          Refresh
        </Button>
      }
      toolbar={
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'edit', label: 'Edit recipes' },
            { value: 'languages', label: 'Languages & versions' },
          ]}
        />
      }
    >
      {tab === 'languages' ? (
        <ReleaseWorkspace
          packs={packs}
          packIds={RECIPE_PACKS}
          icon="catalog"
          title="Recipe libraries"
          description="A language without its own library shows the English (US) one. Upload a library to add a language."
          unit={{ one: 'language', many: 'languages' }}
        />
      ) : (
        <>
          {packs.message && (
            <AdminBanner tone={packs.message.tone} title={packs.message.tone === 'error' ? 'That did not work' : 'Saved'} message={packs.message.text} />
          )}
          {loadError && <AdminBanner tone="error" title="Could not load recipes" message={loadError} />}
          <RecipeBrowser
            packIds={RECIPE_PACKS}
            packId={language}
            isPublished={isPublished}
            data={recipes?.pack_id === language ? recipes : null}
            isLoading={isLoadingRecipes || packs.isLoading}
            page={page}
            pageSize={PAGE_SIZE}
            onPackChange={(packId) => {
              setLanguage(packId);
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
            onSetUp={() => setTab('languages')}
          />
        </>
      )}

      <RecipeEditorDrawer
        recipe={editing?.recipe ?? null}
        isNew={editing?.isNew ?? false}
        packLabel={packLabel(language)}
        nextVersion={base + 1}
        isProd={packs.isProd}
        isBusy={packs.busy !== null}
        onClose={() => setEditing(null)}
        onSave={(recipe) => void save(recipe)}
        onDelete={(recipe) => void remove(recipe)}
      />
    </AdminPageShell>
  );
}
