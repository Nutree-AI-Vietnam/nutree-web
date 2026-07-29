'use client';

import { useMemo, useState } from 'react';
import { MealCatalogImportResults } from '@/components/admin/MealCatalogImportResults';
import { MealCatalogImportProgress, type MealCatalogWorkflowStep } from '@/components/admin/MealCatalogImportProgress';
import type {
  MealCatalogEnrichmentResponse,
  MealCatalogImportOptions,
  MealCatalogImportRequest,
  MealCatalogImportResponse,
  MealCatalogResolutionCandidate,
  MealCatalogResolutionIssue,
} from '@/types/meal-catalog';

interface Props {
  enrichment: MealCatalogEnrichmentResponse | null;
  error: string | null;
  isBusy: boolean;
  isConnected: boolean;
  lastAction: 'enrich' | 'import' | 'preview' | 'resolve' | null;
  result: MealCatalogImportResponse | null;
  onEnrich: (request: MealCatalogImportRequest) => void;
  onImport: (request: MealCatalogImportRequest) => void;
  onPreview: (request: MealCatalogImportRequest) => void;
  onResolve: (request: MealCatalogImportRequest) => void;
}

type ParsedManifest =
  | { manifest: Record<string, unknown>; resolverMap: Record<string, number> }
  | { error: string };

const emptyManifest = '{\n  "release_key": "",\n  "expected_recipe_count": 0,\n  "recipes": []\n}';

