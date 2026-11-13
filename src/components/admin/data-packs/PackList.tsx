'use client';

import { Badge, Button, Card, CardHeader, type IconName } from '@/components/admin/ui/AdminUi';
import {
  KIND_INFO,
  formatRelative,
  formatSize,
  packKind,
  packLabel,
  packStatus,
  type PackKind,
} from '@/components/admin/data-packs/pack-meta';
import type { DataPack } from '@/types/data-pack-admin';

const KIND_ICON: Record<PackKind, IconName> = { recipes: 'catalog', food: 'globe', supplements: 'pill' };

interface Props {
  isProd: boolean;
  packIds: readonly string[];
  packs: DataPack[];
  busy: string | null;
  onUpload: (packId: string) => void;
  onHistory: (pack: DataPack) => void;
  onPromote: (pack: DataPack) => void;
  onAdopt: (packId: string) => void;
}

/** Every pack the app reads, grouped by kind, with its state on this channel. */
export function PackList({ isProd, packIds, packs, busy, onUpload, onHistory, onPromote, onAdopt }: Props) {
  const byId = new Map(packs.map((pack) => [pack.pack_id, pack]));
  const ids = [...new Set([...packIds, ...packs.map((pack) => pack.pack_id)])];
  const kinds: PackKind[] = ['recipes', 'food', 'supplements'];

  return (
    <>
      {kinds.map((kind) => {
        const rows = ids.filter((id) => packKind(id) === kind);
        if (rows.length === 0) return null;
        return (
          <Card key={kind}>
            <CardHeader icon={KIND_ICON[kind]} title={KIND_INFO[kind].title} description={KIND_INFO[kind].description} />
            <ul className="divide-y divide-slate-100">
              {rows.map((packId) => (
                <PackRow
                  key={packId}
                  packId={packId}
                  pack={byId.get(packId)}
                  isProd={isProd}
                  busy={busy}
                  onUpload={onUpload}
                  onHistory={onHistory}
                  onPromote={onPromote}
                  onAdopt={onAdopt}
                />
              ))}
            </ul>
          </Card>
        );
      })}
    </>
  );
}

function PackRow({
  packId,
  pack,
  isProd,
  busy,
  onUpload,
  onHistory,
  onPromote,
  onAdopt,
}: Omit<Props, 'packIds' | 'packs'> & { packId: string; pack: DataPack | undefined }) {
  const status = packStatus(pack, isProd);
  const current = pack?.current ?? null;
  const isBusy = busy === packId;
  const isLocked = busy !== null;

  return (
    <li className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-900">{packLabel(packId)}</p>
          <StatusBadge status={status} pack={pack} />
        </div>
        <p className="mt-1 font-mono text-[11px] text-slate-400">{packId}</p>
      </div>

      <dl className="grid grid-cols-3 gap-x-6 text-xs md:w-[300px]">
        <Stat label="Version" value={current ? `v${current.version}` : '—'} strong />
        <Stat label="Size" value={current ? formatSize(current.size) : '—'} />
        <Stat label="Updated" value={current ? formatRelative(current.published_at) : '—'} />
      </dl>

      <div className="flex flex-wrap items-center gap-2 md:w-[380px] md:flex-nowrap md:justify-end">
        {status === 'missing' ? (
          <Button size="sm" icon="refresh" onClick={() => onAdopt(packId)} isBusy={isBusy} disabled={isLocked}>
            Adopt current file
          </Button>
        ) : (
          (status === 'sit-ahead' || status === 'sit-only') &&
          isProd &&
          pack && (
            <Button size="sm" variant="warning" icon="rocket" onClick={() => onPromote(pack)} isBusy={isBusy} disabled={isLocked}>
              Promote SIT v{pack.sit?.version}
            </Button>
          )
        )}
        {pack && (pack.current || pack.history.length > 0) && (
          <Button size="sm" variant="ghost" icon="history" onClick={() => onHistory(pack)} disabled={isLocked}>
            History
          </Button>
        )}
        <Button size="sm" variant="ghost" icon="upload" onClick={() => onUpload(packId)} disabled={isLocked}>
          Upload
        </Button>
      </div>
    </li>
  );
}

function StatusBadge({ status, pack }: { status: ReturnType<typeof packStatus>; pack: DataPack | undefined }) {
  switch (status) {
    case 'live':
      return (
        <Badge tone="green" dot>
          Live
        </Badge>
      );
    case 'sit-ahead':
      return (
        <Badge tone="amber" dot>
          SIT has v{pack?.sit?.version}
        </Badge>
      );
    case 'sit-only':
      return (
        <Badge tone="violet" dot>
          Only on SIT
        </Badge>
      );
    default:
      return <Badge>Not in manifest</Badge>;
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
