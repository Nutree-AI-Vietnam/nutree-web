import { useState } from 'react';
import { SUPPLEMENT_NUTRIENT_NAMES, SUPPLEMENT_NUTRIENT_UNITS } from '@/types/supplement-admin';

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
      <p className="text-xs font-semibold uppercase text-slate-500">Nutrients per unit</p>
      {Object.keys(values).length === 0 && <p className="text-sm text-slate-500">No tracked nutrients.</p>}
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="grid grid-cols-[minmax(0,1fr)_4.5rem_auto_auto] items-center gap-2 text-sm">
          <span className="truncate font-semibold text-slate-900" title={key}>{SUPPLEMENT_NUTRIENT_NAMES[key] ?? key}</span>
          <input
            aria-label={`${SUPPLEMENT_NUTRIENT_NAMES[key] ?? key} per unit`}
            className="w-full min-w-0 border border-slate-200 bg-white px-2 py-1 text-right tabular-nums rounded-lg"
            disabled={disabled}
            inputMode="decimal"
            onChange={(event) => onChange({ ...values, [key]: event.target.value })}
            value={value}
          />
          <span className="text-xs text-slate-500">{SUPPLEMENT_NUTRIENT_UNITS[key] ?? ''}</span>
          <button
            aria-label={`Remove ${SUPPLEMENT_NUTRIENT_NAMES[key] ?? key}`}
            className="px-1 text-sm font-semibold text-slate-500 hover:text-red-700"
            disabled={disabled}
            onClick={() => {
              const next = { ...values };
              delete next[key];
              onChange(next);
            }}
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
      {missing.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            className="min-w-0 border border-slate-200 bg-white px-2 py-1 text-sm rounded-lg"
            disabled={disabled}
            onChange={(event) => setAdding(event.target.value)}
            value={adding}
          >
            <option value="">Add a nutrient…</option>
            {missing.map((key) => (
              <option key={key} value={key}>{SUPPLEMENT_NUTRIENT_NAMES[key] ?? key}</option>
            ))}
          </select>
          <button
            className="border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-slate-300 disabled:opacity-50 rounded-lg"
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
