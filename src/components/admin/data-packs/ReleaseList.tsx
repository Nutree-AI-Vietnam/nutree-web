'use client';

import { Badge, Button, Card, CardHeader, type IconName } from '@/components/admin/ui/AdminUi';
import { formatRelative, formatSize, friendlyNote, packLabel, packStatus, type PackStatus } from '@/components/admin/data-packs/pack-meta';
import type { DataPack } from '@/types/data-pack-admin';

interface Props {
  title: string;
  description: string;
  icon: IconName;
  isProd: boolean;
  packIds: readonly string[];
  byId: Map<string, DataPack>;
  busy: string | null;
  onUpload: (packId: string) => void;
  onVersions: (pack: DataPack) => void;
  onRelease: (pack: DataPack) => void;
  onTrack: (packId: string) => void;
}

/** One row per language (or the one catalog): what users have, and what to do next. */
export function ReleaseList({ title, description, icon, isProd, packIds, byId, busy, onUpload, onVersions, onRelease, onTrack }: Props) {
  return (
    <Card>
      <CardHeader icon={icon} title={title} description={description} />
      <ul className="divide-y divide-slate-100">
        {packIds.map((packId) => {
          const pack = byId.get(packId);
          const status = packStatus(pack, isProd);
          const current = pack?.current ?? null;
          const isBusy = busy === packId;
          const isLocked = busy !== null;
          return (
            <li key={packId} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-slate-900">{packLabel(packId)}</p>
                  <StatusBadge status={status} isProd={isProd} sitVersion={pack?.sit?.version} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{current ? friendlyNote(current.note) : describe(status, isProd)}</p>
              </div>

              <dl className="grid grid-cols-3 gap-x-6 text-xs md:w-[300px]">
                <Stat label="Version" value={current ? String(current.version) : '—'} strong />
                <Stat label="Size" value={current ? formatSize(current.size) : '—'} />
                <Stat label="Updated" value={current ? formatRelative(current.published_at) : '—'} />
              </dl>

              <div className="flex flex-wrap items-center gap-2 md:w-[400px] md:flex-nowrap md:justify-end">
                {status === 'missing' && (
                  <Button size="sm" icon="refresh" onClick={() => onTrack(packId)} isBusy={isBusy} disabled={isLocked}>
                    Start tracking
                  </Button>
                )}
                {isProd && pack && (status === 'sit-ahead' || status === 'sit-only') && (
                  <Button size="sm" variant="warning" icon="rocket" onClick={() => onRelease(pack)} isBusy={isBusy} disabled={isLocked}>
                    Release to users
                  </Button>
                )}
                {pack && (pack.current || pack.history.length > 0) && (
                  <Button size="sm" variant="ghost" icon="history" onClick={() => onVersions(pack)} disabled={isLocked}>
                    Versions
                  </Button>
                )}
                <Button size="sm" variant="ghost" icon="upload" onClick={() => onUpload(packId)} disabled={isLocked}>
                  Upload new
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function describe(status: PackStatus, isProd: boolean): string {
  switch (status) {
    case 'missing':
      return 'Phones use the original file. Start tracking to manage its versions here.';
    case 'sit-only':
      return 'Tested but not released: users do not have it yet.';
    case 'sit-ahead':
      return 'A newer version is waiting in testing.';
    default:
      return isProd ? 'What users have now.' : 'What test phones have now.';
  }
}

function StatusBadge({ status, isProd, sitVersion }: { status: PackStatus; isProd: boolean; sitVersion?: number }) {
  switch (status) {
    case 'live':
      return (
        <Badge tone="green" dot>
          {isProd ? 'Live for users' : 'Live in testing'}
        </Badge>
      );
    case 'sit-ahead':
      return (
        <Badge tone="amber" dot>
          Version {sitVersion} ready in testing
        </Badge>
      );
    case 'sit-only':
      return (
        <Badge tone="violet" dot>
          Only in testing
        </Badge>
      );
    default:
      return <Badge>Not tracked yet</Badge>;
  }
}

function Stat({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] text-slate-400">{label}</dt>
      <dd className={strong ? 'mt-0.5 font-semibold text-slate-900' : 'mt-0.5 text-slate-600'}>{value}</dd>
    </div>
  );
}
