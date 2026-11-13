'use client';

import { useState } from 'react';
import type { PackRecipe } from '@/types/data-pack-admin';

const BUTTON = 'whitespace-nowrap border border-border bg-white px-3 py-1.5 text-xs font-bold disabled:text-muted';

interface Props {
  recipe: PackRecipe;
  isNew: boolean;
  isBusy: boolean;
  onSave: (recipe: PackRecipe) => void;
  onDelete: (recipe: PackRecipe) => void;
  onClose: () => void;
}

/** Edits one recipe as the JSON the app reads. Saving publishes the pack. */
export function DataPackRecipeEditor({ recipe, isNew, isBusy, onSave, onDelete, onClose }: Props) {
  const [text, setText] = useState(() => JSON.stringify(recipe, null, 2));
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError('This is not valid JSON.');
      return;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setError('A recipe is one JSON object.');
      return;
    }
    const id = String((parsed as PackRecipe).id ?? '').trim();
    if (!id) {
      setError('The recipe needs an id.');
      return;
    }
    if (!isNew && id !== recipe.id) {
      setError('The id cannot change. Add a new recipe instead.');
      return;
    }
    setError(null);
    onSave({ ...(parsed as PackRecipe), id });
  };

  return (
    <section className="space-y-3 border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">{isNew ? 'New recipe' : recipe.name || recipe.id}</h2>
        <button type="button" className={BUTTON} onClick={onClose}>
          Close
        </button>
      </div>
      <p className="text-xs text-muted">
        Fields the app reads: id, name, calories, macros (protein_g, carbs_g, fat_g), prep_time_minutes,
        meal_types (breakfast, lunch, dinner), ingredients (display_name, quantity, unit), steps, image_url.
      </p>
      <textarea
        aria-label="Recipe JSON"
        className="h-[420px] w-full border border-border p-3 font-mono text-xs"
        spellCheck={false}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button type="button" className={BUTTON} disabled={isBusy} onClick={save}>
          {isBusy ? 'Publishing…' : 'Save and publish'}
        </button>
        {!isNew && (
          <button
            type="button"
            className={`${BUTTON} text-red-700`}
            disabled={isBusy}
            onClick={() => {
              if (window.confirm(`Remove "${recipe.name || recipe.id}" from this pack?`)) onDelete(recipe);
            }}
          >
            Remove from pack
          </button>
        )}
      </div>
    </section>
  );
}
