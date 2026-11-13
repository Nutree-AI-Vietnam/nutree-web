'use client';

import { Badge, Button, Drawer } from '@/components/admin/ui/AdminUi';
import { formatDate, formatSize, friendlyNote, packLabel } from '@/components/admin/data-packs/pack-meta';
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
      title={pack ? `Phiên bản · ${packLabel(pack.pack_id)}` : ''}
      description="Khôi phục bản cũ sẽ phát hành lại nội dung đó thành một phiên bản mới, để mọi điện thoại đều nhận được."
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
                    <p className="text-sm font-semibold text-slate-900">Phiên bản {entry.version}</p>
                    {isCurrent && <Badge tone="green">Đang dùng</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{friendlyNote(entry.note)}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {formatDate(entry.published_at)} · {formatSize(entry.size)}
                  </p>
                </div>
                {!isCurrent && pack && (
                  <Button size="sm" icon="history" disabled={isBusy} onClick={() => onRollback(pack, entry)}>
                    Khôi phục
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

