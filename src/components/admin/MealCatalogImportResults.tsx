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
  if (isBusy) return <Panel><p className="font-semibold">Running catalog checks…</p><p className="mt-2 text-sm text-muted">The backend is validating ingredients and duplicate safety.</p></Panel>;
  if (error) return <Panel className="border-red-200 bg-red-50"><p className="font-semibold text-red-800">Operation failed</p><p className="mt-2 break-words text-sm text-red-700">{error}</p></Panel>;
  if (enrichment) return <EnrichmentSummary summary={enrichment} />;
  if (!result) return <Panel><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Review queue</p><p className="mt-3 text-sm text-muted">Resolve a manifest to see the exact steps required before it can be published.</p></Panel>;

  const errors = [...result.validation.errors, ...result.errors.filter((error) => !error.includes('food_reference_not_verified'))];
  const exactUnverified = groupExactUnverifiedIssues(result.issues);
  const otherIssues = result.issues.filter((issue) => issue.reason !== 'exact_match_not_verified');

  return <Panel>
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-emerald">Review queue</p><h2 className="mt-1 text-xl font-bold">{result.applied ? 'Import applied' : result.dry_run ? 'Preview complete' : 'Resolution complete'}</h2></div><span className={`border px-2 py-1 text-xs font-bold ${result.applied ? 'border-primary-teal/30 bg-primary-teal/10 text-primary-forest' : 'border-border text-muted'}`}>{result.applied ? 'COMMITTED' : 'NO WRITES'}</span></div>
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"><Metric label="Recipes" value={result.recipe_count} /><Metric label="Inserted" value={result.inserted} /><Metric label="Skipped" value={result.skipped_existing} /><Metric label="Review items" value={exactUnverified.length + otherIssues.length + result.review_required.length + errors.length} /></div>
    <div className="mt-5 space-y-5 text-sm"><Coverage coverage={result.coverage} /><UnverifiedReferences references={result.unverified_references ?? []} /><ExactUnverifiedReview groups={exactUnverified} selectedMappings={selectedMappings} onApproveCandidate={onApproveCandidate} onApproveExactMatches={onApproveExactMatches} /><Errors errors={errors} /><CandidateReview issues={otherIssues} selectedMappings={selectedMappings} onApproveCandidate={onApproveCandidate} /><DuplicateReview reviews={result.review_required} /></div>
    <p className="mt-5 break-all border-t border-border pt-3 font-mono text-[10px] text-muted">Digest: {result.manifest_digest}</p>
  </Panel>;
}

