import type { AdminAuthSession } from '@/lib/firebase-admin-auth';
import type { MealTrackAdminEnvironment } from '@/types/meal-catalog';

export const ADMIN_SESSION_STORAGE_KEY = 'nutree-admin-auth-session';
export const ADMIN_ENVIRONMENT_STORAGE_KEY = 'nutree-admin-target-environment';

export function adminSessionStorageKey(environment: MealTrackAdminEnvironment): string {
  return `${ADMIN_SESSION_STORAGE_KEY}:${environment}`;
}

export function readAdminSession(
  environment: MealTrackAdminEnvironment,
  storages: readonly Storage[]
): AdminAuthSession | null {
  const key = adminSessionStorageKey(environment);
  for (const storage of storages) {
    const session = parseSession(readItem(storage, key));
    if (session) return session;
  }
  return null;
}

export function writeAdminSession(
  environment: MealTrackAdminEnvironment,
  session: AdminAuthSession,
  storage: Storage
): void {
  writeItem(storage, adminSessionStorageKey(environment), JSON.stringify(session));
}

export function clearAdminSession(environment: MealTrackAdminEnvironment, storages: readonly Storage[]): void {
  const key = adminSessionStorageKey(environment);
  for (const storage of storages) {
    removeItem(storage, key);
  }
}

export function readAdminEnvironment(storages: readonly Storage[]): MealTrackAdminEnvironment {
  for (const storage of storages) {
    const value = readItem(storage, ADMIN_ENVIRONMENT_STORAGE_KEY);
    if (value === 'prod' || value === 'sit') return value;
  }
  return 'sit';
}

export function writeAdminEnvironment(environment: MealTrackAdminEnvironment, storage: Storage): void {
  writeItem(storage, ADMIN_ENVIRONMENT_STORAGE_KEY, environment);
}

function parseSession(raw: string | null): AdminAuthSession | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<AdminAuthSession>;
    if (
      typeof value.email !== 'string' ||
      value.email.length === 0 ||
      typeof value.expiresAt !== 'number' ||
      !Number.isFinite(value.expiresAt) ||
      typeof value.idToken !== 'string' ||
      value.idToken.length === 0 ||
      typeof value.refreshToken !== 'string' ||
      value.refreshToken.length === 0 ||
      typeof value.userId !== 'string' ||
      value.userId.length === 0
    ) {
      return null;
    }
    return {
      email: value.email,
      expiresAt: value.expiresAt,
      idToken: value.idToken,
      refreshToken: value.refreshToken,
      userId: value.userId,
    };
  } catch {
    return null;
  }
}

function readItem(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // Storage can be blocked; the in-memory session still covers this tab.
  }
}

function removeItem(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // Nothing left to clear when storage is blocked.
  }
}
