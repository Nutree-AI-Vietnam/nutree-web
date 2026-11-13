'use client';

import { useState } from 'react';
import type { DataPack } from '@/types/data-pack-admin';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
const BUTTON = 'whitespace-nowrap border border-border bg-white px-3 py-1.5 text-xs font-bold disabled:text-muted';

interface Props {
  packs: DataPack[];
  /** Known pack ids the manifest does not list yet. */
  unlisted: string[];
  busy: string | null;
  onUpload: (pack: DataPack | string, file: File, note: string) => void;
  onRollback: (pack: DataPack, version: number) => void;
  onAdopt: (packId: string) => void;
}

/** Every published pack, its current version, and older versions to roll back to. */
export function DataPackTable({ packs, unlisted, busy, onUpload, onRollback, onAdopt }: Props) {
  return (
    <section className="overflow-x-auto border-y border-border bg-white">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead className="border-b border-border bg-background text-xs text-muted">
          <tr>
            <th className="px-4 py-3 font-bold">Pack</th>
            <th className="px-4 py-3 font-bold">Version</th>
            <th className="px-4 py-3 font-bold">Size</th>
            <th className="px-4 py-3 font-bold">Published</th>
            <th className="px-4 py-3 font-bold">Note</th>
            <th className="px-4 py-3 font-bold">Roll back</th>
            <th className="px-4 py-3 font-bold">Upload new file</th>
          </tr>
        </thead>
        <tbody>
          {packs.map((pack) => (
            <tr key={pack.pack_id} className="border-b border-border align-top">
              <td className="px-4 py-3 font-mono text-xs">{pack.pack_id}</td>
              <td className="px-4 py-3 font-bold">v{pack.current.version}</td>
              <td className="px-4 py-3">{formatSize(pack.current.size)}</td>
              <td className="px-4 py-3">{formatDate(pack.current.published_at)}</td>
              <td className="px-4 py-3 text-muted">{pack.current.note || '—'}</td>
              <td className="px-4 py-3">
                <RollbackControl pack={pack} disabled={busy !== null} onRollback={onRollback} />
              </td>
              <td className="px-4 py-3">
                <UploadControl
                  packId={pack.pack_id}
                  disabled={busy !== null}
                  isBusy={busy === pack.pack_id}
                  onUpload={(file, note) => onUpload(pack, file, note)}
                />
              </td>
            </tr>
          ))}
          {unlisted.map((packId) => (
            <tr key={packId} className="border-b border-border align-top text-muted">
              <td className="px-4 py-3 font-mono text-xs">{packId}</td>
              <td className="px-4 py-3" colSpan={4}>
                Not in the manifest yet. Adopt the file apps already download, or upload a new one.
              </td>
              <td className="px-4 py-3">
                <button type="button" className={BUTTON} disabled={busy !== null} onClick={() => onAdopt(packId)}>
                  {busy === packId ? 'Adopting…' : 'Adopt legacy file'}
                </button>
              </td>
              <td className="px-4 py-3">
                <UploadControl
                  packId={packId}
                  disabled={busy !== null}
                  isBusy={false}
                  onUpload={(file, note) => onUpload(packId, file, note)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function RollbackControl({
  pack,
  disabled,
  onRollback,
}: {
  pack: DataPack;
  disabled: boolean;
  onRollback: (pack: DataPack, version: number) => void;
}) {
  const [version, setVersion] = useState('');
  if (pack.history.length === 0) return <span className="text-xs text-muted">No older version</span>;
  return (
    <div className="flex gap-2">
      <select
        aria-label={`Older version of ${pack.pack_id}`}
        className="border border-border bg-white px-2 py-1 text-xs"
        value={version}
        onChange={(event) => setVersion(event.target.value)}
      >
        <option value="">Version…</option>
        {pack.history.map((old) => (
          <option key={old.version} value={old.version}>
            v{old.version} · {formatDate(old.published_at)}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={BUTTON}
        disabled={disabled || !version}
        onClick={() => onRollback(pack, Number(version))}
      >
        Roll back
      </button>
    </div>
  );
}

function UploadControl({
  packId,
  disabled,
  isBusy,
  onUpload,
}: {
  packId: string;
  disabled: boolean;
  isBusy: boolean;
  onUpload: (file: File, note: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const accept = packId.startsWith('recipes_') ? '.gz,.json.gz' : '.gz,.sqlite.gz';
  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept={accept}
        aria-label={`New file for ${packId}`}
        className="text-xs"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Note (optional)"
          aria-label={`Note for ${packId}`}
          className="w-36 border border-border px-2 py-1 text-xs"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <button
          type="button"
          className={BUTTON}
          disabled={disabled || !file}
          onClick={() => file && onUpload(file, note)}
        >
          {isBusy ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : DATE_FORMAT.format(date);
}
