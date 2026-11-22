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
      className="grid gap-3 border border-[#E3DDD2] bg-[#FBF9F4] p-4 md:grid-cols-[minmax(0,1fr)_8rem_10rem_auto] md:items-end"
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
      <label className="grid gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B756F]">
        Dành cho ai
        <input
          className="rounded-[4px] border border-[#D5CFC3] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1A2820]"
          maxLength={120}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Tên hoặc kênh"
          required
          value={label}
        />
      </label>
      <label className="grid gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B756F]">
        Phần trăm
        <input
          className="rounded-[4px] border border-[#D5CFC3] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1A2820]"
          inputMode="numeric"
          max={100}
          min={1}
          onChange={(event) => setPercent(event.target.value)}
          required
          type="number"
          value={percent}
        />
      </label>
      <label className="grid gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#6B756F]">
        Hết hạn sau (ngày)
        <input
          className="rounded-[4px] border border-[#D5CFC3] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1A2820]"
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
        className="bg-[#1B4336] px-4 py-2 text-sm font-medium text-[#F4F1EA] disabled:bg-[#C9C3B6]"
        disabled={!isValid || isBusy || isDisabled}
        type="submit"
      >
        {isBusy ? 'Đang tạo...' : 'Tạo lời mời'}
      </button>
    </form>
  );
}
