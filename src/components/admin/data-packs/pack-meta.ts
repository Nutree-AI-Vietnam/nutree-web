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
  food_vi: 'Vietnamese foods',
  food_en: 'English foods',
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

export const KIND_INFO: Record<PackKind, { title: string; description: string; accept: string }> = {
  recipes: {
    title: 'Recipe packs',
    description: 'Discover and swap recipes, one pack per language. Gzip JSON with an items list.',
    accept: '.gz',
  },
  food: {
    title: 'Food packs',
    description: 'Offline food search, one pack per language. Gzip SQLite.',
    accept: '.gz',
  },
  supplements: {
    title: 'Supplements',
    description: 'Search, barcode lookup and the popular list. Gzip SQLite with pack_meta.updated_at.',
    accept: '.gz',
  },
};

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
