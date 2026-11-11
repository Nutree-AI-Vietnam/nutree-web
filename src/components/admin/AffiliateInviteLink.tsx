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
    <section className="grid gap-3 border border-primary-forest bg-white p-4" aria-live="polite">
      <div>
        <h2 className="text-base font-bold text-foreground">Invite link for {label}</h2>
        <p className="mt-1 text-sm text-muted">Copy it now. It is shown only once.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="Invite link"
          className="min-w-0 flex-1 border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
          onFocus={(event) => event.target.select()}
          readOnly
          ref={inputRef}
          value={link}
        />
        <button
          className="border border-primary-forest bg-primary-forest px-4 py-2 text-sm font-bold text-white"
          onClick={() => void copy()}
          type="button"
        >
          {copyState === 'copied' ? 'Copied' : 'Copy link'}
        </button>
        <button
          className="border border-border bg-white px-4 py-2 text-sm font-bold text-muted hover:border-primary-teal"
          onClick={onDone}
          type="button"
        >
          Done
        </button>
      </div>
      {copyState === 'failed' && (
        <p className="text-xs text-muted">Copying was blocked. The link is selected; press Ctrl+C or Cmd+C.</p>
      )}
    </section>
  );
}
