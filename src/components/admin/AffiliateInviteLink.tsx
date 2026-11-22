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
    <section className="grid gap-3 border border-[#1B4336] bg-[#FBF9F4] p-4" aria-live="polite">
      <div>
        <h2 className="text-base font-medium text-[#1A2820]">Link lời mời cho {label}</h2>
        <p className="mt-1 text-sm text-[#5C6B62]">Hãy sao chép ngay. Link chỉ hiện một lần.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="Link lời mời"
          className="min-w-0 flex-1 border border-[#D5CFC3] bg-white px-3 py-2 font-mono text-xs text-[#1A2820]"
          onFocus={(event) => event.target.select()}
          readOnly
          ref={inputRef}
          value={link}
        />
        <button
          className="bg-[#1B4336] px-4 py-2 text-sm font-medium text-[#F4F1EA]"
          onClick={() => void copy()}
          type="button"
        >
          {copyState === 'copied' ? 'Đã sao chép' : 'Sao chép link'}
        </button>
        <button
          className="border border-[#D5CFC3] bg-[#FBF9F4] px-4 py-2 text-sm font-medium text-[#5C6B62] hover:border-[#1B4336]"
          onClick={onDone}
          type="button"
        >
          Xong
        </button>
      </div>
      {copyState === 'failed' && (
        <p className="text-xs text-[#5C6B62]">Không sao chép được. Link đã được chọn sẵn, hãy nhấn Ctrl+C hoặc Cmd+C.</p>
      )}
    </section>
  );
}
