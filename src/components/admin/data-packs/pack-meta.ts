import type { DataPack, DataPackEntry } from '@/types/data-pack-admin';

export type PackKind = 'recipes' | 'food' | 'supplements';

const LABELS: Record<string, string> = {
  recipes_en: 'English · US and other countries',
  recipes_en_AU: 'English · Australia',
  recipes_en_GB: 'English · United Kingdom',
  recipes_en_CA: 'English · Canada',
  recipes_de: 'German',
  recipes_es: 'Spanish',
  recipes_ko: 'Korean',
  recipes_vi: 'Vietnamese',
  food_vi: 'Vietnamese',
  food_en: 'English',
  supplements: 'Supplement catalog',
};

export function packKind(packId: string): PackKind {
  if (packId.startsWith('recipes_')) return 'recipes';
  if (packId.startsWith('food_')) return 'food';
  return 'supplements';
}

export function packLabel(packId: string): string {
  return LABELS[packId] ?? packId;
}

export const KIND_INFO: Record<PackKind, { accept: string; fileHint: string }> = {
  recipes: { accept: '.gz', fileHint: 'A .json.gz recipe file exported from the content tool.' },
  food: { accept: '.gz', fileHint: 'A .sqlite.gz food database file.' },
  supplements: { accept: '.gz', fileHint: 'A .sqlite.gz supplement catalog file.' },
};

/** Every pack of one kind the app reads, in display order. */
export function packIdsOf(kind: PackKind, known: readonly string[]): string[] {
  return known.filter((packId) => packKind(packId) === kind);
}

export type PackStatus = 'live' | 'sit-ahead' | 'sit-only' | 'missing';

export function packStatus(pack: DataPack | undefined, isProd: boolean): PackStatus {
  if (!pack || (!pack.current && !pack.sit)) return 'missing';
  if (!pack.current) return 'sit-only';
  if (isProd && pack.sit && pack.sit.sha256 !== pack.current.sha256) return 'sit-ahead';
  return 'live';
}

const DATE = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE.format(date);
}

export function formatRelative(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days} d ago` : formatDate(value);
}

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function shortHash(entry: DataPackEntry): string {
  return entry.sha256.slice(0, 8);
}

/** Server notes in plain words for the version list. */
export function friendlyNote(note: string): string {
  if (!note) return 'No description';
  if (note === 'adopted from legacy file') return 'Started tracking the content phones already had';
  const promoted = note.match(/^promoted from sit v(\d+)$/);
  if (promoted) return `Released to users (tested as version ${promoted[1]})`;
  const rollback = note.match(/^rollback to v(\d+)$/);
  if (rollback) return `Restored version ${rollback[1]}`;
  if (note.startsWith('edit ')) return 'Edited a recipe';
  if (note.startsWith('delete ')) return 'Removed a recipe';
  return note;
}
