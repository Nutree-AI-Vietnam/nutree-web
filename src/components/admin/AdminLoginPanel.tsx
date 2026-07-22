import type { FormEvent } from 'react';

interface AdminLoginPanelProps {
  email: string;
  error: string | null;
  isConfigured: boolean;
  isSigningIn: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  password: string;
}

export function AdminLoginPanel({
  email,
  error,
  isConfigured,
  isSigningIn,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  password,
}: AdminLoginPanelProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="min-h-[calc(100vh-96px)] bg-[#EEF3F0] px-4 py-10 text-foreground">
      <div className="mx-auto max-w-md border border-border bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-primary-emerald">admin.nutreeai.com</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in with the Firebase account that is included in the backend admin allowlist.
        </p>

        {!isConfigured && (
          <div className="mt-4 border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Set NEXT_PUBLIC_FIREBASE_API_KEY before using email/password sign in.
          </div>
        )}

        {error && (
          <div className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-muted">Email</span>
            <input
              autoComplete="email"
              className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
              onChange={(event) => onEmailChange(event.target.value)}
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-muted">Password</span>
            <input
              autoComplete="current-password"
              className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary-teal"
              onChange={(event) => onPasswordChange(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          <button
            className="h-11 border border-primary-forest bg-primary-forest px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-emerald disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!isConfigured || isSigningIn}
            type="submit"
          >
            {isSigningIn ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  );
}
