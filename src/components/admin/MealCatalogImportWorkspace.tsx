'use client';

import { useMemo, useState } from 'react';
import type {
  MealCatalogImportOptions,
  MealCatalogImportRequest,
  MealCatalogImportResponse,
} from '@/types/meal-catalog';

interface Props {
  isConnected: boolean;
  isBusy: boolean;
  result: MealCatalogImportResponse | null;
  error: string | null;
  onResolve: (request: MealCatalogImportRequest) => void;
  onPreview: (request: MealCatalogImportRequest) => void;
  onImport: (request: MealCatalogImportRequest) => void;
}

const emptyManifest = '{\n  "release_key": "",\n  "expected_recipe_count": 0,\n  "recipes": []\n}';

type ParsedManifest =
  | { manifest: Record<string, unknown>; resolver_map: Record<string, number> }
  | { error: string };

export function MealCatalogImportWorkspace({
  isConnected,
  isBusy,
  result,
  error,
  onResolve,
  onPreview,
  onImport,
}: Props) {
  const [manifestText, setManifestText] = useState(emptyManifest);
  const [resolverText, setResolverText] = useState('{}');
  const [options, setOptions] = useState<MealCatalogImportOptions>({
    partial: true,
    skip_exact_cuisine_count: false,
    expected_recipe_count: 180,
    min_per_cuisine_meal_type: 5,
    resolver_map: {},
    auto_resolve_threshold: 0.92,
    resolve_all_best_effort: false,
  });
  const [inputError, setInputError] = useState<string | null>(null);

  const parsed = useMemo<ParsedManifest>(() => {
    try {
      const manifest = JSON.parse(manifestText) as Record<string, unknown>;
      const resolverMap = JSON.parse(resolverText) as Record<string, unknown>;
      if (!resolverMap || Array.isArray(resolverMap) || typeof resolverMap !== 'object') {
        throw new Error('Resolver map must be a JSON object of ingredient names to IDs.');
      }
      const resolver_map: Record<string, number> = {};
      for (const [name, id] of Object.entries(resolverMap)) {
        if (typeof id !== 'number' || !Number.isInteger(id)) {
          throw new Error(`Resolver ID for “${name}” must be an integer.`);
        }
        resolver_map[name] = id;
      }
      return { manifest, resolver_map };
    } catch (parseError) {
      return { error: parseError instanceof Error ? parseError.message : 'Invalid JSON.' };
    }
  }, [manifestText, resolverText]);

  function makeRequest(dryRun = false): MealCatalogImportRequest | null {
    if ('error' in parsed) {
      setInputError(parsed.error);
      return null;
    }
    setInputError(null);
    return { ...options, dry_run: dryRun, manifest: parsed.manifest, resolver_map: parsed.resolver_map };
  }

  function chooseFile(file: File): void {
    void file.text().then((text) => setManifestText(text)).catch(() => setInputError('Could not read that file.'));
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
      <div className="border-y border-border bg-white p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-emerald">Catalog operations</p>
            <h2 className="mt-1 text-xl font-bold">Import a reviewed manifest</h2>
            <p className="mt-1 max-w-xl text-sm text-muted">Resolve ingredient names first. The backend validates the same manifest again before any write.</p>
          </div>
          <label className="cursor-pointer border border-border px-3 py-2 text-xs font-bold text-primary-forest hover:border-primary-teal">
            Load JSON file
            <input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => event.target.files?.[0] && chooseFile(event.target.files[0])} />
          </label>
        </div>
        <label className="mt-5 block">
          <span className="mb-1 block text-xs font-bold uppercase text-muted">Manifest JSON</span>
          <textarea value={manifestText} onChange={(event) => setManifestText(event.target.value)} className="min-h-[22rem] w-full border border-border bg-[#F7FAF8] p-3 font-mono text-xs text-foreground outline-none focus:border-primary-teal" spellCheck={false} />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-bold uppercase text-muted">Resolver map JSON <span className="font-normal normal-case">(optional)</span></span>
          <textarea value={resolverText} onChange={(event) => setResolverText(event.target.value)} className="min-h-24 w-full border border-border bg-[#F7FAF8] p-3 font-mono text-xs text-foreground outline-none focus:border-primary-teal" spellCheck={false} />
        </label>
        {inputError && <p className="mt-2 text-sm font-semibold text-red-700">{inputError}</p>}
        <Options options={options} setOptions={setOptions} />
        {!isConnected && <p className="mt-4 border border-energy-orange/40 bg-energy-orange-soft p-3 text-sm text-energy-orange">Connect the MealTrack backend to run import operations.</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton disabled={!isConnected || isBusy} onClick={() => { const request = makeRequest(); if (request) onResolve(request); }}>Resolve ingredients</ActionButton>
          <ActionButton variant="secondary" disabled={!isConnected || isBusy} onClick={() => { const request = makeRequest(true); if (request) onPreview(request); }}>Preview import</ActionButton>
          <ActionButton variant="danger" disabled={!isConnected || isBusy} onClick={() => { const request = makeRequest(false); if (request && window.confirm('Apply this manifest to the meal catalog? The backend will only commit if its preview is safe.')) onImport(request); }}>Apply import</ActionButton>
        </div>
      </div>
      <ResultPanel result={result} error={error} isBusy={isBusy} />
    </section>
  );
}

