export type MealCatalogWorkflowStep = {
  detail: string;
  label: string;
  status: 'blocked' | 'complete' | 'current' | 'pending';
};

export function MealCatalogImportProgress({ steps }: { steps: MealCatalogWorkflowStep[] }) {
  return (
    <ol className="grid gap-2 border border-[#E3DDD2] bg-[#FBF9F4] p-3 sm:grid-cols-5" aria-label="Quy trình nhập danh mục">
      {steps.map((step, index) => (
        <li key={step.label} className="flex min-w-0 items-start gap-2">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center text-xs font-medium ${stepStyle(step.status)}`}>
            {step.status === 'complete' ? '✓' : index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#1A2820]">{step.label}</p>
            <p className="mt-0.5 text-xs leading-4 text-[#5C6B62]">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function stepStyle(status: MealCatalogWorkflowStep['status']): string {
  if (status === 'complete') return 'bg-[#1B4336] text-[#F4F1EA]';
  if (status === 'current') return 'bg-[#C4A574] text-[#1A2820]';
  if (status === 'blocked') return 'bg-[#F6E6E3] text-[#8E2F2F]';
  return 'border border-[#D5CFC3] bg-white text-[#6B756F]';
}
