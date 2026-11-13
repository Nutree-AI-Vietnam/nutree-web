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
  onApproveFoodReference: (foodReferenceId: number) => Promise<void>;
  onApproveFoodReferences: (foodReferenceIds: number[]) => Promise<void>;
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
    void file.text().then((text) => updateManifest(text)).catch(() => setInputError('Không đọc được tệp này.'));
  }

  async function approveCandidate(issue: MealCatalogResolutionIssue, candidate: MealCatalogResolutionCandidate): Promise<void> {
    if ('error' in parsed) {
      setInputError(parsed.error);
      return;
    }
    if (!candidate.is_verified) {
      await props.onApproveFoodReference(candidate.food_reference_id);
    }
    const nextMap = { ...parsed.resolverMap, [issue.normalized_name]: candidate.food_reference_id };
    updateResolverMap(JSON.stringify(nextMap, null, 2));
    setMappingMessage(`${candidate.is_verified ? 'Đã ánh xạ' : 'Đã xác minh và ánh xạ'} “${issue.normalized_name}” sang ${candidate.name}. Hãy đối chiếu lại trước khi nhập.`);
  }

  async function approveExactMatches(
    matches: Array<{ issue: MealCatalogResolutionIssue; candidate: MealCatalogResolutionCandidate }>
  ): Promise<void> {
    if ('error' in parsed) {
      setInputError(parsed.error);
      return;
    }
    const uniqueMatches = Array.from(
      new Map(matches.map((match) => [`${match.issue.normalized_name}:${match.candidate.food_reference_id}`, match])).values()
    );
    if (!window.confirm(`Xác nhận bạn đã xem ${uniqueMatches.length} nguyên liệu khớp chính xác. Thao tác này sẽ xác minh và ánh xạ tất cả.`)) return;
    await props.onApproveFoodReferences(uniqueMatches.map((match) => match.candidate.food_reference_id));
    const nextMap = { ...parsed.resolverMap };
    uniqueMatches.forEach(({ issue, candidate }) => { nextMap[issue.normalized_name] = candidate.food_reference_id; });
    updateResolverMap(JSON.stringify(nextMap, null, 2));
    setResolvedRevision(draftRevision + 1);
    setMappingMessage(`Đã xác minh và ánh xạ ${uniqueMatches.length} nguyên liệu khớp chính xác. Đang kiểm tra lại toàn bộ manifest.`);
    props.onResolve({ ...options, dry_run: false, manifest: parsed.manifest, resolver_map: nextMap });
  }

  function removeUnverifiedReferenceIds(): void {
    if ('error' in parsed) {
      setInputError(parsed.error);
      return;
    }
    const blockedIds = new Set((props.result?.unverified_references ?? []).map((reference) => reference.food_reference_id));
    if (!blockedIds.size || !Array.isArray(parsed.manifest.recipes)) return;
    let removedReferences = 0;
    const recipes = parsed.manifest.recipes.map((recipe) => {
      if (!isRecord(recipe) || !Array.isArray(recipe.ingredients)) return recipe;
      return {
        ...recipe,
        ingredients: recipe.ingredients.map((ingredient) => {
          if (!isRecord(ingredient) || !blockedIds.has(Number(ingredient.food_reference_id))) return ingredient;
          const { food_reference_id: _foodReferenceId, ...withoutReferenceId } = ingredient;
          removedReferences += 1;
          return withoutReferenceId;
        }),
      };
    });
    const nextResolverMap = Object.fromEntries(
      Object.entries(parsed.resolverMap).filter(([, referenceId]) => !blockedIds.has(referenceId))
    );
    const removedMappings = Object.keys(parsed.resolverMap).length - Object.keys(nextResolverMap).length;
    if (!removedReferences && !removedMappings) return;
    updateManifest(JSON.stringify({ ...parsed.manifest, recipes }, null, 2));
    if (removedMappings) updateResolverMap(JSON.stringify(nextResolverMap, null, 2));
    setMappingMessage(`Đã xóa ${removedReferences} ID được ghim và ${removedMappings} ánh xạ bị chặn. Hãy đối chiếu nguyên liệu để xem các ứng viên đã xác minh.`);
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
      <div className="border border-slate-200 bg-white p-4 md:p-5 rounded-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Thao tác danh mục</p>
        <h2 className="mt-1 text-xl font-semibold">Duyệt và đăng manifest</h2>
        <p className="mt-1 max-w-xl text-sm text-slate-500">Đối chiếu nguyên liệu, duyệt rõ từng tham chiếu chưa xác minh, sau đó xem trước và đăng đúng manifest đã duyệt.</p>
        <label className="mt-5 block">
          <span className="mb-1 flex items-center justify-between text-xs font-semibold uppercase text-slate-500">Manifest JSON <FilePicker onFile={chooseFile} /></span>
          <textarea value={manifestText} onChange={(event) => updateManifest(event.target.value)} className="min-h-[22rem] w-full border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-900 outline-none focus:border-slate-400 rounded-xl" spellCheck={false} />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Bảng ánh xạ đã duyệt</span>
          <textarea value={resolverText} onChange={(event) => updateResolverMap(event.target.value)} className="min-h-28 w-full border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-900 outline-none focus:border-slate-400 rounded-xl" spellCheck={false} />
        </label>
        {inputError && <p className="mt-2 text-sm font-semibold text-red-700">{inputError}</p>}
        {mappingMessage && <p className="mt-2 text-sm font-semibold text-slate-900">{mappingMessage}</p>}
        <ImportOptions options={options} onChange={updateOptions} />
        {!props.isConnected && <p className="mt-4 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 rounded-xl">Kết nối backend MealTrack để thao tác với danh mục.</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton variant={!props.result || hasPendingMapping || props.lastAction === 'enrich' ? 'primary' : 'secondary'} disabled={!props.isConnected || props.isBusy || !hasManifest} onClick={() => requestAction('resolve')}>Đối chiếu nguyên liệu</ActionButton>
          <ActionButton variant={canEnrich ? 'primary' : 'secondary'} disabled={!props.isConnected || props.isBusy || !canEnrich} onClick={() => requestAction('enrich')}>Bổ sung tên còn thiếu</ActionButton>
          <ActionButton variant={resolvedCleanly ? 'primary' : 'secondary'} disabled={!props.isConnected || props.isBusy || !resolvedCleanly} onClick={() => requestAction('preview')}>Xem trước khi nhập</ActionButton>
          <ActionButton variant="danger" disabled={!props.isConnected || props.isBusy || !previewCleanly} onClick={() => { if (window.confirm('Áp dụng đúng manifest đã duyệt này vào danh mục món ăn?')) requestAction('import'); }}>Nhập vào danh mục</ActionButton>
        </div>
        {(props.result?.unverified_references?.length ?? 0) > 0 && <button type="button" disabled={props.isBusy} onClick={removeUnverifiedReferenceIds} className="mt-3 border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 rounded-lg">Xóa ID bị chặn &amp; ánh xạ, rồi đối chiếu</button>}
        <p className="mt-3 text-xs text-slate-500">Nút đăng sẽ bị khóa cho đến khi JSON và bảng ánh xạ hiện tại xem trước không có lỗi.</p>
      </div>
      <MealCatalogImportResults enrichment={props.enrichment} error={props.error} isBusy={props.isBusy} result={props.result} selectedMappings={'error' in parsed ? {} : parsed.resolverMap} onApproveCandidate={approveCandidate} onApproveExactMatches={approveExactMatches} />
      </div>
    </section>
  );
}

