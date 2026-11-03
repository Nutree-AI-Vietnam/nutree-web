/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react';
import { PHOTO_FILE_TYPES } from '@/lib/shrink-photo-for-upload';
import type { SupplementReviewItem } from '@/types/supplement-admin';

interface Props {
  item: SupplementReviewItem;
  disabled: boolean;
  /** A picked file to upload, or null to remove the current photo. */
  onChange: (file: File | null) => void;
}

/** The product photo the app shows. Catalog rows take one; a scan once approved. */
export function SupplementPhotoEditor({ item, disabled, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null);
  // A scan waiting for review is still its owner's row, and may merge away.
  if (item.kind === 'scan' && item.review_status !== 'approved') {
    return <p className="text-xs text-muted">Approve the scan to add a product photo.</p>;
  }

  return (
    <div className="grid gap-2">
      <p className="text-xs font-bold uppercase text-muted">Product photo</p>
      <div className="flex items-center gap-3">
        {item.image_url ? (
          <a href={item.image_url} target="_blank" rel="noreferrer" className="shrink-0 border border-border bg-white">
            <img src={item.image_url} alt={`Photo of ${item.name}`} className="h-20 w-20 object-contain" loading="lazy" />
          </a>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-dashed border-border text-xs text-muted">
            No photo
          </div>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={() => input.current?.click()}
          className="border border-border px-3 py-2 text-xs font-bold text-muted hover:border-primary-teal disabled:opacity-50"
        >
          {item.image_url ? 'Replace photo' : 'Add photo'}
        </button>
        {item.image_url && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(null)}
            className="px-2 text-xs font-bold text-muted hover:text-foreground disabled:opacity-50"
          >
            Remove
          </button>
        )}
        <input
          ref={input}
          type="file"
          accept={PHOTO_FILE_TYPES}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Cleared, so picking the same file again still fires a change.
            event.target.value = '';
            if (file) onChange(file);
          }}
        />
      </div>
    </div>
  );
}
