import type { DataPack, DataPackEntry } from '@/types/data-pack-admin';

export type PackKind = 'recipes' | 'food' | 'supplements';

const LABELS: Record<string, string> = {
  recipes_en: 'Tiếng Anh · Mỹ và các nước khác',
  recipes_en_AU: 'Tiếng Anh · Úc',
  recipes_en_GB: 'Tiếng Anh · Anh',
  recipes_en_CA: 'Tiếng Anh · Canada',
  recipes_de: 'Tiếng Đức',
  recipes_es: 'Tiếng Tây Ban Nha',
  recipes_ko: 'Tiếng Hàn',
  recipes_vi: 'Tiếng Việt',
  food_vi: 'Tiếng Việt',
  food_en: 'Tiếng Anh',
  supplements: 'Danh mục TPCN',
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
  recipes: { accept: '.gz', fileHint: 'File công thức .sqlite.gz hoặc .json.gz.' },
  food: { accept: '.gz', fileHint: 'File cơ sở dữ liệu thực phẩm .sqlite.gz.' },
  supplements: { accept: '.gz', fileHint: 'File danh mục TPCN .sqlite.gz.' },
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

const DATE = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE.format(date);
}

export function formatRelative(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${days} ngày trước` : formatDate(value);
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
  if (!note) return 'Không có mô tả';
  if (note === 'adopted from legacy file') return 'Bắt đầu theo dõi nội dung điện thoại đang dùng';
  const promoted = note.match(/^promoted from sit v(\d+)$/);
  if (promoted) return `Đã phát hành cho người dùng (bản thử nghiệm ${promoted[1]})`;
  const rollback = note.match(/^rollback to v(\d+)$/);
  if (rollback) return `Đã khôi phục phiên bản ${rollback[1]}`;
  if (note.startsWith('edit ')) return 'Đã sửa một mục';
  if (note.startsWith('delete ')) return 'Đã xoá một mục';
  return note;
}
