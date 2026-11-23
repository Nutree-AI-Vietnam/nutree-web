'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { AdminEnvironmentSwitcher } from '@/components/admin/AdminEnvironmentSwitcher';
import { AdminLoginPanel } from '@/components/admin/AdminLoginPanel';
import { Icon, type IconName } from '@/components/admin/ui/AdminUi';
import { type AdminPageHref } from '@/components/admin/AdminPageShell';
import { AdminSessionProvider, useAdminSessionState } from '@/hooks/useAdminSession';
import { cn } from '@/lib/cn';
import { hasFirebaseAdminAuthConfig } from '@/lib/firebase-admin-auth';

const NAV: { group: string; pages: { href: AdminPageHref; label: string; icon: IconName }[] }[] = [
  {
    group: 'Tổng quan',
    pages: [{ href: '/admin', label: 'Việc cần làm', icon: 'inbox' }],
  },
  {
    group: 'Công thức',
    pages: [
      { href: '/admin/recipes', label: 'Thư viện công thức', icon: 'catalog' },
      { href: '/admin/meal-catalog', label: 'Danh mục món (đã bỏ)', icon: 'package' },
    ],
  },
  {
    group: 'Thực phẩm',
    pages: [{ href: '/admin/foods', label: 'Cơ sở dữ liệu thực phẩm', icon: 'globe' }],
  },
  {
    group: 'Thực phẩm chức năng',
    pages: [{ href: '/admin/supplement-catalog', label: 'Danh mục TPCN', icon: 'pill' }],
  },
  {
    group: 'Tăng trưởng',
    pages: [
      { href: '/admin/affiliate-invites', label: 'Lời mời cộng tác viên', icon: 'link' },
      { href: '/admin/premium-grant', label: 'Cấp Premium', icon: 'check' },
      { href: '/admin/promo-codes', label: 'Mã khuyến mãi', icon: 'code' },
    ],
  },
];

function isCurrent(pathname: string, href: AdminPageHref): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sidebar and sign-in that stay mounted while the menu changes pages. */
export function AdminFrame({ children }: { children: ReactNode }) {
  const admin = useAdminSessionState();
  const pathname = usePathname() ?? '/admin';
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  if (admin.isRestoringSession) {
    return <div className="min-h-screen bg-[#F4F1EA]" />;
  }

  return (
    <AdminSessionProvider value={admin}>
      {!admin.isPreviewMode && !admin.session ? (
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
      ) : (
        <Frame admin={admin} pathname={pathname} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen}>
          {children}
        </Frame>
      )}
    </AdminSessionProvider>
  );
}

function Frame({
  admin,
  pathname,
  isNavOpen,
  setIsNavOpen,
  children,
}: {
  admin: ReturnType<typeof useAdminSessionState>;
  pathname: string;
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
  children: ReactNode;
}) {
  const isProd = admin.isProxyEnabled && admin.environment === 'prod';
  const targetLabel = admin.isPreviewMode
    ? 'Xem trước — chưa có backend'
    : !admin.isProxyEnabled
      ? 'API trực tiếp'
      : isProd
        ? 'PROD · dữ liệu thật'
        : 'SIT · dữ liệu thử';

  return (
    <div className="min-h-screen touch-manipulation bg-[#F4F1EA] font-body text-[#1A2820] antialiased">
      <div className={cn('w-full', isProd ? 'h-[3px] bg-[#8E2F2F]' : 'h-0.5 bg-[#1B4336]')} />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#12241C] text-[#D7E0D9] transition-transform lg:translate-x-0',
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-end border-b border-white/10 px-5 pb-2">
          <div className="leading-tight">
            <p className="font-body text-[15px] font-semibold tracking-[-0.02em] text-[#F4F1EA]">Nutree</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8AA396]">Quản trị</p>
          </div>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV.map((section) => (
            <div key={section.group}>
              <p className="px-2 text-xs uppercase tracking-[0.16em] text-[#7E9086]">{section.group}</p>
              <ul className="mt-2 space-y-0.5">
                {section.pages.map((page) => {
                  const active = isCurrent(pathname, page.href);
                  return (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        prefetch
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsNavOpen(false)}
                        className={cn(
                          'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[4px] px-2.5 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A574] motion-reduce:transition-none',
                          active ? 'bg-[#1C3329] font-medium text-white shadow-[inset_2px_0_0_#C4A574]' : 'text-[#C5D0C8] hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <Icon name={page.icon} className={cn('h-4 w-4', active ? 'text-[#C4A574]' : 'text-[#7E9086]')} />
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
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#1C3329] text-xs font-medium uppercase text-[#F4F1EA]">
                {admin.session.email.slice(0, 1)}
              </span>
              <p className="min-w-0 flex-1 truncate text-xs text-[#C5D0C8]">{admin.session.email}</p>
              <button
                type="button"
                onClick={admin.signOut}
                title="Đăng xuất"
                aria-label="Đăng xuất"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[4px] text-[#8AA396] hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A574]"
              >
                <Icon name="logout" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
      {isNavOpen && (
        <button type="button" aria-label="Đóng menu" className="fixed inset-0 z-30 bg-[#12241C]/40 lg:hidden" onClick={() => setIsNavOpen(false)} />
      )}
      <div className="lg:pl-60">
        <div className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[#E3DDD2] bg-[#F4F1EA] px-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Mở menu"
              onClick={() => setIsNavOpen(true)}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-[#3E4A43] hover:bg-[#E7E1D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336] lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <span className={cn('truncate text-[12px] font-medium tracking-[0.04em]', isProd ? 'text-[#8E2F2F]' : 'text-[#1B4336]')}>
              {targetLabel}
            </span>
          </div>
          <AdminEnvironmentSwitcher environment={admin.environment} isProxyEnabled={admin.isProxyEnabled} onChange={admin.changeEnvironment} />
        </div>
        {children}
      </div>
    </div>
  );
}