function Options({ options, setOptions }: { options: MealCatalogImportOptions; setOptions: (value: MealCatalogImportOptions) => void }) {
  const update = (patch: Partial<MealCatalogImportOptions>) => setOptions({ ...options, ...patch });
  return <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.partial} onChange={(event) => update({ partial: event.target.checked })} /> Partial import</label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.skip_exact_cuisine_count} onChange={(event) => update({ skip_exact_cuisine_count: event.target.checked })} /> Skip exact cuisine counts</label>
    <label className="text-xs font-bold uppercase text-muted">Expected recipes<input type="number" min="0" value={options.expected_recipe_count} onChange={(event) => update({ expected_recipe_count: Number(event.target.value) })} className="mt-1 h-10 w-full border border-border px-2 text-sm font-normal text-foreground" /></label>
    <label className="text-xs font-bold uppercase text-muted">Fuzzy threshold<input type="number" min="0" max="1" step="0.01" value={options.auto_resolve_threshold ?? ''} onChange={(event) => update({ auto_resolve_threshold: event.target.value ? Number(event.target.value) : null })} className="mt-1 h-10 w-full border border-border px-2 text-sm font-normal text-foreground" /></label>
    <label className="text-xs font-bold uppercase text-muted">Min per cuisine/type<input type="number" min="0" value={options.min_per_cuisine_meal_type} onChange={(event) => update({ min_per_cuisine_meal_type: Number(event.target.value) })} className="mt-1 h-10 w-full border border-border px-2 text-sm font-normal text-foreground" /></label>
    <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={options.resolve_all_best_effort} onChange={(event) => update({ resolve_all_best_effort: event.target.checked })} /> Best-effort resolution <span className="text-xs text-muted">(review carefully before importing)</span></label>
  </div>;
}

function ActionButton({ children, onClick, disabled, variant = 'primary' }: { children: React.ReactNode; onClick: () => void; disabled: boolean; variant?: 'primary' | 'secondary' | 'danger' }) {
  const styles = variant === 'danger' ? 'border-red-700 bg-red-700 text-white hover:bg-red-800' : variant === 'secondary' ? 'border-primary-forest text-primary-forest hover:bg-primary-forest hover:text-white' : 'border-primary-teal bg-primary-teal text-white hover:bg-primary-emerald';
  return <button type="button" disabled={disabled} onClick={onClick} className={`h-11 border px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-muted ${styles}`}>{children}</button>;
}

