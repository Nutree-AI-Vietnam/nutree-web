'use client';

import { useState } from 'react';
import { Button, Drawer, Field, Icon, inputClass } from '@/components/admin/ui/AdminUi';
import { cn } from '@/lib/cn';
import type { PackItem } from '@/types/data-pack-admin';

export type FormField =
  | { key: string; label: string; type: 'text' | 'number'; required?: boolean; hint?: string; wide?: boolean }
  | { key: string; label: string; type: 'select'; options: readonly string[]; required?: boolean }
  | { key: string; label: string; type: 'toggle'; hint?: string }
  | { key: string; label: string; type: 'list'; hint?: string }
  | { key: string; label: string; type: 'amounts'; hint?: string };

export interface FormSection {
  title: string;
  hint?: string;
  columns?: 2 | 3 | 4;
  fields: FormField[];
}

interface Props {
  item: PackItem | null;
  isNew: boolean;
  title: (item: PackItem) => string;
  description: string;
  sections: FormSection[];
  isProd: boolean;
  isBusy: boolean;
  onClose: () => void;
  onSave: (item: PackItem) => void;
  onDelete: (item: PackItem) => void;
}

/** A form over one row, built from field definitions. Keys it does not show are kept. */
export function FieldFormDrawer(props: Props) {
  return props.item ? <Editor key={props.item.id} {...props} item={props.item} /> : null;
}

function Editor({ item, isNew, title, description, sections, isProd, isBusy, onClose, onSave, onDelete }: Props & { item: PackItem }) {
  const [draft, setDraft] = useState<PackItem>(item);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = (key: string, value: unknown) => setDraft((current) => ({ ...current, [key]: value }));

  const save = () => {
    for (const section of sections) {
      for (const field of section.fields) {
        if ('required' in field && field.required && (draft[field.key] === null || draft[field.key] === undefined || draft[field.key] === '')) {
          setError(`${field.label} is required.`);
          return;
        }
      }
    }
    setError(null);
    onSave(draft);
  };

  return (
    <Drawer
      open
      width="max-w-2xl"
      title={isNew ? 'New item' : title(item)}
      description={description}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!isNew ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700">Remove it?</span>
                <Button size="sm" variant="danger" isBusy={isBusy} onClick={() => onDelete(item)}>
                  Remove
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Keep
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" icon="trash" className="text-rose-600" onClick={() => setConfirmDelete(true)}>
                Remove
              </Button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={isProd ? 'warning' : 'primary'} icon="check" isBusy={isBusy} onClick={save}>
              Save and publish
            </Button>
          </div>
        </div>
      }
    >
      {error && <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-inset ring-rose-200">{error}</p>}
      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{section.title}</h3>
              {section.hint && <p className="mt-0.5 text-[11px] text-slate-400">{section.hint}</p>}
            </div>
            <div className={cn('grid gap-3', { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[section.columns ?? 2])}>
              {section.fields.map((field) => (
                <FieldInput key={field.key} field={field} value={draft[field.key]} onChange={(value) => set(field.key, value)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Drawer>
  );
}

function FieldInput({ field, value, onChange }: { field: FormField; value: unknown; onChange: (value: unknown) => void }) {
  switch (field.type) {
    case 'toggle':
      return (
        <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 sm:col-span-2">
          <span>
            <span className="block text-sm text-slate-800">{field.label}</span>
            {field.hint && <span className="block text-[11px] text-slate-400">{field.hint}</span>}
          </span>
          <input type="checkbox" className="h-4 w-4 accent-slate-900" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        </label>
      );
    case 'select':
      return (
        <Field label={field.label}>
          <select className={inputClass} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)}>
            {[...new Set([...field.options, String(value ?? '')])].filter(Boolean).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      );
    case 'list':
      return (
        <Field label={field.label} hint={field.hint} className="sm:col-span-full">
          <input
            className={inputClass}
            value={((value as string[] | undefined) ?? []).join(', ')}
            onChange={(event) => onChange(event.target.value.split(',').map((part) => part.trim()).filter(Boolean))}
          />
        </Field>
      );
    case 'amounts':
      return <Amounts label={field.label} hint={field.hint} value={(value as Record<string, number> | undefined) ?? {}} onChange={onChange} />;
    default:
      return (
        <Field label={`${field.label}${'required' in field && field.required ? ' *' : ''}`} hint={'hint' in field ? field.hint : undefined} className={'wide' in field && field.wide ? 'sm:col-span-full' : undefined}>
          <input
            className={inputClass}
            type={field.type === 'number' ? 'number' : 'text'}
            step="any"
            value={value === null || value === undefined ? '' : String(value)}
            onChange={(event) =>
              onChange(field.type === 'number' ? (event.target.value === '' ? null : Number(event.target.value)) : event.target.value || null)
            }
          />
        </Field>
      );
  }
}

function Amounts({ label, hint, value, onChange }: { label: string; hint?: string; value: Record<string, number>; onChange: (value: unknown) => void }) {
  const [newKey, setNewKey] = useState('');
  const entries = Object.entries(value);
  return (
    <div className="sm:col-span-full">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        {entries.map(([key, amount]) => (
          <div key={key} className="flex items-center gap-2 border-b border-slate-100 px-3 py-1.5 last:border-b-0">
            <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{key.replace(/_/g, ' ')}</span>
            <input
              aria-label={`${key} amount`}
              type="number"
              step="any"
              className="h-8 w-24 rounded-md border border-slate-200 px-2 text-right text-sm"
              value={amount}
              onChange={(event) => onChange({ ...value, [key]: Number(event.target.value) })}
            />
            <button
              type="button"
              aria-label={`Remove ${key}`}
              className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              onClick={() => onChange(Object.fromEntries(entries.filter(([other]) => other !== key)))}
            >
              <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5">
          <input
            aria-label="New nutrient key"
            placeholder="e.g. vitamin_c_mg"
            className="h-8 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 text-sm"
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
          />
          <Button
            size="sm"
            icon="plus"
            disabled={!newKey.trim() || newKey.trim() in value}
            onClick={() => {
              onChange({ ...value, [newKey.trim()]: 0 });
              setNewKey('');
            }}
          >
            Add
          </Button>
        </div>
      </div>
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </div>
  );
}
