'use client';

import { useState } from 'react';
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
    return <div className="border border-energy-orange/50 bg-energy-orange-soft px-3 py-2 text-xs font-bold text-energy-orange">Direct API mode — environment switch disabled</div>;
  }

  if (isConfirmingProd && environment !== 'prod') {
    return (
      <div role="alertdialog" aria-label="Switch to PROD" className="flex flex-wrap items-center gap-1 border border-red-300 bg-red-50 p-1">
        <span className="px-2 text-xs font-bold text-red-800">Switch to PROD (live data)?</span>
        <button
          type="button"
          autoFocus
          onClick={() => {
            setIsConfirmingProd(false);
            onChange('prod');
          }}
          className="min-h-9 bg-red-700 px-3 text-xs font-bold text-white transition-colors hover:bg-red-800"
        >
          Switch
        </button>
        <button
          type="button"
          onClick={() => setIsConfirmingProd(false)}
          className="min-h-9 px-3 text-xs font-bold text-red-800 transition-colors hover:bg-red-100"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 border p-1 ${environment === 'prod' ? 'border-red-300 bg-red-50' : 'border-primary-teal/30 bg-primary-teal/10'}`}>
      <span className={`px-2 text-xs font-bold uppercase ${environment === 'prod' ? 'text-red-800' : 'text-primary-forest'}`}>Target</span>
      <TargetButton active={environment === 'sit'} label="SIT" onClick={() => onChange('sit')} />
      <TargetButton
        active={environment === 'prod'}
        danger
        label="PROD"
        onClick={() => {
          if (environment !== 'prod') setIsConfirmingProd(true);
        }}
      />
    </div>
  );
}

function TargetButton({ active, danger = false, label, onClick }: { active: boolean; danger?: boolean; label: string; onClick: () => void }) {
  const activeStyle = danger ? 'bg-red-700 text-white' : 'bg-primary-forest text-white';
  const inactiveStyle = danger ? 'text-red-800 hover:bg-red-100' : 'text-primary-forest hover:bg-white';
  return <button type="button" onClick={onClick} className={`min-h-9 px-3 text-xs font-bold transition-colors ${active ? activeStyle : inactiveStyle}`}>{label}</button>;
}
