import type { FormEvent } from 'react';
import { AdminEnvironmentSwitcher } from '@/components/admin/AdminEnvironmentSwitcher';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

interface AdminLoginPanelProps {
  email: string;
  environment: MealTrackAdminEnvironment;
  error: string | null;
  isConfigured: boolean;
  isProxyEnabled: boolean;
  isSigningIn: boolean;
  onEmailChange: (value: string) => void;
  onEnvironmentChange: (environment: MealTrackAdminEnvironment) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  password: string;
}

export function AdminLoginPanel({
  email,
  environment,
  error,
  isConfigured,
  isProxyEnabled,
  isSigningIn,
  onEmailChange,
  onEnvironmentChange,
  onPasswordChange,
  onSubmit,
  password,
}: AdminLoginPanelProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-10 font-sans antialiased">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-base font-bold text-slate-900">N</span>
          <span className="text-lg font-semibold text-white">Nutree Admin</span>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-2xl">
          <h1 className="text-lg font-semibold text-slate-900">Đăng nhập</h1>
          <p className="mt-1 text-sm text-slate-500">Dùng tài khoản Firebase có trong danh sách admin của backend.</p>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span className="text-xs font-medium text-slate-500">Môi trường</span>
            <AdminEnvironmentSwitcher environment={environment} isProxyEnabled={isProxyEnabled} onChange={onEnvironmentChange} />
          </div>

          {!isConfigured && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-inset ring-amber-200">
              Cần cấu hình {environment.toUpperCase()} Firebase web API key trước khi đăng nhập.
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-inset ring-rose-200">
              {error}
            </p>
          )}

          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Email</span>
              <input
                autoComplete="email"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                onChange={(event) => onEmailChange(event.target.value)}
                type="email"
                value={email}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Mật khẩu</span>
              <input
                autoComplete="current-password"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                onChange={(event) => onPasswordChange(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            <button
              className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!isConfigured || isSigningIn}
              type="submit"
            >
              {isSigningIn ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">admin.nutreeai.com · chỉ dành cho nhân viên</p>
      </div>
    </section>
  );
}
