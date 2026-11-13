'use client';

import { useState } from 'react';
import { Button, Field, Icon, Modal, inputClass } from '@/components/admin/ui/AdminUi';
import { KIND_INFO, formatSize, packKind, packLabel } from '@/components/admin/data-packs/pack-meta';
import { cn } from '@/lib/cn';

interface Props {
  packId: string | null;
  nextVersion: number;
  isProd: boolean;
  isBusy: boolean;
  onClose: () => void;
  onUpload: (packId: string, file: File, note: string) => void;
}

/** Pick a file and publish it as the pack's next version on this channel. */
export function UploadDialog({ packId, nextVersion, isProd, isBusy, onClose, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const close = () => {
    setFile(null);
    setNote('');
    onClose();
  };

  return (
    <Modal
      open={packId !== null}
      title={packId ? `Upload ${packLabel(packId)}` : ''}
      onClose={close}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button
            variant={isProd ? 'warning' : 'primary'}
            icon="upload"
            disabled={!file}
            isBusy={isBusy}
            onClick={() => packId && file && onUpload(packId, file, note)}
          >
            Publish v{nextVersion} to {isProd ? 'PROD' : 'SIT'}
          </Button>
        </>
      }
    >
      {packId && (
        <div className="space-y-4">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              setFile(event.dataTransfer.files[0] ?? null);
            }}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
              isDragging ? 'border-slate-500 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <Icon name={file ? 'file' : 'upload'} className="h-6 w-6 text-slate-400" />
            {file ? (
              <>
                <p className="mt-2 text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{formatSize(file.size)} · click to choose another</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm font-medium text-slate-900">Drop the file here or click to choose</p>
                <p className="mt-0.5 text-xs text-slate-500">{KIND_INFO[packKind(packId)].description}</p>
              </>
            )}
            <input
              type="file"
              accept={KIND_INFO[packKind(packId)].accept}
              aria-label={`File for ${packId}`}
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <Field label="Note" hint="Shown in the version history.">
            <input className={inputClass} placeholder="e.g. 40 new Vietnamese dishes" value={note} onChange={(event) => setNote(event.target.value)} />
          </Field>
          <p className={cn('rounded-lg px-3 py-2 text-xs', isProd ? 'bg-rose-50 text-rose-800' : 'bg-sky-50 text-sky-800')}>
            {isProd
              ? 'Store builds download this the next time they check (within a few hours).'
              : 'Only dev and staging builds see this. Promote it from the PROD target once checked.'}
          </p>
        </div>
      )}
    </Modal>
  );
}
