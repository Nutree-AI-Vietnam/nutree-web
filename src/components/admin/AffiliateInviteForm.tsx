'use client';

import { useState } from 'react';
import type { AffiliateInviteCreateRequest } from '@/types/affiliate-invite-admin';

const DEFAULT_PERCENT = 30;

interface Props {
  isBusy: boolean;
  isDisabled: boolean;
  onCreate: (request: AffiliateInviteCreateRequest) => Promise<boolean>;
}

/** Label, percent and optional expiry for a new invite link. */
export function AffiliateInviteForm({ isBusy, isDisabled, onCreate }: Props) {
  const [label, setLabel] = useState('');
  const [percent, setPercent] = useState(String(DEFAULT_PERCENT));
  const [expiresDays, setExpiresDays] = useState('');

  const trimmed = label.trim();
  const percentValue = Number(percent);
  const daysValue = expiresDays.trim() === '' ? null : Number(expiresDays);
  const isValid =
    trimmed.length > 0 &&
    Number.isInteger(percentValue) &&
    percentValue >= 1 &&
    percentValue <= 100 &&
    (daysValue === null || (Number.isInteger(daysValue) && daysValue >= 1 && daysValue <= 3650));

  return (
    <form
      className="grid gap-3 border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_8rem_10rem_auto] md:items-end rounded-xl"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!isValid || isBusy) return;
        const created = await onCreate({ label: trimmed, commission_percent: percentValue, expires_days: daysValue });
        if (created) {
          setLabel('');
          setPercent(String(DEFAULT_PERCENT));
          setExpiresDays('');
        }
      }}
    >
      <label className="grid gap-1 text-xs font-semibold text-slate-500">
        Dành cho ai
        <input
          className="border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 rounded-lg"
          maxLength={120}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Tên hoặc kênh"
          required
          value={label}
        />
      </label>
      <label className="grid gap-1 text-xs font-semibold text-slate-500">
        Phần trăm
        <input
          className="border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 rounded-lg"
          inputMode="numeric"
          max={100}
          min={1}
          onChange={(event) => setPercent(event.target.value)}
          required
          type="number"
          value={percent}
        />
      </label>
      <label className="grid gap-1 text-xs font-semibold text-slate-500">
        Hết hạn sau (ngày)
        <input
          className="border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 rounded-lg"
          inputMode="numeric"
          max={3650}
          min={1}
          onChange={(event) => setExpiresDays(event.target.value)}
          placeholder="Không hết hạn"
          type="number"
          value={expiresDays}
        />
      </label>
      <button
        className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 rounded-lg"
        disabled={!isValid || isBusy || isDisabled}
        type="submit"
      >
        {isBusy ? 'Đang tạo...' : 'Tạo lời mời'}
      </button>
    </form>
  );
}
