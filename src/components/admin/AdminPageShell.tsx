'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { AdminEnvironmentSwitcher } from '@/components/admin/AdminEnvironmentSwitcher';
import { AdminLoginPanel } from '@/components/admin/AdminLoginPanel';
import { Icon, type IconName } from '@/components/admin/ui/AdminUi';
import { cn } from '@/lib/cn';
import { hasFirebaseAdminAuthConfig } from '@/lib/firebase-admin-auth';
import type { AdminSession } from '@/hooks/useAdminSession';

const NAV: { group: string; pages: { href: AdminPageHref; label: string; icon: IconName }[] }[] = [
  {
    group: 'Recipes',
    pages: [
      { href: '/admin/recipes', label: 'Recipe library', icon: 'catalog' },
      { href: '/admin/meal-catalog', label: 'Meal catalog', icon: 'package' },
    ],
  },
  {
    group: 'Foods',
    pages: [{ href: '/admin/foods', label: 'Food database', icon: 'globe' }],
  },
  {
    group: 'Supplements',
    pages: [
      { href: '/admin/supplements', label: 'Review queue', icon: 'check' },
      { href: '/admin/supplement-catalog', label: 'Supplement catalog', icon: 'pill' },
    ],
  },
  {
    group: 'Growth',
    pages: [{ href: '/admin/affiliate-invites', label: 'Affiliate invites', icon: 'link' }],
  },
];

export type AdminPageHref =
  | '/admin/recipes'
  | '/admin/meal-catalog'
  | '/admin/foods'
  | '/admin/supplements'
  | '/admin/supplement-catalog'
  | '/admin/affiliate-invites';

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

/** Sign-in gate and the admin console frame: sidebar, target bar, page header. */
export function AdminPageShell({ admin, current, title, description, toolbar, actions, children }: Props) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  if (admin.isRestoringSession) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!admin.isPreviewMode && !admin.session) {
    return (
      <AdminLoginPanel
        email={admin.loginEmail}
        environment={admin.environment}
        error={admin.loginError}
        isConfigured={hasFirebaseAdminAuthConfig(admin.environment)}
        isProxyEnabled={admin.isProxyEnabled}
        isSigningIn={admin.isSigningIn}
        onEmailChange={admin.setLoginEmail}
        onEnvironmentChange={admin.changeEnvironment}
        onPasswordChange={admin.setLoginPassword}
        onSubmit={admin.signIn}
        password={admin.loginPassword}
      />
    );
  }

  const isProd = admin.isProxyEnabled && admin.environment === 'prod';
  const targetLabel = admin.isPreviewMode
    ? 'Preview — no backend'
    : !admin.isProxyEnabled
      ? 'Direct API'
      : isProd
        ? 'PROD · live data'
        : 'SIT · test data';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <div className={cn('h-1 w-full', isProd ? 'bg-rose-600' : 'bg-sky-500')} />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-slate-900 text-slate-300 transition-transform lg:translate-x-0',
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-slate-900">N</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Nutree Admin</p>
            <p className="text-[11px] text-slate-400">Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV.map((section) => (
            <div key={section.group}>
              <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">{section.group}</p>
              <ul className="mt-2 space-y-0.5">
                {section.pages.map((page) => {
                  const active = page.href === current;
                  return (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsNavOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                          active ? 'bg-white/10 font-medium text-white' : 'hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <Icon name={page.icon} className={cn('h-4 w-4', active ? 'text-emerald-400' : 'text-slate-500')} />
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        {!admin.isPreviewMode && admin.session && (
          <div className="border-t border-white/5 p-3">
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold uppercase text-white">
                {admin.session.email.slice(0, 1)}
              </span>
              <p className="min-w-0 flex-1 truncate text-xs text-slate-300">{admin.session.email}</p>
              <button
                type="button"
                onClick={admin.signOut}
                title="Sign out"
                aria-label="Sign out"
                className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
      {isNavOpen && (
        <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setIsNavOpen(false)} />
      )}

      <div className="lg:pl-60">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsNavOpen(true)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                isProd ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', isProd ? 'bg-rose-500' : 'bg-sky-500')} />
              {targetLabel}
            </span>
          </div>
          <AdminEnvironmentSwitcher environment={admin.environment} isProxyEnabled={admin.isProxyEnabled} onChange={admin.changeEnvironment} />
        </div>

        <main className="mx-auto max-w-[1280px] px-4 py-6 md:px-8 md:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {toolbar && <div className="mb-5 flex flex-wrap gap-2">{toolbar}</div>}
          <div className="grid gap-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
