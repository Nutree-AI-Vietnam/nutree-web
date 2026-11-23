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
    return <span className="hidden text-xs text-[#53635B] sm:inline">Cần bật admin proxy để đổi môi trường</span>;
  }

  if (isConfirmingProd && environment !== 'prod') {
    return (
      <div role="alertdialog" aria-label="Chuyển sang PROD" className="flex items-center gap-2 border border-[#E4C8C4] bg-[#FBF9F4] py-1 pl-3 pr-1">
        <span className="text-xs font-medium text-[#8E2F2F]">Chuyển sang PROD (dữ liệu thật)?</span>
        <button
          type="button"
          autoFocus
          onClick={() => {
            setIsConfirmingProd(false);
            onChange('prod');
          }}
          className="h-11 cursor-pointer bg-[#8E2F2F] px-3 text-sm font-medium text-[#F4F1EA] hover:bg-[#742626] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336]"
        >
          Chuyển
        </button>
        <button
          type="button"
          onClick={() => setIsConfirmingProd(false)}
          className="h-11 cursor-pointer px-3 text-sm font-medium text-[#8E2F2F] hover:bg-[#F8EBE8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336]"
        >
          Huỷ
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex border border-[#D5CFC3] bg-[#FBF9F4] p-0.5" role="group" aria-label="Môi trường">
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
        'h-11 cursor-pointer px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336] motion-reduce:transition-none',
        active
          ? tone === 'prod'
            ? 'bg-[#8E2F2F] text-[#F4F1EA]'
            : 'bg-[#1B4336] text-[#F4F1EA]'
          : 'text-[#53635B] hover:text-[#1A2820]'
      )}
    >
      {children}
    </button>
  );
}