export function MealCatalogImportWorkspace(props: Props) {
  const [manifestText, setManifestText] = useState(emptyManifest);
  const [resolverText, setResolverText] = useState('{}');
  const [inputError, setInputError] = useState<string | null>(null);
  const [mappingMessage, setMappingMessage] = useState<string | null>(null);
  const [options, setOptions] = useState<MealCatalogImportOptions>(defaultOptions);
  const [draftRevision, setDraftRevision] = useState(0);
  const [resolvedRevision, setResolvedRevision] = useState<number | null>(null);
  const [previewRevision, setPreviewRevision] = useState<number | null>(null);
  const parsed = useMemo<ParsedManifest>(
    () => parseInputs(manifestText, resolverText),
    [manifestText, resolverText]
  );

  function makeRequest(dryRun = false): MealCatalogImportRequest | null {
    if ('error' in parsed) {
      setInputError(parsed.error);
      return null;
    }
    setInputError(null);
    return { ...options, dry_run: dryRun, manifest: parsed.manifest, resolver_map: parsed.resolverMap };
  }

  function chooseFile(file: File): void {
    void file.text().then((text) => updateManifest(text)).catch(() => setInputError('Could not read that file.'));
  }

  function approveCandidate(issue: MealCatalogResolutionIssue, candidate: MealCatalogResolutionCandidate): void {
    if ('error' in parsed) {
      setInputError(parsed.error);
      return;
    }
    const nextMap = { ...parsed.resolverMap, [issue.normalized_name]: candidate.food_reference_id };
    updateResolverMap(JSON.stringify(nextMap, null, 2));
    setMappingMessage(`Mapped “${issue.normalized_name}” to ${candidate.name}. Re-run resolve before importing.`);
  }

  function updateManifest(value: string): void { setManifestText(value); setDraftRevision((value) => value + 1); }
  function updateResolverMap(value: string): void { setResolverText(value); setDraftRevision((value) => value + 1); }
  function updateOptions(value: MealCatalogImportOptions): void { setOptions(value); setDraftRevision((current) => current + 1); }
  function requestAction(action: 'enrich' | 'import' | 'preview' | 'resolve'): void {
    const request = makeRequest(action === 'preview');
    if (!request) return;
    if (action === 'resolve') setResolvedRevision(draftRevision);
    if (action === 'preview') setPreviewRevision(draftRevision);
    if (action === 'enrich') props.onEnrich(request);
    if (action === 'resolve') props.onResolve(request);
    if (action === 'preview') props.onPreview(request);
    if (action === 'import') props.onImport(request);
  }

  const hasManifest = !('error' in parsed) && Array.isArray(parsed.manifest.recipes) && parsed.manifest.recipes.length > 0;
  const resultHasBlockers = Boolean(props.result && (props.result.validation.errors.length || props.result.errors.length || props.result.issues.length || props.result.review_required.length));
  const hasPendingMapping = (resolvedRevision !== null && resolvedRevision !== draftRevision) || (previewRevision !== null && previewRevision !== draftRevision);
  const resolvedCleanly = props.lastAction === 'resolve' && Boolean(props.result) && !resultHasBlockers && !hasPendingMapping;
  const previewCleanly = props.lastAction === 'preview' && Boolean(props.result) && !resultHasBlockers && previewRevision === draftRevision;
  const canEnrich = props.lastAction === 'resolve' && Boolean(props.result?.issues.length) && !hasPendingMapping;
  const steps = workflowSteps({ hasManifest, lastAction: props.lastAction, resultHasBlockers, resolvedCleanly, previewCleanly, hasPendingMapping });

  return (
    <section className="grid gap-4">
      <MealCatalogImportProgress steps={steps} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
      <div className="border-y border-border bg-white p-4 md:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-emerald">Catalog operations</p>
        <h2 className="mt-1 text-xl font-bold">Review and publish a manifest</h2>
        <p className="mt-1 max-w-xl text-sm text-muted">Enrich missing names, approve candidate mappings, resolve again, then preview before applying.</p>
        <label className="mt-5 block">
          <span className="mb-1 flex items-center justify-between text-xs font-bold uppercase text-muted">Manifest JSON <FilePicker onFile={chooseFile} /></span>
          <textarea value={manifestText} onChange={(event) => updateManifest(event.target.value)} className="min-h-[22rem] w-full border border-border bg-[#F7FAF8] p-3 font-mono text-xs text-foreground outline-none focus:border-primary-teal" spellCheck={false} />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-bold uppercase text-muted">Approved resolver map</span>
          <textarea value={resolverText} onChange={(event) => updateResolverMap(event.target.value)} className="min-h-28 w-full border border-border bg-[#F7FAF8] p-3 font-mono text-xs text-foreground outline-none focus:border-primary-teal" spellCheck={false} />
        </label>
        {inputError && <p className="mt-2 text-sm font-semibold text-red-700">{inputError}</p>}
        {mappingMessage && <p className="mt-2 text-sm font-semibold text-primary-forest">{mappingMessage}</p>}
        <ImportOptions options={options} onChange={updateOptions} />
        {!props.isConnected && <p className="mt-4 border border-energy-orange/40 bg-energy-orange-soft p-3 text-sm text-energy-orange">Connect the MealTrack backend to run catalog operations.</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton variant={!props.result || hasPendingMapping || props.lastAction === 'enrich' ? 'primary' : 'secondary'} disabled={!props.isConnected || props.isBusy || !hasManifest} onClick={() => requestAction('resolve')}>Resolve ingredients</ActionButton>
          <ActionButton variant={canEnrich ? 'primary' : 'secondary'} disabled={!props.isConnected || props.isBusy || !canEnrich} onClick={() => requestAction('enrich')}>Enrich missing names</ActionButton>
          <ActionButton variant={resolvedCleanly ? 'primary' : 'secondary'} disabled={!props.isConnected || props.isBusy || !resolvedCleanly} onClick={() => requestAction('preview')}>Preview import</ActionButton>
          <ActionButton variant="danger" disabled={!props.isConnected || props.isBusy || !previewCleanly} onClick={() => { if (window.confirm('Apply this exact reviewed manifest to the meal catalog?')) requestAction('import'); }}>Apply import</ActionButton>
        </div>
        <p className="mt-3 text-xs text-muted">Publish stays locked until the current JSON and resolver map complete a clean preview.</p>
      </div>
      <MealCatalogImportResults enrichment={props.enrichment} error={props.error} isBusy={props.isBusy} result={props.result} selectedMappings={'error' in parsed ? {} : parsed.resolverMap} onApproveCandidate={approveCandidate} />
      </div>
    </section>
  );
}

function FilePicker({ onFile }: { onFile: (file: File) => void }) {
  return <label className="cursor-pointer border border-border px-3 py-2 text-xs font-bold text-primary-forest hover:border-primary-teal">Load file<input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => event.target.files?.[0] && onFile(event.target.files[0])} /></label>;
}

