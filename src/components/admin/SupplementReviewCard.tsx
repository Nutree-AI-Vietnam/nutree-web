/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react';
import { SupplementNutrientEditor } from '@/components/admin/SupplementNutrientEditor';
import {
  SUPPLEMENT_FORMS,
  type SupplementBarcodeMatch,
  type SupplementEdits,
  type SupplementForm,
  type SupplementReviewAction,
  type SupplementReviewItem,
} from '@/types/supplement-admin';

interface Props {
  item: SupplementReviewItem;
  isBusy: boolean;
  onReview: (item: SupplementReviewItem, action: SupplementReviewAction, changes: SupplementEdits | null) => void;
  /** Filters the queue down to one row (the catalog row holding a scan's barcode). */
  onFind: (query: string) => void;
}

interface Draft {
  brand: string;
  name: string;
  form: SupplementForm;
  unit_label: string;
  units_per_serving: string;
  sold_in_vn: boolean;
  macro_bearing: boolean;
  nutrients: Record<string, string>;
}

/** One product waiting for review: its source beside what was read from it. */
export function SupplementReviewCard({ item, isBusy, onReview, onFind }: Props) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(item));
  const edits = useMemo(() => changesFrom(item, draft), [item, draft]);
  const invalid = typeof edits === 'string' ? edits : null;
  const changes = typeof edits === 'string' || Object.keys(edits).length === 0 ? null : edits;
  const disabled = isBusy || Boolean(invalid);
  const match = item.barcode_match;
  const waitsForCatalogRow = match?.review_status === 'pending_review';

  return (
    <article className="grid gap-4 border border-border bg-white p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="grid content-start gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
          <span className="border border-border px-2 py-1 text-muted">{item.kind === 'scan' ? 'Label scan' : 'Held-back catalog row'}</span>
          {item.origin_country && <span className="text-muted">{item.origin_country}</span>}
          {item.catalog_key && <span className="font-mono normal-case text-muted">{item.catalog_key}</span>}
        </div>
        {item.label_image_url ? (
          <a href={item.label_image_url} target="_blank" rel="noreferrer" className="block border border-border bg-background">
            <img src={item.label_image_url} alt={`Label photo of ${item.name}`} className="max-h-96 w-full object-contain" loading="lazy" />
          </a>
        ) : item.source_url ? (
          <a href={item.source_url} target="_blank" rel="noreferrer" className="break-all text-sm font-semibold text-primary-emerald underline">
            {item.source_name || 'Source'}: {item.source_url}
          </a>
        ) : (
          <p className="text-sm text-muted">No source link or label photo.</p>
        )}
        {item.reasons.length > 0 && (
          <ul className="grid gap-1 border border-energy-orange/40 bg-energy-orange-soft p-3 text-sm text-foreground">
            {item.reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        )}
        {item.barcodes.length > 0 && <p className="font-mono text-xs text-muted">{item.barcodes.join(', ')}</p>}
        {item.barcode_match && <BarcodeMatchNote match={item.barcode_match} onFind={onFind} />}
        {item.reviewed_by && <p className="text-xs text-muted">Last edited by {item.reviewed_by}</p>}
      </section>

      <section className="grid content-start gap-2">
        <p className="text-xs font-bold uppercase text-muted">Label as read ({item.units_per_serving} {item.unit_label} per serving)</p>
        {item.label_rows.length === 0 && <p className="text-sm text-muted">No label rows.</p>}
        <table className="w-full text-sm">
          <tbody>
            {item.label_rows.map((row, index) => (
              <tr key={`${row.name}-${index}`} className="border-b border-border/60 align-top">
                <td className="py-1 pr-2">{row.name}</td>
                <td className="whitespace-nowrap py-1 text-right tabular-nums">{row.amount ?? ''} {row.unit ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid content-start gap-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <Field label="Brand" value={draft.brand} disabled={isBusy} onChange={(brand) => setDraft({ ...draft, brand })} />
          <Field label="Name" value={draft.name} disabled={isBusy} onChange={(name) => setDraft({ ...draft, name })} />
          <label className="grid gap-1 text-xs font-bold uppercase text-muted">
            Form
            <select className="w-full min-w-0 border border-border bg-white px-2 py-1 text-sm font-normal normal-case text-foreground" disabled={isBusy} value={draft.form} onChange={(event) => setDraft({ ...draft, form: event.target.value as SupplementForm })}>
              {SUPPLEMENT_FORMS.map((form) => <option key={form} value={form}>{form}</option>)}
            </select>
          </label>
          <Field label="Unit" value={draft.unit_label} disabled={isBusy} onChange={(unit_label) => setDraft({ ...draft, unit_label })} />
          <Field label="Units per serving" value={draft.units_per_serving} disabled={isBusy} onChange={(units_per_serving) => setDraft({ ...draft, units_per_serving })} />
          <label className="flex items-center gap-2 self-end pb-1 text-sm">
            <input type="checkbox" checked={draft.sold_in_vn} disabled={isBusy} onChange={(event) => setDraft({ ...draft, sold_in_vn: event.target.checked })} />
            Sold in Vietnam
          </label>
          {item.kind === 'catalog' && (
            // A person's own scan marked as food could no longer be logged; reject it instead.
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.macro_bearing} disabled={isBusy} onChange={(event) => setDraft({ ...draft, macro_bearing: event.target.checked })} />
              Logs as food (protein powder, gainer, shake)
            </label>
          )}
        </div>
        <SupplementNutrientEditor values={draft.nutrients} disabled={isBusy} onChange={(nutrients) => setDraft({ ...draft, nutrients })} />
        {invalid && <p className="text-sm font-semibold text-red-700">{invalid}</p>}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            disabled={disabled || waitsForCatalogRow}
            title={waitsForCatalogRow ? 'Decide the held-back catalog row with this barcode first.' : undefined}
            onClick={() => onReview(item, 'approve', changes)}
            className="bg-primary-forest px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            {approveLabel(Boolean(changes), match?.review_status === 'approved')}
          </button>
          <button type="button" disabled={disabled || !changes} onClick={() => onReview(item, 'edit', changes)} className="border border-border px-4 py-2 text-xs font-bold text-muted hover:border-primary-teal disabled:opacity-50">
            Save edits
          </button>
          <button type="button" disabled={isBusy} onClick={() => onReview(item, 'reject', null)} className="border border-red-300 px-4 py-2 text-xs font-bold text-red-800 hover:bg-red-50 disabled:opacity-50">
            Reject
          </button>
          {changes && (
            <button type="button" disabled={isBusy} onClick={() => setDraft(toDraft(item))} className="px-2 text-xs font-bold text-muted hover:text-foreground">
              Undo edits
            </button>
          )}
        </div>
      </section>
    </article>
  );
}

function BarcodeMatchNote({ match, onFind }: { match: SupplementBarcodeMatch; onFind: (query: string) => void }) {
  const label = [match.brand, match.name].filter(Boolean).join(' ');
  const where = match.catalog_key ? ` (${match.catalog_key})` : '';
  return match.review_status === 'approved' ? (
    <p className="border border-primary-teal/40 bg-primary-teal/10 p-3 text-sm text-foreground">
      Already in the catalog as {label}{where}. Approving moves this person&apos;s list and doses there; their scan stays private.
    </p>
  ) : (
    <div className="grid gap-2 border border-energy-orange/40 bg-energy-orange-soft p-3 text-sm text-foreground">
      <p>Held-back catalog row {label}{where} has this barcode. Approve or reject that row first.</p>
      <button type="button" onClick={() => onFind(match.catalog_key ?? match.name)} className="justify-self-start text-xs font-bold text-primary-emerald underline">
        Show that row
      </button>
    </div>
  );
}

function approveLabel(hasChanges: boolean, merges: boolean): string {
  if (merges) return hasChanges ? 'Save and merge' : 'Approve and merge';
  return hasChanges ? 'Save and approve' : 'Approve';
}

function Field({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase text-muted">
      {label}
      <input className="w-full min-w-0 border border-border bg-white px-2 py-1 text-sm font-normal normal-case text-foreground" disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function toDraft(item: SupplementReviewItem): Draft {
  return {
    brand: item.brand ?? '',
    name: item.name,
    form: item.form,
    unit_label: item.unit_label,
    units_per_serving: String(item.units_per_serving),
    sold_in_vn: item.sold_in_vn,
    macro_bearing: item.macro_bearing,
    nutrients: Object.fromEntries(Object.entries(item.nutrients).map(([key, value]) => [key, String(value)])),
  };
}

/** The fields that differ from the item, or why the draft cannot be sent. */
function changesFrom(item: SupplementReviewItem, draft: Draft): SupplementEdits | string {
  const changes: SupplementEdits = {};
  const brand = draft.brand.trim() || null;
  if (brand !== (item.brand ?? null)) changes.brand = brand;
  const name = draft.name.trim();
  if (!name) return 'A name is required.';
  if (name !== item.name) changes.name = name;
  if (draft.form !== item.form) changes.form = draft.form;
  const unitLabel = draft.unit_label.trim();
  if (!unitLabel) return 'A unit is required.';
  if (unitLabel !== item.unit_label) changes.unit_label = unitLabel;
  const units = Number(draft.units_per_serving);
  if (!Number.isFinite(units) || units <= 0) return 'Units per serving must be more than zero.';
  if (units !== item.units_per_serving) changes.units_per_serving = units;
  if (draft.sold_in_vn !== item.sold_in_vn) changes.sold_in_vn = draft.sold_in_vn;
  if (draft.macro_bearing !== item.macro_bearing) changes.macro_bearing = draft.macro_bearing;

  const nutrients: Record<string, number> = {};
  for (const [key, raw] of Object.entries(draft.nutrients)) {
    if (!raw.trim()) continue;
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount < 0) return `${key} must be a number of zero or more.`;
    // 0 preformed vitamin A means "all beta-carotene", unlike a missing value.
    if (amount > 0 || key === 'vitamin_a_preformed') nutrients[key] = amount;
  }
  const before = Object.entries(item.nutrients);
  const same = before.length === Object.keys(nutrients).length && before.every(([key, value]) => nutrients[key] === value);
  if (!same) changes.nutrients = nutrients;
  return changes;
}
