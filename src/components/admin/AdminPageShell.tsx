'use client';

import type { ReactNode } from 'react';
import type { AdminSession } from '@/hooks/useAdminSession';

export type AdminPageHref =
  | '/admin'
  | '/admin/recipes'
  | '/admin/meal-catalog'
  | '/admin/foods'
  | '/admin/supplement-catalog'
  | '/admin/affiliate-invites'
  | '/admin/premium-grant'
  | '/admin/promo-codes';

interface Props {
  admin: AdminSession;
  /** The page's own href, to mark it in the sidebar. */
  current: AdminPageHref;
  title: string;
  description: string;
  /** Tabs or controls under the title. */
  toolbar?: ReactNode;
  /** Buttons at the right of the title. */
  actions?: ReactNode;
  children: ReactNode;
}

/** Page title inside the admin frame. The sidebar lives in the layout and stays put. */
export function AdminPageShell({ title, description, toolbar, actions, children }: Props) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {toolbar && <div className="mb-5 flex flex-wrap gap-2">{toolbar}</div>}
      <div className="grid gap-5">{children}</div>
    </div>
  );
}
