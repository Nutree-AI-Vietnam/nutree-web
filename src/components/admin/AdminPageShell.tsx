import Link from 'next/link';
import type { ReactNode } from 'react';
import { AdminEnvironmentSwitcher } from '@/components/admin/AdminEnvironmentSwitcher';
import { AdminLoginPanel } from '@/components/admin/AdminLoginPanel';
import { hasFirebaseAdminAuthConfig } from '@/lib/firebase-admin-auth';
import type { AdminSession } from '@/hooks/useAdminSession';

const PAGES = [
  { href: '/admin/meal-catalog', label: 'Meal catalog' },
  { href: '/admin/supplements', label: 'Supplements' },
] as const;

interface Props {
  admin: AdminSession;
  /** The page's own href, to mark it in the page links. */
  current: (typeof PAGES)[number]['href'];
  title: string;
  description: string;
  /** Tabs or controls under the title. */
  toolbar?: ReactNode;
  children: ReactNode;
}

/** Sign-in gate, header and page links shared by the admin pages. */
export function AdminPageShell({ admin, current, title, description, toolbar, children }: Props) {
  if (admin.isRestoringSession) {
    return <div className="min-h-screen bg-[#EEF3F0]" />;
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

  return (
    <div className="min-h-screen bg-[#EEF3F0] text-foreground">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <nav className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase">
              <span className="text-primary-emerald">admin.nutreeai.com</span>
              {PAGES.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  aria-current={page.href === current ? 'page' : undefined}
                  className={page.href === current ? 'text-primary-forest' : 'text-muted hover:text-primary-forest'}
                >
                  {page.label}
                </Link>
              ))}
            </nav>
            <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminEnvironmentSwitcher environment={admin.environment} isProxyEnabled={admin.isProxyEnabled} onChange={admin.changeEnvironment} />
            {!admin.isPreviewMode && admin.session && (
              <div className="border border-border bg-background px-3 py-2 text-xs font-semibold text-muted">
                {admin.session.email}
              </div>
            )}
            {!admin.isPreviewMode && (
              <button
                className="border border-border bg-white px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-primary-teal hover:text-primary-forest"
                onClick={admin.signOut}
                type="button"
              >
                Sign out
              </button>
            )}
            <div className="border border-border bg-background px-3 py-2 text-xs font-semibold text-muted">
              {admin.isPreviewMode
                ? 'Contract preview'
                : !admin.isProxyEnabled
                  ? 'Direct API target'
                  : admin.environment === 'prod'
                    ? 'PROD — live data'
                    : 'SIT — test data'}
            </div>
          </div>
        </div>
        {toolbar && <div className="mx-auto flex max-w-[1440px] flex-wrap gap-1 px-4 pb-4 md:px-6">{toolbar}</div>}
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-4 px-4 py-5 md:px-6">{children}</main>
    </div>
  );
}
