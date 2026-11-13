'use client';

import { useRef, useState } from 'react';

interface Props {
  label: string;
  link: string;
  onDone: () => void;
}

/** The new invite's link, shown once: the server keeps only its hash. */
export function AffiliateInviteLink({ label, link, onDone }: Props) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyState('copied');
    } catch {
      // Clipboard blocked: select the link so it can be copied by hand.
      inputRef.current?.select();
      setCopyState('failed');
    }
  };

  return (
    <section className="grid gap-3 border border-slate-900 bg-white p-4 rounded-xl" aria-live="polite">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Link lời mời cho {label}</h2>
        <p className="mt-1 text-sm text-slate-500">Hãy sao chép ngay. Link chỉ hiện một lần.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="Link lời mời"
          className="min-w-0 flex-1 border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-900 rounded-lg"
          onFocus={(event) => event.target.select()}
          readOnly
          ref={inputRef}
          value={link}
        />
        <button
          className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white rounded-lg"
          onClick={() => void copy()}
          type="button"
        >
          {copyState === 'copied' ? 'Đã sao chép' : 'Sao chép link'}
        </button>
        <button
          className="border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 rounded-lg"
          onClick={onDone}
          type="button"
        >
          Xong
        </button>
      </div>
      {copyState === 'failed' && (
        <p className="text-xs text-slate-500">Không sao chép được. Link đã được chọn sẵn, hãy nhấn Ctrl+C hoặc Cmd+C.</p>
      )}
    </section>
  );
}
