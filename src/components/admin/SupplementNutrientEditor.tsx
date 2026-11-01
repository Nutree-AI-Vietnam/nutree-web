import { useState } from 'react';
import { SUPPLEMENT_NUTRIENT_UNITS } from '@/types/supplement-admin';

interface Props {
  /** Amounts per unit as typed, keyed by nutrient. */
  values: Record<string, string>;
  disabled: boolean;
  onChange: (values: Record<string, string>) => void;
}

/** Per-unit nutrient amounts; a blank or 0 amount is dropped on save. */
export function SupplementNutrientEditor({ values, disabled, onChange }: Props) {
  const [adding, setAdding] = useState('');
  const missing = Object.keys(SUPPLEMENT_NUTRIENT_UNITS).filter((key) => !(key in values));

  return (
    <div className="grid gap-2">
      <p className="text-xs font-bold uppercase text-muted">Nutrients per unit</p>
      {Object.keys(values).length === 0 && <p className="text-sm text-muted">No tracked nutrients.</p>}
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_auto] items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">{key}</span>
          <input
            aria-label={`${key} per unit`}
            className="border border-border bg-white px-2 py-1 text-right tabular-nums"
            disabled={disabled}
            inputMode="decimal"
            onChange={(event) => onChange({ ...values, [key]: event.target.value })}
            value={value}
          />
          <span className="text-xs text-muted">{SUPPLEMENT_NUTRIENT_UNITS[key] ?? ''}</span>
          <button
            aria-label={`Remove ${key}`}
            className="px-2 text-xs font-bold text-muted hover:text-red-700"
            disabled={disabled}
            onClick={() => {
              const next = { ...values };
              delete next[key];
              onChange(next);
            }}
            type="button"
          >
            Remove
          </button>
        </div>
      ))}
      {missing.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            className="border border-border bg-white px-2 py-1 text-sm"
            disabled={disabled}
            onChange={(event) => setAdding(event.target.value)}
            value={adding}
          >
            <option value="">Add a nutrient…</option>
            {missing.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <button
            className="border border-border px-3 py-1 text-xs font-bold text-muted hover:border-primary-teal disabled:opacity-50"
            disabled={disabled || !adding}
            onClick={() => {
              onChange({ ...values, [adding]: '' });
              setAdding('');
            }}
            type="button"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