function EnrichmentSummary({ summary }: { summary: MealCatalogEnrichmentResponse }) { return <Panel><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-emerald">Enrichment complete</p><h2 className="mt-1 text-xl font-bold">Candidates cached for review</h2><div className="mt-5 grid grid-cols-3 gap-2"><Metric label="Attempted" value={summary.attempted} /><Metric label="Cached" value={summary.enriched} /><Metric label="Already present" value={summary.skipped_existing} /></div><p className="mt-5 text-sm text-muted">Run Resolve ingredients next. Enrichment only caches candidates; it never publishes meals.</p></Panel>; }
function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <div className={`border-y border-border bg-white p-5 ${className}`}>{children}</div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="bg-background p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>; }
function Coverage({ coverage }: { coverage: MealCatalogImportResponse['coverage'] }) { const entries = Object.entries(coverage); if (!entries.length) return null; return <div><p className="font-bold">Coverage</p><div className="mt-2 grid gap-2 sm:grid-cols-3">{entries.map(([cuisine, counts]) => <div key={cuisine} className="border border-border bg-background p-3"><p className="font-semibold capitalize">{cuisine}</p><p className="mt-1 text-xs text-muted">{Object.entries(counts).map(([type, count]) => `${type}: ${count}`).join(' · ')}</p></div>)}</div></div>; }
function Errors({ errors }: { errors: string[] }) { return <div><p className="font-bold">Validation errors <span className="text-muted">({errors.length})</span></p>{errors.length ? <ul className="mt-2 space-y-1 text-red-700">{errors.map((error, index) => <li key={`${error}-${index}`}>• {error}</li>)}</ul> : <p className="mt-1 text-muted">No validation or import errors.</p>}</div>; }
function UnverifiedReferences({ references }: { references: MealCatalogUnverifiedReference[] }) { const unique = Array.from(new Map(references.map((reference) => [reference.food_reference_id, reference])).values()); if (!unique.length) return null; return <div className="border border-energy-orange/40 bg-energy-orange-soft p-3"><p className="font-bold text-energy-orange">Pinned references need verification <span className="text-muted">({unique.length})</span></p><p className="mt-1 text-sm text-muted">Use “Clear blocked IDs & mappings, then resolve” to return these to the review queue. Do not add the IDs back manually.</p><ul className="mt-3 space-y-1 text-xs text-foreground">{unique.map((reference) => <li key={reference.food_reference_id}>#{reference.food_reference_id} · {reference.food_reference_name} · {reference.source} · used by {references.filter((item) => item.food_reference_id === reference.food_reference_id).length} recipe ingredient{references.filter((item) => item.food_reference_id === reference.food_reference_id).length === 1 ? '' : 's'}</li>)}</ul></div>; }

type ExactUnverifiedGroup = { candidate: MealCatalogResolutionCandidate; issue: MealCatalogResolutionIssue; uses: number };
function groupExactUnverifiedIssues(issues: MealCatalogResolutionIssue[]): ExactUnverifiedGroup[] { const groups = new Map<string, ExactUnverifiedGroup>(); for (const issue of issues) { const candidate = issue.candidates.find((item) => !item.is_verified && item.score === 1); if (!candidate || issue.reason !== 'exact_match_not_verified') continue; const key = `${issue.normalized_name}:${candidate.food_reference_id}`; const existing = groups.get(key); if (existing) existing.uses += 1; else groups.set(key, { candidate, issue, uses: 1 }); } return Array.from(groups.values()); }
function ExactUnverifiedReview({ groups, selectedMappings, onApproveCandidate, onApproveExactMatches }: { groups: ExactUnverifiedGroup[]; selectedMappings: Record<string, number>; onApproveCandidate: Props['onApproveCandidate']; onApproveExactMatches: Props['onApproveExactMatches'] }) { if (!groups.length) return null; const pending = groups.filter(({ candidate, issue }) => selectedMappings[issue.normalized_name] !== candidate.food_reference_id); return <div className="border border-energy-orange/40 bg-energy-orange-soft p-3"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-energy-orange">Review and approve exact matches <span className="text-muted">({groups.length})</span></p><p className="mt-1 text-sm text-muted">Review the source and nutrition for each unique ingredient. This verifies the selected reference, maps every matching recipe use, then automatically rechecks the complete manifest.</p></div>{pending.length > 0 && <button type="button" onClick={() => void onApproveExactMatches(pending)} className="border border-primary-forest bg-primary-forest px-3 py-2 text-xs font-bold text-white hover:bg-primary-teal">Review, verify, map &amp; recheck all ({pending.length})</button>}</div><div className="mt-3 space-y-2">{groups.map(({ candidate, issue, uses }) => { const mapped = selectedMappings[issue.normalized_name] === candidate.food_reference_id; return <div key={`${issue.normalized_name}-${candidate.food_reference_id}`} className="flex flex-wrap items-center justify-between gap-2 border border-border bg-white p-3"><p className="text-xs"><span className="font-semibold">{issue.ingredient_name}</span> · #{candidate.food_reference_id} · {candidate.source} · {uses} use{uses === 1 ? '' : 's'}</p><button type="button" disabled={mapped} onClick={() => void onApproveCandidate(issue, candidate)} className={`border px-2 py-1 text-xs font-bold disabled:cursor-not-allowed ${mapped ? 'border-primary-forest bg-primary-forest text-white' : 'border-primary-forest text-primary-forest hover:bg-primary-forest hover:text-white'}`}>{mapped ? 'Verified & mapped' : 'Review, verify & map'}</button></div>; })}</div></div>; }
function CandidateReview({ issues, selectedMappings, onApproveCandidate }: { issues: MealCatalogImportResponse['issues']; selectedMappings: Record<string, number>; onApproveCandidate: Props['onApproveCandidate'] }) { if (!issues.length) return null; return <div><p className="font-bold">Other candidate decisions <span className="text-muted">({issues.length})</span></p><div className="mt-2 space-y-3">{issues.map((issue) => <article key={`${issue.recipe_key}-${issue.ingredient_index}`} className="border border-energy-orange/40 bg-energy-orange-soft p-3"><p className="font-semibold">{issue.ingredient_name} <span className="font-normal text-muted">in {issue.recipe_key}</span></p><p className="mt-1 text-xs text-energy-orange">{issue.reason}</p>{issue.candidates.map((candidate) => { const mapped = selectedMappings[issue.normalized_name] === candidate.food_reference_id; return <button key={candidate.food_reference_id} type="button" disabled={mapped} onClick={() => void onApproveCandidate(issue, candidate)} className="mt-2 w-full border border-primary-forest bg-white px-3 py-2 text-left text-xs hover:bg-primary-forest hover:text-white disabled:cursor-not-allowed"><span className="font-semibold">{candidate.name}</span> · #{candidate.food_reference_id} · {Math.round(candidate.score * 100)}% · {mapped ? 'mapped' : candidate.is_verified ? 'use verified mapping' : 'review, verify & map'}</button>; })}</article>)}</div></div>; }
function DuplicateReview({ reviews }: { reviews: MealCatalogImportResponse['review_required'] }) { return <div><p className="font-bold">Near-duplicate reviews <span className="text-muted">({reviews.length})</span></p>{reviews.length ? <ul className="mt-2 space-y-1 text-energy-orange">{reviews.map((review) => <li key={`${review.recipe_key}-${review.matched_catalog_key}`}>• {review.recipe_key} matches {review.matched_catalog_key} ({Math.round(review.ingredient_jaccard * 100)}%)</li>)}</ul> : <p className="mt-1 text-muted">No near-duplicates held for review.</p>}</div>; }
