import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

const LEGACY_FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_API_KEYS: Record<MealTrackAdminEnvironment, string | undefined> = {
  sit: process.env.NEXT_PUBLIC_FIREBASE_SIT_API_KEY || LEGACY_FIREBASE_API_KEY,
  prod: process.env.NEXT_PUBLIC_FIREBASE_PROD_API_KEY || LEGACY_FIREBASE_API_KEY,
};

interface FirebaseAuthResponse {
  email: string;
  expiresIn: string;
  idToken: string;
  localId: string;
  refreshToken: string;
}

interface FirebaseRefreshResponse {
  access_token: string;
  expires_in: string;
  id_token: string;
  refresh_token: string;
  user_id: string;
}

export interface AdminAuthSession {
  email: string;
  expiresAt: number;
  idToken: string;
  refreshToken: string;
  userId: string;
}

export class FirebaseAdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseAdminAuthError';
  }
}

export function hasFirebaseAdminAuthConfig(environment: MealTrackAdminEnvironment): boolean {
  return Boolean(firebaseApiKeyForEnvironment(environment));
}

export async function signInAdminWithEmailPassword(
  email: string,
  password: string,
  environment: MealTrackAdminEnvironment
): Promise<AdminAuthSession> {
  const firebaseApiKey = firebaseApiKeyForEnvironment(environment);
  if (!firebaseApiKey) {
    throw new FirebaseAdminAuthError(firebaseConfigError(environment));
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const payload = (await response.json()) as FirebaseAuthResponse | FirebaseErrorResponse;
  if (!response.ok || !('idToken' in payload)) {
    throw new FirebaseAdminAuthError(toFirebaseErrorMessage(payload as FirebaseErrorResponse));
  }

  return {
    email: payload.email,
    expiresAt: toExpiresAt(payload.expiresIn),
    idToken: payload.idToken,
    refreshToken: payload.refreshToken,
    userId: payload.localId,
  };
}

export async function refreshAdminSession(
  refreshToken: string,
  environment: MealTrackAdminEnvironment
): Promise<AdminAuthSession> {
  const firebaseApiKey = firebaseApiKeyForEnvironment(environment);
  if (!firebaseApiKey) {
    throw new FirebaseAdminAuthError(firebaseConfigError(environment));
  }

  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    }
  );

  const payload = (await response.json()) as FirebaseRefreshResponse | FirebaseErrorResponse;
  if (!response.ok || !('id_token' in payload)) {
    throw new FirebaseAdminAuthError(toFirebaseErrorMessage(payload as FirebaseErrorResponse));
  }

  return {
    email: '',
    expiresAt: toExpiresAt(payload.expires_in),
    idToken: payload.id_token,
    refreshToken: payload.refresh_token,
    userId: payload.user_id,
  };
}

interface FirebaseErrorResponse {
  error?: {
    message?: string;
  };
}

function toExpiresAt(expiresIn: string): number {
  return Date.now() + Number(expiresIn) * 1000;
}

function firebaseApiKeyForEnvironment(environment: MealTrackAdminEnvironment): string | undefined {
  return FIREBASE_API_KEYS[environment];
}

function firebaseConfigError(environment: MealTrackAdminEnvironment): string {
  const specificEnvVar =
    environment === 'prod'
      ? 'NEXT_PUBLIC_FIREBASE_PROD_API_KEY'
      : 'NEXT_PUBLIC_FIREBASE_SIT_API_KEY';
  return `Set ${specificEnvVar} or NEXT_PUBLIC_FIREBASE_API_KEY to enable ${environment.toUpperCase()} admin login.`;
}

function toFirebaseErrorMessage(payload: FirebaseErrorResponse): string {
  const code = payload.error?.message || 'Firebase sign-in failed.';
  if (code === 'EMAIL_NOT_FOUND' || code === 'INVALID_PASSWORD' || code === 'INVALID_LOGIN_CREDENTIALS') {
    return 'Email or password is incorrect.';
  }
  if (code === 'USER_DISABLED') {
    return 'This Firebase user is disabled.';
  }
  return code.replaceAll('_', ' ').toLowerCase();
}
