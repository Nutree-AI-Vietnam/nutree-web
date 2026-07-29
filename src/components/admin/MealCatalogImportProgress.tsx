export type MealCatalogWorkflowStep = {
  detail: string;
  label: string;
  status: 'blocked' | 'complete' | 'current' | 'pending';
};

export function MealCatalogImportProgress({ steps }: { steps: MealCatalogWorkflowStep[] }) {
  return (
    <ol className="grid gap-2 border-y border-border bg-[#F7FAF8] p-3 sm:grid-cols-5" aria-label="Catalog import workflow">
      {steps.map((step, index) => (
        <li key={step.label} className="flex min-w-0 items-start gap-2">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stepStyle(step.status)}`}>
            {step.status === 'complete' ? '✓' : index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground">{step.label}</p>
            <p className="mt-0.5 text-xs leading-4 text-muted">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function stepStyle(status: MealCatalogWorkflowStep['status']): string {
  if (status === 'complete') return 'bg-primary-forest text-white';
  if (status === 'current') return 'bg-primary-teal text-white';
  if (status === 'blocked') return 'bg-red-100 text-red-800';
  return 'border border-border bg-white text-muted';
}
