import type {
  MealCatalogEnrichmentResponse,
  MealCatalogImportResponse,
  MealCatalogResolutionCandidate,
  MealCatalogResolutionIssue,
  MealCatalogUnverifiedReference,
} from '@/types/meal-catalog';

interface Props {
  enrichment: MealCatalogEnrichmentResponse | null;
  error: string | null;
  isBusy: boolean;
  result: MealCatalogImportResponse | null;
  selectedMappings: Record<string, number>;
  onApproveCandidate: (
    issue: MealCatalogResolutionIssue,
    candidate: MealCatalogResolutionCandidate
  ) => void | Promise<void>;
  onApproveExactMatches: (
    matches: Array<{ issue: MealCatalogResolutionIssue; candidate: MealCatalogResolutionCandidate }>
  ) => Promise<void>;
}

export function MealCatalogImportResults({
  enrichment,
  error,
  isBusy,
  result,
  selectedMappings,
  onApproveCandidate,
  onApproveExactMatches,
}: Props) {
  if (isBusy) return <Panel><p className="font-semibold">Đang kiểm tra danh mục…</p><p className="mt-2 text-sm text-slate-500">Backend đang kiểm tra nguyên liệu và món trùng lặp.</p></Panel>;
  if (error) return <Panel className="border-red-200 bg-red-50"><p className="font-semibold text-red-800">Thao tác thất bại</p><p className="mt-2 break-words text-sm text-red-700">{error}</p></Panel>;
  if (enrichment) return <EnrichmentSummary summary={enrichment} />;
  if (!result) return <Panel><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hàng chờ duyệt</p><p className="mt-3 text-sm text-slate-500">Đối chiếu manifest để xem các bước cần làm trước khi đăng.</p></Panel>;

  const errors = [...result.validation.errors, ...result.errors.filter((error) => !error.includes('food_reference_not_verified'))];
  const exactUnverified = groupExactUnverifiedIssues(result.issues);
  const otherIssues = result.issues.filter((issue) => issue.reason !== 'exact_match_not_verified');

  return <Panel>
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Hàng chờ duyệt</p><h2 className="mt-1 text-xl font-semibold">{result.applied ? 'Đã nhập xong' : result.dry_run ? 'Đã xem trước xong' : 'Đã đối chiếu xong'}</h2></div><span className={`rounded-lg border px-2 py-1 text-xs font-semibold ${result.applied ? 'border-sky-200 bg-sky-50 text-slate-900' : 'border-slate-200 text-slate-500'}`}>{result.applied ? 'ĐÃ GHI' : 'CHƯA GHI'}</span></div>
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"><Metric label="Công thức" value={result.recipe_count} /><Metric label="Đã thêm" value={result.inserted} /><Metric label="Bỏ qua" value={result.skipped_existing} /><Metric label="Mục cần duyệt" value={exactUnverified.length + otherIssues.length + result.review_required.length + errors.length} /></div>
    <div className="mt-5 space-y-5 text-sm"><Coverage coverage={result.coverage} /><UnverifiedReferences references={result.unverified_references ?? []} /><ExactUnverifiedReview groups={exactUnverified} selectedMappings={selectedMappings} onApproveCandidate={onApproveCandidate} onApproveExactMatches={onApproveExactMatches} /><Errors errors={errors} /><CandidateReview issues={otherIssues} selectedMappings={selectedMappings} onApproveCandidate={onApproveCandidate} /><DuplicateReview reviews={result.review_required} /></div>
    <p className="mt-5 break-all border-t border-slate-200 pt-3 font-mono text-[10px] text-slate-500">Mã băm: {result.manifest_digest}</p>
  </Panel>;
}

