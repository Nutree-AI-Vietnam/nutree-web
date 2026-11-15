import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ADMIN_ENVIRONMENT_STORAGE_KEY,
  adminSessionStorageKey,
  clearAdminSession,
  readAdminEnvironment,
  readAdminSession,
  writeAdminEnvironment,
  writeAdminSession,
} from '../src/lib/admin-session-store';
import type { AdminAuthSession } from '../src/lib/firebase-admin-auth';

class MemoryStorage implements Storage {
  private items = new Map<string, string>();

  get length(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
}

function session(email = 'admin@nutreeai.com'): AdminAuthSession {
  return {
    email,
    expiresAt: 1_800_000_000_000,
    idToken: 'id-token',
    refreshToken: 'refresh-token',
    userId: 'user-1',
  };
}

test('a stored admin session is read back for that environment only', () => {
  const storage = new MemoryStorage();
  writeAdminSession('sit', session(), storage);
  writeAdminSession('prod', session('prod@nutreeai.com'), storage);

  assert.deepEqual(readAdminSession('sit', [storage])?.email, 'admin@nutreeai.com');
  assert.deepEqual(readAdminSession('prod', [storage])?.email, 'prod@nutreeai.com');

  clearAdminSession('sit', [storage]);
  assert.equal(readAdminSession('sit', [storage]), null);
  assert.equal(readAdminSession('prod', [storage])?.email, 'prod@nutreeai.com');
});

test('the first storage that has a session wins', () => {
  const older = new MemoryStorage();
  const current = new MemoryStorage();
  writeAdminSession('sit', session('older@nutreeai.com'), older);
  writeAdminSession('sit', session('current@nutreeai.com'), current);

  assert.equal(readAdminSession('sit', [current, older])?.email, 'current@nutreeai.com');
  assert.equal(readAdminSession('sit', [older])?.email, 'older@nutreeai.com');
});

test('corrupt or incomplete session payloads are ignored', () => {
  const storage = new MemoryStorage();
  storage.setItem(adminSessionStorageKey('sit'), '{');
  assert.equal(readAdminSession('sit', [storage]), null);

  storage.setItem(adminSessionStorageKey('sit'), JSON.stringify({ email: 'admin@nutreeai.com' }));
  assert.equal(readAdminSession('sit', [storage]), null);

  storage.setItem(adminSessionStorageKey('sit'), JSON.stringify({ ...session(), email: '' }));
  assert.equal(readAdminSession('sit', [storage]), null);
});

test('environment falls back to SIT unless sit or prod was stored', () => {
  const storage = new MemoryStorage();
  assert.equal(readAdminEnvironment([storage]), 'sit');

  storage.setItem(ADMIN_ENVIRONMENT_STORAGE_KEY, 'staging');
  assert.equal(readAdminEnvironment([storage]), 'sit');

  writeAdminEnvironment('prod', storage);
  assert.equal(readAdminEnvironment([storage]), 'prod');
});

test('a storage that throws does not block the next one', () => {
  const blocked: Storage = {
    get length() {
      return 0;
    },
    clear() {},
    getItem() {
      throw new Error('blocked');
    },
    key() {
      return null;
    },
    removeItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
  };
  const storage = new MemoryStorage();
  writeAdminSession('sit', session(), storage);
  writeAdminEnvironment('prod', storage);

  assert.equal(readAdminSession('sit', [blocked, storage])?.email, 'admin@nutreeai.com');
  assert.equal(readAdminEnvironment([blocked, storage]), 'prod');
  clearAdminSession('sit', [blocked, storage]);
  assert.equal(readAdminSession('sit', [storage]), null);
});
