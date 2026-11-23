'use client';

import { useState } from 'react';
import { Button, Field, inputClass } from '@/components/admin/ui/AdminUi';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  isBusy: boolean;
  isDisabled: boolean;
  onGrant: (email: string) => Promise<boolean>;
}

/** One email. The grant happens before that person opens the app. */
export function PremiumGrantForm({ isBusy, isDisabled, onGrant }: Props) {
  const [email, setEmail] = useState('');
  const trimmed = email.trim().toLowerCase();
  const isValid = EMAIL.test(trimmed);

  return (
    <form
      className="grid gap-3 border border-[#E3DDD2] bg-[#FBF9F4] p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!isValid || isBusy || isDisabled) return;
        const granted = await onGrant(trimmed);
        if (granted) setEmail('');
      }}
    >
      <Field label="Email" hint="Chưa cần đăng nhập. Lần đầu vào app bằng đúng email này là có Premium.">
        <input
          className={inputClass}
          type="email"
          autoComplete="off"
          value={email}
          placeholder="kol@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Button type="submit" variant="primary" icon="check" isBusy={isBusy} disabled={!isValid || isDisabled}>
        Cấp Premium
      </Button>
    </form>
  );
}