function EnrichmentSummary({ summary }: { summary: MealCatalogEnrichmentResponse }) { return <Panel><p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Đã bổ sung xong</p><h2 className="mt-1 text-xl font-semibold">Đã lưu ứng viên để duyệt</h2><div className="mt-5 grid grid-cols-3 gap-2"><Metric label="Đã thử" value={summary.attempted} /><Metric label="Đã lưu" value={summary.enriched} /><Metric label="Đã có sẵn" value={summary.skipped_existing} /></div><p className="mt-5 text-sm text-slate-500">Tiếp theo, chạy Đối chiếu nguyên liệu. Bước bổ sung chỉ lưu ứng viên, không bao giờ đăng món ăn.</p></Panel>; }
function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <div className={`border border-slate-200 bg-white p-5 ${className} rounded-xl overflow-hidden`}>{children}</div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>; }
function Coverage({ coverage }: { coverage: MealCatalogImportResponse['coverage'] }) { const entries = Object.entries(coverage); if (!entries.length) return null; return <div><p className="font-semibold">Độ phủ</p><div className="mt-2 grid gap-2 sm:grid-cols-3">{entries.map(([cuisine, counts]) => <div key={cuisine} className="border border-slate-200 bg-slate-50 p-3 rounded-xl"><p className="font-semibold capitalize">{cuisine}</p><p className="mt-1 text-xs text-slate-500">{Object.entries(counts).map(([type, count]) => `${type}: ${count}`).join(' · ')}</p></div>)}</div></div>; }
function Errors({ errors }: { errors: string[] }) { return <div><p className="font-semibold">Lỗi kiểm tra <span className="text-slate-500">({errors.length})</span></p>{errors.length ? <ul className="mt-2 space-y-1 text-red-700">{errors.map((error, index) => <li key={`${error}-${index}`}>• {error}</li>)}</ul> : <p className="mt-1 text-slate-500">Không có lỗi kiểm tra hay lỗi nhập.</p>}</div>; }
function UnverifiedReferences({ references }: { references: MealCatalogUnverifiedReference[] }) { const unique = Array.from(new Map(references.map((reference) => [reference.food_reference_id, reference])).values()); if (!unique.length) return null; return <div className="border border-amber-200 bg-amber-50 p-3 rounded-xl"><p className="font-semibold text-amber-700">Tham chiếu được ghim cần xác minh <span className="text-slate-500">({unique.length})</span></p><p className="mt-1 text-sm text-slate-500">Dùng “Xóa ID bị chặn &amp; ánh xạ, rồi đối chiếu” để đưa các mục này về hàng chờ duyệt. Không tự thêm lại ID.</p><ul className="mt-3 space-y-1 text-xs text-slate-900">{unique.map((reference) => <li key={reference.food_reference_id}>#{reference.food_reference_id} · {reference.food_reference_name} · {reference.source} · dùng trong {references.filter((item) => item.food_reference_id === reference.food_reference_id).length} nguyên liệu công thức</li>)}</ul></div>; }

type ExactUnverifiedGroup = { candidate: MealCatalogResolutionCandidate; issue: MealCatalogResolutionIssue; uses: number };
function groupExactUnverifiedIssues(issues: MealCatalogResolutionIssue[]): ExactUnverifiedGroup[] { const groups = new Map<string, ExactUnverifiedGroup>(); for (const issue of issues) { const candidate = issue.candidates.find((item) => !item.is_verified && item.score === 1); if (!candidate || issue.reason !== 'exact_match_not_verified') continue; const key = `${issue.normalized_name}:${candidate.food_reference_id}`; const existing = groups.get(key); if (existing) existing.uses += 1; else groups.set(key, { candidate, issue, uses: 1 }); } return Array.from(groups.values()); }
function ExactUnverifiedReview({ groups, selectedMappings, onApproveCandidate, onApproveExactMatches }: { groups: ExactUnverifiedGroup[]; selectedMappings: Record<string, number>; onApproveCandidate: Props['onApproveCandidate']; onApproveExactMatches: Props['onApproveExactMatches'] }) { if (!groups.length) return null; const pending = groups.filter(({ candidate, issue }) => selectedMappings[issue.normalized_name] !== candidate.food_reference_id); return <div className="border border-amber-200 bg-amber-50 p-3 rounded-xl"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-amber-700">Xem và duyệt các kết quả khớp chính xác <span className="text-slate-500">({groups.length})</span></p><p className="mt-1 text-sm text-slate-500">Kiểm tra nguồn và dinh dưỡng của từng nguyên liệu. Thao tác này xác minh tham chiếu đã chọn, ánh xạ mọi lần dùng trong công thức, rồi tự kiểm tra lại toàn bộ manifest.</p></div>{pending.length > 0 && <button type="button" onClick={() => void onApproveExactMatches(pending)} className="border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 rounded-lg">Duyệt, ánh xạ &amp; kiểm tra lại tất cả ({pending.length})</button>}</div><div className="mt-3 space-y-2">{groups.map(({ candidate, issue, uses }) => { const mapped = selectedMappings[issue.normalized_name] === candidate.food_reference_id; return <div key={`${issue.normalized_name}-${candidate.food_reference_id}`} className="flex flex-wrap items-center justify-between gap-2 border border-slate-200 bg-white p-3 rounded-xl"><p className="text-xs"><span className="font-semibold">{issue.ingredient_name}</span> · #{candidate.food_reference_id} · {candidate.source} · {uses} lần dùng</p><button type="button" disabled={mapped} onClick={() => void onApproveCandidate(issue, candidate)} className={`rounded-lg border px-2 py-1 text-xs font-semibold disabled:cursor-not-allowed ${mapped ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>{mapped ? 'Đã xác minh & ánh xạ' : 'Duyệt & ánh xạ'}</button></div>; })}</div></div>; }
function CandidateReview({ issues, selectedMappings, onApproveCandidate }: { issues: MealCatalogImportResponse['issues']; selectedMappings: Record<string, number>; onApproveCandidate: Props['onApproveCandidate'] }) { if (!issues.length) return null; return <div><p className="font-semibold">Các ứng viên khác cần quyết định <span className="text-slate-500">({issues.length})</span></p><div className="mt-2 space-y-3">{issues.map((issue) => <article key={`${issue.recipe_key}-${issue.ingredient_index}`} className="border border-amber-200 bg-amber-50 p-3 rounded-xl"><p className="font-semibold">{issue.ingredient_name} <span className="font-normal text-slate-500">trong {issue.recipe_key}</span></p><p className="mt-1 text-xs text-amber-700">{issue.reason}</p>{issue.candidates.map((candidate) => { const mapped = selectedMappings[issue.normalized_name] === candidate.food_reference_id; return <button key={candidate.food_reference_id} type="button" disabled={mapped} onClick={() => void onApproveCandidate(issue, candidate)} className="mt-2 w-full border border-slate-900 bg-white px-3 py-2 text-left text-xs hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed rounded-lg"><span className="font-semibold">{candidate.name}</span> · #{candidate.food_reference_id} · {Math.round(candidate.score * 100)}% · {mapped ? 'đã ánh xạ' : candidate.is_verified ? 'dùng ánh xạ đã xác minh' : 'duyệt & ánh xạ'}</button>; })}</article>)}</div></div>; }
function DuplicateReview({ reviews }: { reviews: MealCatalogImportResponse['review_required'] }) { return <div><p className="font-semibold">Món gần trùng cần xem <span className="text-slate-500">({reviews.length})</span></p>{reviews.length ? <ul className="mt-2 space-y-1 text-amber-700">{reviews.map((review) => <li key={`${review.recipe_key}-${review.matched_catalog_key}`}>• {review.recipe_key} giống {review.matched_catalog_key} ({Math.round(review.ingredient_jaccard * 100)}%)</li>)}</ul> : <p className="mt-1 text-slate-500">Không có món gần trùng nào bị giữ lại.</p>}</div>; }
