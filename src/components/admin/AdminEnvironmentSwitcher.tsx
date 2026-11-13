'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

interface Props {
  environment: MealTrackAdminEnvironment;
  isProxyEnabled: boolean;
  onChange: (environment: MealTrackAdminEnvironment) => void;
}

/**
 * SIT/PROD target. PROD asks first, on the page: a browser dialog is
 * answered "Cancel" at once by embedded browsers that block dialogs.
 */
export function AdminEnvironmentSwitcher({ environment, isProxyEnabled, onChange }: Props) {
  const [isConfirmingProd, setIsConfirmingProd] = useState(false);

  if (!isProxyEnabled) {
    return <span className="text-xs text-slate-400">Target switch needs the admin proxy</span>;
  }

  if (isConfirmingProd && environment !== 'prod') {
    return (
      <div role="alertdialog" aria-label="Switch to PROD" className="flex items-center gap-2 rounded-lg bg-rose-50 py-1 pl-3 pr-1 ring-1 ring-rose-200">
        <span className="text-xs font-medium text-rose-800">Switch to PROD (live data)?</span>
        <button
          type="button"
          autoFocus
          onClick={() => {
            setIsConfirmingProd(false);
            onChange('prod');
          }}
          className="h-7 rounded-md bg-rose-600 px-3 text-xs font-medium text-white hover:bg-rose-700"
        >
          Switch
        </button>
        <button
          type="button"
          onClick={() => setIsConfirmingProd(false)}
          className="h-7 rounded-md px-2 text-xs font-medium text-rose-800 hover:bg-rose-100"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5" role="group" aria-label="Target environment">
      <Segment active={environment === 'sit'} onClick={() => onChange('sit')} tone="sit">
        SIT
      </Segment>
      <Segment
        active={environment === 'prod'}
        onClick={() => {
          if (environment !== 'prod') setIsConfirmingProd(true);
        }}
        tone="prod"
      >
        PROD
      </Segment>
    </div>
  );
}

function Segment({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: 'sit' | 'prod';
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-7 rounded-md px-3 text-xs font-semibold transition-colors',
        active
          ? tone === 'prod'
            ? 'bg-rose-600 text-white shadow-sm'
            : 'bg-white text-sky-700 shadow-sm'
          : 'text-slate-500 hover:text-slate-800'
      )}
    >
      {children}
    </button>
  );
}
