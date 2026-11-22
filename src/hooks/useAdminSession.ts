'use client';

import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  MealTrackAdminApiError,
  hasMealTrackApiUrl,
  isMealTrackAdminProxyEnabled,
} from '@/lib/mealtrack-admin-api';
import {
  clearAdminSession,
  readAdminEnvironment,
  readAdminSession,
  writeAdminEnvironment,
  writeAdminSession,
} from '@/lib/admin-session-store';
import {
  type AdminAuthSession,
  FirebaseAdminAuthError,
  refreshAdminSession,
  signInAdminWithEmailPassword,
} from '@/lib/firebase-admin-auth';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

// Same-tab navigation reads this first. localStorage is the copy that survives
// a reload, a new tab, and reopening the browser until the user signs out.
const sessions = new Map<MealTrackAdminEnvironment, AdminAuthSession>();

interface Options {
  /** Clears page data after sign-out or a target switch. */
  onReset?: () => void;
  /** Reloads page data after sign-in or a target switch. */
  onReload?: () => void;
}

export type AdminSession = {
  session: AdminAuthSession | null;
  environment: MealTrackAdminEnvironment;
  isPreviewMode: boolean;
  isProxyEnabled: boolean;
  isRestoringSession: boolean;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  loginError: string | null;
  isSigningIn: boolean;
  getValidToken: () => Promise<string>;
  signIn: () => Promise<void>;
  signOut: () => void;
  changeEnvironment: (environment: MealTrackAdminEnvironment) => void;
};

