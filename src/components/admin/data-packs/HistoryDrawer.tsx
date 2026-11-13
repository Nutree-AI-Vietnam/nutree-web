'use client';

import { Badge, Button, Drawer } from '@/components/admin/ui/AdminUi';
import { formatDate, formatSize, packLabel, shortHash } from '@/components/admin/data-packs/pack-meta';
import type { DataPack, DataPackEntry } from '@/types/data-pack-admin';

interface Props {
  pack: DataPack | null;
  isBusy: boolean;
  onClose: () => void;
  onRollback: (pack: DataPack, entry: DataPackEntry) => void;
}

/** Versions of one pack on this channel, newest first, with rollback. */
export function HistoryDrawer({ pack, isBusy, onClose, onRollback }: Props) {
  const versions = pack ? [...(pack.current ? [pack.current] : []), ...pack.history] : [];
  return (
    <Drawer
      open={pack !== null}
      title={pack ? `${packLabel(pack.pack_id)} history` : ''}
      description="Rolling back publishes the old file again under a new version, so every app picks it up."
      onClose={onClose}
    >
      <ol className="relative space-y-1 border-l border-slate-200 pl-5">
        {versions.map((entry, index) => {
          const isCurrent = index === 0 && pack?.current !== null;
          return (
            <li key={entry.version} className="relative rounded-lg px-3 py-3 hover:bg-slate-50">
              <span
                className={
                  isCurrent
                    ? 'absolute -left-[27px] top-4 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100'
                    : 'absolute -left-[25px] top-4 h-2 w-2 rounded-full bg-slate-300'
                }
              />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">v{entry.version}</p>
                    {isCurrent && <Badge tone="green">Current</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{entry.note || 'No note'}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {formatDate(entry.published_at)} · {formatSize(entry.size)} · <span className="font-mono">{shortHash(entry)}</span>
                  </p>
                </div>
                {!isCurrent && pack && (
                  <Button size="sm" icon="history" disabled={isBusy} onClick={() => onRollback(pack, entry)}>
                    Roll back
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Drawer>
  );
}