function FilePicker({ onFile }: { onFile: (file: File) => void }) {
  return <label className="cursor-pointer border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 hover:border-slate-300 rounded-lg">Tải tệp lên<input className="sr-only" type="file" accept="application/json,.json" onChange={(event) => event.target.files?.[0] && onFile(event.target.files[0])} /></label>;
}

function ImportOptions({ options, onChange }: { options: MealCatalogImportOptions; onChange: (options: MealCatalogImportOptions) => void }) {
  const update = (patch: Partial<MealCatalogImportOptions>) => onChange({ ...options, ...patch });
  return <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.partial} onChange={(event) => update({ partial: event.target.checked })} /> Nhập một phần</label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={options.skip_exact_cuisine_count} onChange={(event) => update({ skip_exact_cuisine_count: event.target.checked })} /> Bỏ qua kiểm tra số món theo ẩm thực</label>
    <NumberField label="Số công thức dự kiến" value={options.expected_recipe_count} onChange={(value) => update({ expected_recipe_count: value })} />
    <NumberField label="Ngưỡng khớp gần đúng" value={options.auto_resolve_threshold ?? 0} min={0} max={1} step={0.01} onChange={(value) => update({ auto_resolve_threshold: value })} />
    <NumberField label="Tối thiểu mỗi ẩm thực/bữa" value={options.min_per_cuisine_meal_type} onChange={(value) => update({ min_per_cuisine_meal_type: value })} />
    <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={options.resolve_all_best_effort} onChange={(event) => update({ resolve_all_best_effort: event.target.checked })} /> Đối chiếu tối đa có thể <span className="text-xs text-slate-500">(cần duyệt kỹ)</span></label>
  </div>;
}