type AdminSessionContextValue = AdminSession & {
  subscribe: (listener: Options) => () => void;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

/**
 * The one session for the admin layout. Pages read it through `useAdminSession`
 * so a menu click does not rebuild the sign-in or the sidebar.
 */
export function useAdminSessionState(): AdminSessionContextValue {
  const listeners = useRef(new Set<Options>());
  const subscribe = useCallback((listener: Options) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);
  const emit = useCallback((kind: 'reset' | 'reload') => {
    for (const listener of listeners.current) {
      if (kind === 'reset') listener.onReset?.();
      else listener.onReload?.();
    }
  }, []);
  const [session, setSession] = useState<AdminAuthSession | null>(null);
  const [environment, setEnvironment] = useState<MealTrackAdminEnvironment>('sit');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const isPreviewMode = !hasMealTrackApiUrl();
  const isProxyEnabled = isMealTrackAdminProxyEnabled();

  useEffect(() => {
    let cancelled = false;
    const restoredEnvironment = readStoredEnvironment();
    storeEnvironment(restoredEnvironment);
    setEnvironment(restoredEnvironment);

    const restored = readStoredSession(restoredEnvironment);
    if (!restored) {
      setIsRestoringSession(false);
      return;
    }

    if (Date.now() < restored.expiresAt - 60_000) {
      setSession(restored);
      setLoginEmail(restored.email);
      setIsRestoringSession(false);
      return;
    }

    refreshAdminSession(restored.refreshToken, restoredEnvironment)
      .then((refreshed) => {
        if (cancelled) return;
        const nextSession = { ...refreshed, email: restored.email || refreshed.email };
        storeSession(nextSession, restoredEnvironment);
        setSession(nextSession);
        setLoginEmail(nextSession.email);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof FirebaseAdminAuthError) {
          forgetSession(restoredEnvironment);
          setLoginEmail(restored.email);
          setLoginError('Phiên đăng nhập đã hết. Đăng nhập lại.');
          return;
        }
        setSession(restored);
        setLoginEmail(restored.email);
      })
      .finally(() => {
        if (!cancelled) setIsRestoringSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const getValidToken = useCallback(async (): Promise<string> => {
    if (!session) {
      throw new MealTrackAdminApiError('Sign in before calling MealTrack admin endpoints.', 401);
    }
    if (Date.now() < session.expiresAt - 60_000) {
      return session.idToken;
    }

    const refreshed = await refreshAdminSession(session.refreshToken, environment);
    const nextSession = {
      ...refreshed,
      email: session.email,
    };
    storeSession(nextSession, environment);
    setSession(nextSession);
    return nextSession.idToken;
  }, [environment, session]);

  const signIn = useCallback(async () => {
    setIsSigningIn(true);
    setLoginError(null);
    try {
      const nextSession = await signInAdminWithEmailPassword(
        loginEmail.trim(),
        loginPassword,
        environment
      );
      storeSession(nextSession, environment);
      setSession(nextSession);
      setLoginPassword('');
      emit('reload');
    } catch (requestError) {
      setLoginError(adminErrorMessage(requestError));
    } finally {
      setIsSigningIn(false);
    }
  }, [emit, environment, loginEmail, loginPassword]);

  const signOut = useCallback(() => {
    forgetSession(environment);
    setSession(null);
    emit('reset');
  }, [emit, environment]);

  const changeEnvironment = useCallback((nextEnvironment: MealTrackAdminEnvironment) => {
    // AdminEnvironmentSwitcher asks before PROD, on the page.
    if (nextEnvironment === environment) return;
    storeEnvironment(nextEnvironment);
    const restoredSession = readStoredSession(nextEnvironment);
    setEnvironment(nextEnvironment);
    setSession(restoredSession);
    if (restoredSession) {
      setLoginEmail(restoredSession.email);
    }
    setLoginPassword('');
    emit('reset');
    emit('reload');
  }, [emit, environment]);

  return {
    subscribe,
    session,
    environment,
    isPreviewMode,
    isProxyEnabled,
    isRestoringSession,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    isSigningIn,
    getValidToken,
    signIn,
    signOut,
    changeEnvironment,
  };
}

/** The layout's session, plus this page's reset and reload when the target changes. */
export function useAdminSession({ onReset, onReload }: Options = {}): AdminSession {
  const value = useContext(AdminSessionContext);
  if (!value) {
    throw new Error('useAdminSession must be used inside the admin layout.');
  }
  const { subscribe, ...admin } = value;
  useEffect(() => subscribe({ onReset, onReload }), [subscribe, onReset, onReload]);
  return admin;
}

export function AdminSessionProvider({
  value,
  children,
}: {
  value: AdminSessionContextValue;
  children: ReactNode;
}) {
  return createElement(AdminSessionContext.Provider, { value }, children);
}

export function adminErrorMessage(error: unknown): string {
  if (error instanceof MealTrackAdminApiError || error instanceof FirebaseAdminAuthError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected admin catalog error.';
}

function readStoredSession(environment: MealTrackAdminEnvironment): AdminAuthSession | null {
  const cached = sessions.get(environment);
  if (cached) return cached;
  const storages = browserStorages();
  const stored = readAdminSession(environment, storages);
  if (!stored) return null;
  sessions.set(environment, stored);
  const [primary] = storages;
  if (primary) writeAdminSession(environment, stored, primary);
  return stored;
}

function storeSession(session: AdminAuthSession, environment: MealTrackAdminEnvironment): void {
  sessions.set(environment, session);
  const [primary] = browserStorages();
  if (primary) writeAdminSession(environment, session, primary);
}

function forgetSession(environment: MealTrackAdminEnvironment): void {
  sessions.delete(environment);
  clearAdminSession(environment, browserStorages());
}

function readStoredEnvironment(): MealTrackAdminEnvironment {
  return readAdminEnvironment(browserStorages());
}

function storeEnvironment(environment: MealTrackAdminEnvironment): void {
  const [primary] = browserStorages();
  if (primary) writeAdminEnvironment(environment, primary);
}

function browserStorages(): Storage[] {
  if (typeof window === 'undefined') return [];
  return [window.localStorage, window.sessionStorage].filter(isUsableStorage);
}

function isUsableStorage(storage: Storage): boolean {
  try {
    const key = '__nutree_admin_storage__';
    storage.setItem(key, '1');
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
