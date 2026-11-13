'use client';

import { useMemo, useState } from 'react';
import { Button, Drawer, Field, Icon, Tabs, inputClass } from '@/components/admin/ui/AdminUi';
import { cn } from '@/lib/cn';
import type { PackRecipe } from '@/types/data-pack-admin';

const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const MEAL_LABELS: Record<(typeof MEALS)[number], string> = { breakfast: 'Sáng', lunch: 'Trưa', dinner: 'Tối', snack: 'Ăn vặt' };
const UNITS = ['g', 'ml', 'serving'] as const;

interface Ingredient {
  display_name: string;
  quantity: number;
  unit: string;
  [key: string]: unknown;
}

interface Props {
  recipe: PackRecipe | null;
  isNew: boolean;
  description: string;
  isProd: boolean;
  isBusy: boolean;
  onClose: () => void;
  onSave: (recipe: PackRecipe) => void;
  onDelete: (recipe: PackRecipe) => void;
}

/** Edits one recipe. The form covers what the app reads; JSON keeps every other key. */
export function RecipeEditorDrawer(props: Props) {
  // Remount per recipe so the form starts from it.
  return props.recipe ? <Editor key={props.recipe.id} {...props} recipe={props.recipe} /> : null;
}

function Editor({ recipe, isNew, description, isProd, isBusy, onClose, onSave, onDelete }: Props & { recipe: PackRecipe }) {
  const [draft, setDraft] = useState<PackRecipe>(recipe);
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const macros = (draft.macros as Record<string, number> | undefined) ?? {};
  const ingredients = useMemo(() => ((draft.ingredients as Ingredient[] | undefined) ?? []).map((item) => ({ ...item })), [draft.ingredients]);
  const steps = ((draft.steps as string[] | undefined) ?? []).join('\n');
  const meals = new Set(draft.meal_types ?? []);
  const set = (patch: Partial<PackRecipe>) => setDraft((current) => ({ ...current, ...patch }));
  const setIngredient = (index: number, patch: Partial<Ingredient>) =>
    set({ ingredients: ingredients.map((item, at) => (at === index ? { ...item, ...patch } : item)) });

  const switchMode = (next: 'form' | 'json') => {
    if (next === mode) return;
    if (next === 'json') {
      setJson(JSON.stringify(draft, null, 2));
      setError(null);
      setMode('json');
      return;
    }
    const parsed = parseJson(json, recipe, isNew);
    if (typeof parsed === 'string') {
      setError(parsed);
      return;
    }
    setDraft(parsed);
    setError(null);
    setMode('form');
  };

  const save = () => {
    const result = mode === 'json' ? parseJson(json, recipe, isNew) : validate(draft);
    if (typeof result === 'string') {
      setError(result);
      return;
    }
    setError(null);
    onSave(result);
  };

  return (
    <Drawer
      open
      width="max-w-2xl"
      title={isNew ? 'Công thức mới' : recipe.name || recipe.id}
      description={description}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!isNew ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700">Xoá khỏi thư viện?</span>
                <Button size="sm" variant="danger" isBusy={isBusy} onClick={() => onDelete(recipe)}>
                  Xoá
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Giữ lại
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" icon="trash" className="text-rose-600" onClick={() => setConfirmDelete(true)}>
                Xoá công thức
              </Button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Huỷ
            </Button>
            <Button variant={isProd ? 'warning' : 'primary'} icon="check" isBusy={isBusy} onClick={save}>
              Lưu và phát hành
            </Button>
          </div>
        </div>
      }
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <Tabs
          value={mode}
          onChange={switchMode}
          items={[
            { value: 'form', label: 'Biểu mẫu' },
            { value: 'json', label: 'Nâng cao (JSON)' },
          ]}
        />
        <span />
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-inset ring-rose-200">{error}</p>}

      {mode === 'json' ? (
        <textarea
          aria-label="JSON công thức"
          spellCheck={false}
          className="h-[60vh] w-full rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-slate-300"
          value={json}
          onChange={(event) => setJson(event.target.value)}
        />
      ) : (
        <div className="space-y-6">
          <Section title="Thông tin chung">
            <Field label="Tên món">
              <input className={inputClass} value={draft.name ?? ''} onChange={(event) => set({ name: event.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Thời gian nấu (phút)">
                <NumberInput value={draft.prep_time_minutes as number | undefined} onChange={(value) => set({ prep_time_minutes: value })} />
              </Field>
              <Field label="Link ảnh">
                <input className={inputClass} value={draft.image_url ?? ''} onChange={(event) => set({ image_url: event.target.value || null })} />
              </Field>
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-600">Bữa ăn</span>
              <div className="flex flex-wrap gap-2">
                {MEALS.map((meal) => {
                  const on = meals.has(meal);
                  return (
                    <button
                      key={meal}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set({ meal_types: MEALS.filter((m) => (m === meal ? !on : meals.has(m))) })}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors',
                        on ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white text-slate-600 ring-slate-200 hover:ring-slate-300'
                      )}
                    >
                      {MEAL_LABELS[meal]}
                    </button>
                  );
                })}
              </div>
            </div>
          </Section>

          <Section title="Dinh dưỡng mỗi khẩu phần">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="Năng lượng (kcal)">
                <NumberInput value={draft.calories} onChange={(value) => set({ calories: value })} />
              </Field>
              {(
                [
                  ['protein_g', 'Đạm (g)'],
                  ['carbs_g', 'Tinh bột (g)'],
                  ['fat_g', 'Chất béo (g)'],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <NumberInput value={macros[key]} onChange={(value) => set({ macros: { ...macros, [key]: value } })} />
                </Field>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">Năng lượng không tự tính lại theo nguyên liệu. Nhớ cập nhật khi đổi lượng.</p>
          </Section>

          <Section
            title="Nguyên liệu"
            action={
              <Button size="sm" variant="ghost" icon="plus" onClick={() => set({ ingredients: [...ingredients, { display_name: '', quantity: 0, unit: 'g', food_reference_id: null }] })}>
                Thêm
              </Button>
            }
          >
            {ingredients.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có nguyên liệu.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 border-b border-slate-100 px-2 py-1.5 last:border-b-0">
                    <input
                      aria-label={`Tên nguyên liệu ${index + 1}`}
                      className="h-8 min-w-0 flex-1 rounded-md px-2 text-sm outline-none focus:bg-slate-50"
                      value={item.display_name}
                      onChange={(event) => setIngredient(index, { display_name: event.target.value })}
                    />
                    <input
                      aria-label={`Lượng nguyên liệu ${index + 1}`}
                      type="number"
                      step="any"
                      className="h-8 w-20 rounded-md border border-slate-200 px-2 text-right text-sm outline-none focus:border-slate-400"
                      value={Number.isFinite(item.quantity) ? item.quantity : ''}
                      onChange={(event) => setIngredient(index, { quantity: Number(event.target.value) })}
                    />
                    <select
                      aria-label={`Đơn vị nguyên liệu ${index + 1}`}
                      className="h-8 rounded-md border border-slate-200 bg-white px-1.5 text-sm"
                      value={item.unit}
                      onChange={(event) => setIngredient(index, { unit: event.target.value })}
                    >
                      {[...new Set([...UNITS, item.unit])].map((unit) => (
                        <option key={unit}>{unit}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label={`Xoá nguyên liệu ${index + 1}`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => set({ ingredients: ingredients.filter((_, at) => at !== index) })}
                    >
                      <Icon name="close" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Các bước">
            <Field label="Mỗi dòng một bước">
              <textarea
                className="min-h-32 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={steps}
                onChange={(event) => set({ steps: event.target.value.split('\n') })}
              />
            </Field>
          </Section>
        </div>
      )}
    </Drawer>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function NumberInput({ value, onChange }: { value: number | undefined; onChange: (value: number) => void }) {
  return (
    <input
      type="number"
      step="any"
      className={inputClass}
      value={value === undefined || Number.isNaN(value) ? '' : value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

function validate(draft: PackRecipe): PackRecipe | string {
  if (!String(draft.name ?? '').trim()) return 'Công thức cần có tên.';
  const steps = ((draft.steps as string[] | undefined) ?? []).map((step) => step.trim()).filter(Boolean);
  const ingredients = ((draft.ingredients as Ingredient[] | undefined) ?? []).filter((item) => item.display_name.trim());
  return { ...draft, name: String(draft.name).trim(), steps, ingredients, ingredient_count: ingredients.length };
}

function parseJson(text: string, original: PackRecipe, isNew: boolean): PackRecipe | string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return 'JSON không hợp lệ.';
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return 'Một công thức là một đối tượng JSON.';
  const id = String((parsed as PackRecipe).id ?? '').trim();
  if (!id) return 'Công thức cần có id.';
  if (!isNew && id !== original.id) return 'Không đổi được id. Hãy thêm công thức mới.';
  return { ...(parsed as PackRecipe), id };
}
