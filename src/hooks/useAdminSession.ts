'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  MealTrackAdminApiError,
  hasMealTrackApiUrl,
  isMealTrackAdminProxyEnabled,
} from '@/lib/mealtrack-admin-api';
import {
  type AdminAuthSession,
  FirebaseAdminAuthError,
  refreshAdminSession,
  signInAdminWithEmailPassword,
} from '@/lib/firebase-admin-auth';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

// Older builds kept the session here; it is only ever cleared now.
const LEGACY_SESSION_STORAGE_KEY = 'nutree-admin-auth-session';
const ENVIRONMENT_STORAGE_KEY = 'nutree-admin-target-environment';
const ENVIRONMENTS: MealTrackAdminEnvironment[] = ['sit', 'prod'];

// Admin tokens live in memory only, never in web storage: moving between admin
// pages keeps them, while a reload or a new tab signs in again.
const sessions = new Map<MealTrackAdminEnvironment, AdminAuthSession>();

interface Options {
  /** Clears page data after sign-out or a target switch. */
  onReset?: () => void;
  /** Reloads page data after sign-in or a target switch. */
  onReload?: () => void;
}

export type AdminSession = ReturnType<typeof useAdminSession>;

/** Admin sign-in, token refresh and SIT/PROD target, shared by every admin page. */
export function useAdminSession({ onReset, onReload }: Options = {}) {
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
    clearLegacySessions();
    const restoredEnvironment = readStoredEnvironment();
    const restored = readStoredSession(restoredEnvironment);
    if (restored) {
      setSession(restored);
      setLoginEmail(restored.email);
    }
    setEnvironment(restoredEnvironment);
    setIsRestoringSession(false);
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
      onReload?.();
    } catch (requestError) {
      setLoginError(adminErrorMessage(requestError));
    } finally {
      setIsSigningIn(false);
    }
  }, [environment, loginEmail, loginPassword, onReload]);

  const signOut = useCallback(() => {
    sessions.delete(environment);
    setSession(null);
    onReset?.();
  }, [environment, onReset]);

  const changeEnvironment = useCallback((nextEnvironment: MealTrackAdminEnvironment) => {
    // AdminEnvironmentSwitcher asks before PROD, on the page.
    if (nextEnvironment === environment) return;
    sessionStorage.setItem(ENVIRONMENT_STORAGE_KEY, nextEnvironment);
    const restoredSession = readStoredSession(nextEnvironment);
    setEnvironment(nextEnvironment);
    setSession(restoredSession);
    if (restoredSession) {
      setLoginEmail(restoredSession.email);
    }
    setLoginPassword('');
    onReset?.();
    onReload?.();
  }, [environment, onReload, onReset]);

  return {
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
  return sessions.get(environment) ?? null;
}

function storeSession(session: AdminAuthSession, environment: MealTrackAdminEnvironment): void {
  sessions.set(environment, session);
}

function clearLegacySessions(): void {
  try {
    for (const environment of ENVIRONMENTS) {
      sessionStorage.removeItem(`${LEGACY_SESSION_STORAGE_KEY}:${environment}`);
    }
  } catch {
    // Storage blocked: nothing was stored there either.
  }
}

function readStoredEnvironment(): MealTrackAdminEnvironment {
  return sessionStorage.getItem(ENVIRONMENT_STORAGE_KEY) === 'prod' ? 'prod' : 'sit';
}
