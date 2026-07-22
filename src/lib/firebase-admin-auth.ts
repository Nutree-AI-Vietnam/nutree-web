const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

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

export function hasFirebaseAdminAuthConfig(): boolean {
  return Boolean(FIREBASE_API_KEY);
}

export async function signInAdminWithEmailPassword(
  email: string,
  password: string
): Promise<AdminAuthSession> {
  if (!FIREBASE_API_KEY) {
    throw new FirebaseAdminAuthError('Set NEXT_PUBLIC_FIREBASE_API_KEY to enable admin login.');
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
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

export async function refreshAdminSession(refreshToken: string): Promise<AdminAuthSession> {
  if (!FIREBASE_API_KEY) {
    throw new FirebaseAdminAuthError('Set NEXT_PUBLIC_FIREBASE_API_KEY to enable admin login.');
  }

  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
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
