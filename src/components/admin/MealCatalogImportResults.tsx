import type {
  MealCatalogEnrichmentResponse,
  MealCatalogImportResponse,
  MealCatalogResolutionCandidate,
  MealCatalogResolutionIssue,
} from '@/types/meal-catalog';

interface Props {
  enrichment: MealCatalogEnrichmentResponse | null;
  error: string | null;
  isBusy: boolean;
  result: MealCatalogImportResponse | null;
  selectedMappings: Record<string, number>;
  onApproveCandidate: (issue: MealCatalogResolutionIssue, candidate: MealCatalogResolutionCandidate) => void;
}

export function MealCatalogImportResults({ enrichment, error, isBusy, result, selectedMappings, onApproveCandidate }: Props) {
  if (isBusy) return <Panel><p className="font-semibold">Running catalog checks…</p><p className="mt-2 text-sm text-muted">The backend is validating ingredients and duplicate safety.</p></Panel>;
  if (error) return <Panel className="border-red-200 bg-red-50"><p className="font-semibold text-red-800">Operation failed</p><p className="mt-2 break-words text-sm text-red-700">{error}</p></Panel>;
  if (enrichment) return <EnrichmentSummary summary={enrichment} />;
  if (!result) return <Panel><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Review queue</p><p className="mt-3 text-sm text-muted">Resolve a manifest to review candidates, then approve one or more mappings here.</p></Panel>;
  return <Panel>
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-emerald">Review queue</p><h2 className="mt-1 text-xl font-bold">{result.applied ? 'Import applied' : result.dry_run ? 'Preview complete' : 'Resolution complete'}</h2></div><span className={`border px-2 py-1 text-xs font-bold ${result.applied ? 'border-primary-teal/30 bg-primary-teal/10 text-primary-forest' : 'border-border text-muted'}`}>{result.applied ? 'COMMITTED' : 'NO WRITES'}</span></div>
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"><Metric label="Recipes" value={result.recipe_count} /><Metric label="Inserted" value={result.inserted} /><Metric label="Skipped" value={result.skipped_existing} /><Metric label="Review items" value={result.issues.length + result.review_required.length + result.validation.errors.length + result.errors.length} /></div>
    <div className="mt-5 space-y-5 text-sm"><Coverage coverage={result.coverage} /><Errors errors={[...result.validation.errors, ...result.errors]} /><CandidateReview issues={result.issues} selectedMappings={selectedMappings} onApproveCandidate={onApproveCandidate} /><DuplicateReview reviews={result.review_required} /></div>
    <p className="mt-5 break-all border-t border-border pt-3 font-mono text-[10px] text-muted">Digest: {result.manifest_digest}</p>
  </Panel>;
}

function EnrichmentSummary({ summary }: { summary: MealCatalogEnrichmentResponse }) { return <Panel><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-emerald">Enrichment complete</p><h2 className="mt-1 text-xl font-bold">Candidates cached for review</h2><div className="mt-5 grid grid-cols-3 gap-2"><Metric label="Attempted" value={summary.attempted} /><Metric label="Cached" value={summary.enriched} /><Metric label="Already present" value={summary.skipped_existing} /></div><p className="mt-5 text-sm text-muted">Re-run Resolve ingredients to load the new candidates. Enrichment does not publish recipes.</p></Panel>; }
function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <div className={`border-y border-border bg-white p-5 ${className}`}>{children}</div>; }
function Metric({ label, value }: { label: string; value: number }) { return <div className="bg-background p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>; }
function Coverage({ coverage }: { coverage: MealCatalogImportResponse['coverage'] }) { const entries = Object.entries(coverage); if (!entries.length) return null; return <div><p className="font-bold">Coverage</p><div className="mt-2 grid gap-2 sm:grid-cols-3">{entries.map(([cuisine, counts]) => <div key={cuisine} className="border border-border bg-background p-3"><p className="font-semibold capitalize">{cuisine}</p><p className="mt-1 text-xs text-muted">{Object.entries(counts).map(([type, count]) => `${type}: ${count}`).join(' · ')}</p></div>)}</div></div>; }
function Errors({ errors }: { errors: string[] }) { return <div><p className="font-bold">Validation errors <span className="text-muted">({errors.length})</span></p>{errors.length ? <ul className="mt-2 space-y-1 text-red-700">{errors.map((error, index) => <li key={`${error}-${index}`}>• {error}</li>)}</ul> : <p className="mt-1 text-muted">No validation or import errors.</p>}</div>; }
function CandidateReview({ issues, selectedMappings, onApproveCandidate }: { issues: MealCatalogImportResponse['issues']; selectedMappings: Record<string, number>; onApproveCandidate: Props['onApproveCandidate'] }) { return <div><p className="font-bold">Ingredient candidates <span className="text-muted">({issues.length})</span></p>{issues.length ? <div className="mt-2 space-y-3">{issues.map((issue) => <article key={`${issue.recipe_key}-${issue.ingredient_index}`} className="border border-energy-orange/40 bg-energy-orange-soft p-3"><p className="font-semibold">{issue.ingredient_name} <span className="font-normal text-muted">in {issue.recipe_key}</span></p><p className="mt-1 text-xs text-energy-orange">{issue.reason}</p><div className="mt-3 space-y-2">{issue.candidates.map((candidate) => { const isSelected = selectedMappings[issue.normalized_name] === candidate.food_reference_id; return <div key={candidate.food_reference_id} className={`flex flex-wrap items-center justify-between gap-2 border p-2 ${isSelected ? 'border-primary-teal bg-primary-teal/10' : 'border-border bg-white'}`}><p className="text-xs"><span className="font-semibold">{candidate.name}</span> · #{candidate.food_reference_id} · {Math.round(candidate.score * 100)}% · {candidate.is_verified ? 'verified' : 'unverified'}</p><button type="button" onClick={() => onApproveCandidate(issue, candidate)} className={`border px-2 py-1 text-xs font-bold ${isSelected ? 'border-primary-forest bg-primary-forest text-white' : 'border-primary-forest text-primary-forest hover:bg-primary-forest hover:text-white'}`}>{isSelected ? 'Mapped' : 'Use this mapping'}</button></div>; })}</div></article>)}</div> : <p className="mt-1 text-muted">No unresolved ingredients.</p>}</div>; }
function DuplicateReview({ reviews }: { reviews: MealCatalogImportResponse['review_required'] }) { return <div><p className="font-bold">Near-duplicate reviews <span className="text-muted">({reviews.length})</span></p>{reviews.length ? <ul className="mt-2 space-y-1 text-energy-orange">{reviews.map((review) => <li key={`${review.recipe_key}-${review.matched_catalog_key}`}>• {review.recipe_key} matches {review.matched_catalog_key} ({Math.round(review.ingredient_jaccard * 100)}%)</li>)}</ul> : <p className="mt-1 text-muted">No near-duplicates held for review.</p>}</div>; }