function ImportOptions({ options, onChange }: { options: MealCatalogImportOptions; onChange: (options: MealCatalogImportOptions) => void }) {
  const update = (patch: Partial<MealCatalogImportOptions>) => onChange({ ...options, ...patch });
  return <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.partial} onChange={(event) => update({ partial: event.target.checked })} /> Partial import</label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.skip_exact_cuisine_count} onChange={(event) => update({ skip_exact_cuisine_count: event.target.checked })} /> Skip exact cuisine counts</label>
    <NumberField label="Expected recipes" value={options.expected_recipe_count} onChange={(value) => update({ expected_recipe_count: value })} />
    <NumberField label="Fuzzy threshold" value={options.auto_resolve_threshold ?? 0} min={0} max={1} step={0.01} onChange={(value) => update({ auto_resolve_threshold: value })} />
    <NumberField label="Min per cuisine/type" value={options.min_per_cuisine_meal_type} onChange={(value) => update({ min_per_cuisine_meal_type: value })} />
    <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={options.resolve_all_best_effort} onChange={(event) => update({ resolve_all_best_effort: event.target.checked })} /> Best-effort resolution <span className="text-xs text-muted">(requires careful review)</span></label>
  </div>;
}

function NumberField({ label, value, onChange, min = 0, max, step = 1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return <label className="text-xs font-bold uppercase text-muted">{label}<input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 h-10 w-full border border-border px-2 text-sm font-normal text-foreground" /></label>;
}

function ActionButton({ children, disabled, onClick, variant = 'primary' }: { children: React.ReactNode; disabled: boolean; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger' }) {
  const styles = variant === 'danger' ? 'border-red-700 bg-red-700 text-white hover:bg-red-800' : variant === 'secondary' ? 'border-primary-forest text-primary-forest hover:bg-primary-forest hover:text-white' : 'border-primary-teal bg-primary-teal text-white hover:bg-primary-emerald';
  return <button type="button" disabled={disabled} onClick={onClick} className={`h-11 border px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-muted ${styles}`}>{children}</button>;
}

function parseInputs(manifestText: string, resolverText: string): ParsedManifest {
  try {
    const manifest = JSON.parse(manifestText) as Record<string, unknown>;
    const resolverMap = JSON.parse(resolverText) as Record<string, unknown>;
    if (!resolverMap || Array.isArray(resolverMap) || typeof resolverMap !== 'object') throw new Error('Resolver map must be a JSON object of ingredient names to IDs.');
    const mappedEntries = Object.entries(resolverMap).map(([name, id]) => {
      if (typeof id !== 'number' || !Number.isInteger(id)) throw new Error(`Resolver ID for “${name}” must be an integer.`);
      return [name, id] as const;
    });
    return { manifest, resolverMap: Object.fromEntries(mappedEntries) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Invalid JSON.' };
  }
}

const defaultOptions: MealCatalogImportOptions = { partial: true, skip_exact_cuisine_count: false, expected_recipe_count: 180, min_per_cuisine_meal_type: 5, resolver_map: {}, auto_resolve_threshold: 0.92, resolve_all_best_effort: false };

function workflowSteps({ hasManifest, lastAction, resultHasBlockers, resolvedCleanly, previewCleanly, hasPendingMapping }: { hasManifest: boolean; lastAction: Props['lastAction']; resultHasBlockers: boolean; resolvedCleanly: boolean; previewCleanly: boolean; hasPendingMapping: boolean }): MealCatalogWorkflowStep[] {
  const reviewStatus = resultHasBlockers ? 'blocked' : hasPendingMapping ? 'current' : resolvedCleanly ? 'complete' : 'pending';
  return [
    { label: 'Load', detail: hasManifest ? 'Manifest ready' : 'Paste or upload JSON', status: hasManifest ? 'complete' : 'current' },
    { label: 'Resolve', detail: lastAction === 'resolve' ? 'Resolution report ready' : 'Check ingredient matches', status: lastAction === 'resolve' ? 'complete' : hasManifest ? 'current' : 'pending' },
    { label: 'Review', detail: resultHasBlockers ? 'Fix blockers or map candidates' : hasPendingMapping ? 'Resolve again after edits' : 'Approve mappings if needed', status: reviewStatus },
    { label: 'Preview', detail: previewCleanly ? 'Clean preview recorded' : 'Required before publish', status: previewCleanly ? 'complete' : resolvedCleanly ? 'current' : 'pending' },
    { label: 'Publish', detail: lastAction === 'import' ? 'Catalog updated' : 'Enabled after a clean preview', status: lastAction === 'import' ? 'complete' : previewCleanly ? 'current' : 'pending' },
  ];
}