function ResultPanel({ result, error, isBusy }: { result: MealCatalogImportResponse | null; error: string | null; isBusy: boolean }) {
  if (isBusy) return <div className="border-y border-border bg-white p-5"><p className="font-semibold">Running catalog checks…</p><p className="mt-2 text-sm text-muted">The backend is validating ingredients and duplicate safety.</p></div>;
  if (error) return <div className="border-y border-red-200 bg-red-50 p-5"><p className="font-semibold text-red-800">Operation failed</p><p className="mt-2 break-words text-sm text-red-700">{error}</p></div>;
  if (!result) return <div className="border-y border-border bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Results</p><p className="mt-3 text-sm text-muted">Run resolve or preview to see validation, coverage, and items needing review.</p></div>;
  const validationErrors = result.validation.errors.length + result.errors.length;
  return <div className="border-y border-border bg-white p-5">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-emerald">Results</p><h2 className="mt-1 text-xl font-bold">{result.applied ? 'Import applied' : result.dry_run ? 'Preview complete' : 'Resolution complete'}</h2></div><span className={`border px-2 py-1 text-xs font-bold ${result.applied ? 'border-primary-teal/30 bg-primary-teal/10 text-primary-forest' : 'border-border text-muted'}`}>{result.applied ? 'COMMITTED' : 'NO WRITES'}</span></div>
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"><Metric label="Recipes" value={result.recipe_count} /><Metric label="Inserted" value={result.inserted} /><Metric label="Skipped" value={result.skipped_existing} /><Metric label="Issues" value={result.issues.length + result.review_required.length + validationErrors} /></div>
    <div className="mt-5 space-y-4 text-sm"><Coverage coverage={result.coverage} /><ResultGroup title="Validation errors" items={[...result.validation.errors, ...result.errors]} empty="No validation or import errors." /><IssueList issues={result.issues} /><ReviewList reviews={result.review_required} /></div>
    <p className="mt-5 break-all border-t border-border pt-3 font-mono text-[10px] text-muted">Digest: {result.manifest_digest}</p>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="bg-background p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>; }
function Coverage({ coverage }: { coverage: MealCatalogImportResponse['coverage'] }) {
  const entries = Object.entries(coverage);
  if (!entries.length) return null;
  return <div><p className="font-bold">Coverage</p><div className="mt-2 grid gap-2 sm:grid-cols-3">{entries.map(([cuisine, counts]) => <div key={cuisine} className="border border-border bg-background p-3"><p className="font-semibold capitalize">{cuisine}</p><p className="mt-1 text-xs text-muted">{Object.entries(counts).map(([type, count]) => `${type}: ${count}`).join(' · ')}</p></div>)}</div></div>;
}
function ResultGroup({ title, items, empty }: { title: string; items: string[]; empty: string }) { return <div><p className="font-bold">{title} <span className="text-muted">({items.length})</span></p>{items.length ? <ul className="mt-2 space-y-1 text-red-700">{items.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul> : <p className="mt-1 text-muted">{empty}</p>}</div>; }
function IssueList({ issues }: { issues: MealCatalogImportResponse['issues'] }) { return <div><p className="font-bold">Ingredient issues <span className="text-muted">({issues.length})</span></p>{issues.length ? <div className="mt-2 space-y-2">{issues.map((issue) => <div key={`${issue.recipe_key}-${issue.ingredient_index}`} className="border border-energy-orange/40 bg-energy-orange-soft p-3"><p className="font-semibold">{issue.ingredient_name} <span className="font-normal text-muted">in {issue.recipe_key}</span></p><p className="mt-1 text-xs text-energy-orange">{issue.reason} · ingredient {issue.ingredient_index + 1}</p>{issue.candidates.length > 0 && <p className="mt-2 text-xs text-muted">Candidates: {issue.candidates.slice(0, 3).map((candidate) => `${candidate.name} (${Math.round(candidate.score * 100)}%)`).join(', ')}</p>}</div>)}</div> : <p className="mt-1 text-muted">No unresolved ingredients.</p>}</div>; }
function ReviewList({ reviews }: { reviews: MealCatalogImportResponse['review_required'] }) { return <div><p className="font-bold">Near-duplicate reviews <span className="text-muted">({reviews.length})</span></p>{reviews.length ? <ul className="mt-2 space-y-1 text-energy-orange">{reviews.map((review) => <li key={`${review.recipe_key}-${review.matched_catalog_key}`}>• {review.recipe_key} matches {review.matched_catalog_key} ({Math.round(review.ingredient_jaccard * 100)}%)</li>)}</ul> : <p className="mt-1 text-muted">No near-duplicates held for review.</p>}</div>; }