function NumberField({ label, value, onChange, min = 0, max, step = 1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return <label className="text-xs font-semibold uppercase text-slate-500">{label}<input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 h-10 w-full border border-slate-200 px-2 text-sm font-normal text-slate-900 rounded-lg" /></label>;
}

function ActionButton({ children, disabled, onClick, variant = 'primary' }: { children: React.ReactNode; disabled: boolean; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger' }) {
  const styles = variant === 'danger' ? 'border-red-700 bg-red-700 text-white hover:bg-red-800' : variant === 'secondary' ? 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white' : 'border-sky-600 bg-sky-600 text-white hover:bg-slate-700';
  return <button type="button" disabled={disabled} onClick={onClick} className={`h-9 border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-transparent disabled:text-slate-400 ${styles} rounded-lg`}>{children}</button>;
}

function parseInputs(manifestText: string, resolverText: string): ParsedManifest {
  try {
    const manifest = JSON.parse(manifestText) as Record<string, unknown>;
    const resolverMap = JSON.parse(resolverText) as Record<string, unknown>;
    if (!resolverMap || Array.isArray(resolverMap) || typeof resolverMap !== 'object') throw new Error('Bảng ánh xạ phải là đối tượng JSON gồm tên nguyên liệu và ID.');
    const mappedEntries = Object.entries(resolverMap).map(([name, id]) => {
      if (typeof id !== 'number' || !Number.isInteger(id)) throw new Error(`ID ánh xạ của “${name}” phải là số nguyên.`);
      return [name, id] as const;
    });
    return { manifest, resolverMap: Object.fromEntries(mappedEntries) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'JSON không hợp lệ.' };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const defaultOptions: MealCatalogImportOptions = { partial: true, skip_exact_cuisine_count: false, expected_recipe_count: 180, min_per_cuisine_meal_type: 5, resolver_map: {}, auto_resolve_threshold: 0.92, resolve_all_best_effort: false };

function workflowSteps({ hasManifest, lastAction, resultHasBlockers, resolvedCleanly, previewCleanly, hasPendingMapping }: { hasManifest: boolean; lastAction: Props['lastAction']; resultHasBlockers: boolean; resolvedCleanly: boolean; previewCleanly: boolean; hasPendingMapping: boolean }): MealCatalogWorkflowStep[] {
  const reviewStatus = resultHasBlockers ? 'blocked' : hasPendingMapping ? 'current' : resolvedCleanly ? 'complete' : 'pending';
  return [
    { label: 'Tải lên', detail: hasManifest ? 'Manifest đã sẵn sàng' : 'Dán hoặc tải JSON lên', status: hasManifest ? 'complete' : 'current' },
    { label: 'Đối chiếu', detail: lastAction === 'resolve' ? 'Đã có báo cáo đối chiếu' : 'Kiểm tra nguyên liệu khớp', status: lastAction === 'resolve' ? 'complete' : hasManifest ? 'current' : 'pending' },
    { label: 'Duyệt', detail: resultHasBlockers ? 'Sửa lỗi chặn hoặc ánh xạ ứng viên' : hasPendingMapping ? 'Đối chiếu lại sau khi sửa' : 'Duyệt ánh xạ nếu cần', status: reviewStatus },
    { label: 'Xem trước', detail: previewCleanly ? 'Xem trước không có lỗi' : 'Bắt buộc trước khi đăng', status: previewCleanly ? 'complete' : resolvedCleanly ? 'current' : 'pending' },
    { label: 'Đăng', detail: lastAction === 'import' ? 'Đã cập nhật danh mục' : 'Mở sau khi xem trước không lỗi', status: lastAction === 'import' ? 'complete' : previewCleanly ? 'current' : 'pending' },
  ];
}
