'use client';

import { useState } from 'react';
import { Badge, Button, Card, EmptyState, Icon, inputClass } from '@/components/admin/ui/AdminUi';
import { packLabel } from '@/components/admin/data-packs/pack-meta';
import type { PackRecipe, PackRecipeListResponse } from '@/types/data-pack-admin';

interface Props {
  packIds: readonly string[];
  packId: string;
  isPublished: boolean;
  data: PackRecipeListResponse | null;
  isLoading: boolean;
  page: number;
  pageSize: number;
  onPackChange: (packId: string) => void;
  onSearch: (query: string) => void;
  onPage: (page: number) => void;
  onOpen: (recipe: PackRecipe) => void;
  onAdd: () => void;
}

/** Search one recipe pack and open a recipe to edit. */
export function RecipeBrowser({ packIds, packId, isPublished, data, isLoading, page, pageSize, onPackChange, onSearch, onPage, onOpen, onAdd }: Props) {
  const [query, setQuery] = useState('');
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
        <select
          aria-label="Recipe pack"
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"
          value={packId}
          onChange={(event) => onPackChange(event.target.value)}
        >
          {packIds.map((id) => (
            <option key={id} value={id}>
              {packLabel(id)}
            </option>
          ))}
        </select>
        <form
          className="relative min-w-[220px] flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(query.trim());
          }}
        >
          <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            aria-label="Search recipes"
            className={`${inputClass} pl-9`}
            placeholder="Search by name or id, then press Enter"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        {data && <Badge>v{data.version}</Badge>}
        <Button variant="primary" icon="plus" onClick={onAdd} disabled={!isPublished}>
          New recipe
        </Button>
      </div>

      {!isPublished ? (
        <EmptyState icon="package" title={`${packLabel(packId)} is not published on this channel`}>
          Adopt or upload it in the Packs tab first.
        </EmptyState>
      ) : isLoading && !data ? (
        <EmptyState icon="refresh" title="Loading recipes…" />
      ) : !data || data.items.length === 0 ? (
        <EmptyState icon="search" title="No recipes match" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Recipe</th>
                  <th className="px-3 py-2.5 font-medium">Meals</th>
                  <th className="px-3 py-2.5 text-right font-medium">kcal</th>
                  <th className="px-3 py-2.5 text-right font-medium">P / C / F</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((recipe) => {
                  const macros = (recipe.macros as Record<string, number> | undefined) ?? {};
                  return (
                    <tr key={recipe.id} className="group cursor-pointer hover:bg-slate-50" onClick={() => onOpen(recipe)}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {recipe.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element -- remote recipe photos from many hosts
                            <img src={recipe.image_url} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" loading="lazy" />
                          ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                              <Icon name="catalog" className="h-4 w-4" />
                            </span>
                          )}
                          <span className="font-medium text-slate-900">{recipe.name || recipe.id}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(recipe.meal_types ?? []).map((meal) => (
                            <Badge key={meal}>{meal}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-slate-700">{recipe.calories ?? '—'}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-slate-500">
                        {[macros.protein_g, macros.carbs_g, macros.fat_g].map((value) => (value === undefined ? '—' : Math.round(value))).join(' / ')}
                      </td>
                      <td className="pr-4 text-slate-300 group-hover:text-slate-500">›</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span>
              {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button size="sm" disabled={page === 0} onClick={() => onPage(page - 1)}>
                Previous
              </Button>
              <Button size="sm" disabled={page + 1 >= pages} onClick={() => onPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
