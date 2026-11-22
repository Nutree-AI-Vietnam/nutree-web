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
    <section className="flex min-h-screen items-center justify-center bg-[#12241C] px-4 py-10 font-body text-[#1A2820] antialiased">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="font-body text-[22px] font-medium tracking-[-0.03em] text-[#F4F1EA]">Nutree</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#8AA396]">Quản trị</p>
        </div>
        <div className="border border-[#E3DDD2] bg-[#FBF9F4] p-6">
          <h1 className="text-lg font-medium text-[#1A2820]">Đăng nhập</h1>
          <p className="mt-1 text-sm leading-relaxed text-[#5C6B62]">Dùng tài khoản Firebase có trong danh sách admin của backend.</p>
          <div className="mt-4 flex items-center justify-between border border-[#E3DDD2] px-3 py-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B756F]">Môi trường</span>
            <AdminEnvironmentSwitcher environment={environment} isProxyEnabled={isProxyEnabled} onChange={onEnvironmentChange} />
          </div>

          {!isConfigured && (
            <p className="mt-4 border-l-[3px] border-[#8A6A1F] py-1 pl-3 text-sm text-[#6B4E12]">
              Cần cấu hình {environment.toUpperCase()} Firebase web API key trước khi đăng nhập.
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 border-l-[3px] border-[#8E2F2F] py-1 pl-3 text-sm text-[#8E2F2F]">
              {error}
            </p>
          )}

          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B756F]">Email</span>
              <input
                autoComplete="email"
                className="h-10 w-full rounded-[4px] border border-[#D5CFC3] bg-white px-3 text-sm text-[#1A2820] outline-none focus:border-[#1B4336] focus:ring-1 focus:ring-[#1B4336]/25"
                onChange={(event) => onEmailChange(event.target.value)}
                type="email"
                value={email}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B756F]">Mật khẩu</span>
              <input
                autoComplete="current-password"
                className="h-10 w-full rounded-[4px] border border-[#D5CFC3] bg-white px-3 text-sm text-[#1A2820] outline-none focus:border-[#1B4336] focus:ring-1 focus:ring-[#1B4336]/25"
                onChange={(event) => onPasswordChange(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            <button
              className="h-10 bg-[#1B4336] px-4 text-sm font-medium text-[#F4F1EA] transition-colors hover:bg-[#14352B] disabled:cursor-not-allowed disabled:bg-[#C9C3B6]"
              disabled={!isConfigured || isSigningIn}
              type="submit"
            >
              {isSigningIn ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-[12px] text-[#8AA396]">admin.nutreeai.com · chỉ dành cho nhân viên</p>
      </div>
    </section>
  );
}
