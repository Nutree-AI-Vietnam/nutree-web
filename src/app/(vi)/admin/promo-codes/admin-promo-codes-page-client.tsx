'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { MealCatalogPagination } from '@/components/admin/MealCatalogPagination';
import { Button, Field, inputClass } from '@/components/admin/ui/AdminUi';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import {
  createPromoCode,
  fetchPromoCodes,
  updatePromoCode,
  type PromoCode,
  type PromoCodeList,
} from '@/lib/promo-admin-api';

const PAGE_SIZE = 50;

export function AdminPromoCodesPageClient() {
  const [q, setQ] = useState('');
  const [active, setActive] = useState<'all' | 'true' | 'false'>('all');
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<PromoCodeList>(emptyList);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const admin = useAdminSession({
    onReset: () => {
      setPage(0);
      setData(emptyList);
      setError(null);
      setMessage(null);
    },
    onReload: () => setReloadKey((value) => value + 1),
  });
  const { environment, getValidToken, isPreviewMode, session } = admin;
  const disabled = isPreviewMode || !session;

  const load = useCallback(async () => {
    if (isPreviewMode || !session) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const token = await getValidToken();
      setData(
        await fetchPromoCodes(
          { q, isActive: active, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
          token,
          environment
        )
      );
    } catch (requestError) {
      setError(adminErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [active, environment, getValidToken, isPreviewMode, page, q, session]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  const create = async (draft: {
    code: string;
    maxUses: string;
    description: string;
    expires: string;
    offering: string;
    source: string;
  }) => {
    setIsCreating(true);
    setError(null);
    setMessage(null);
    try {
      const token = await getValidToken();
      const created = await createPromoCode(
        {
          code: draft.code,
          max_uses: Number(draft.maxUses),
          description: draft.description.trim() || null,
          expires_at: draft.expires ? new Date(draft.expires).toISOString() : null,
          rc_offering_id: draft.offering.trim(),
          source_offering_id: draft.source.trim() || null,
        },
        token,
        environment
      );
      setMessage(`Đã tạo mã ${created.code}.`);
      setPage(0);
      setReloadKey((value) => value + 1);
      return true;
    } catch (requestError) {
      setError(adminErrorMessage(requestError));
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const toggle = async (promo: PromoCode) => {
    setError(null);
    setMessage(null);
    try {
      const token = await getValidToken();
      const updated = await updatePromoCode(promo.id, { is_active: !promo.is_active }, token, environment);
      setData((current) => ({
        ...current,
        items: current.items.map((row) => (row.id === updated.id ? updated : row)),
      }));
      setMessage(updated.is_active ? `Đã bật ${updated.code}.` : `Đã tắt ${updated.code}.`);
    } catch (requestError) {
      setError(adminErrorMessage(requestError));
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/promo-codes"
      title="Mã khuyến mãi"
      description="Tạo mã app đổi trước khi mua. Offering nguồn để trống thì mã dùng được ở mọi gói. Tắt mã thì người chưa đổi không dùng được nữa; lượt đã đổi vẫn giữ."
    >
      {admin.isPreviewMode && (
        <AdminBanner tone="warning" title="Chưa cấu hình backend" message="Hãy đặt API MealTrack để quản lý mã." />
      )}
      {error && <AdminBanner tone="error" title="Không thực hiện được" message={error} />}
      {message && <AdminBanner tone="info" title="Xong" message={message} />}
      <CreateForm isBusy={isCreating} isDisabled={disabled} onCreate={create} />
      <div className="flex flex-wrap gap-2">
        <input
          className={`${inputClass} max-w-xs`}
          placeholder="Tìm mã"
          value={q}
          onChange={(event) => {
            setPage(0);
            setQ(event.target.value);
          }}
        />
        <select
          className={`${inputClass} max-w-[10rem]`}
          value={active}
          onChange={(event) => {
            setPage(0);
            setActive(event.target.value as 'all' | 'true' | 'false');
          }}
        >
          <option value="all">Mọi trạng thái</option>
          <option value="true">Đang bật</option>
          <option value="false">Đã tắt</option>
        </select>
      </div>
      <MealCatalogPagination
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        total={data.total}
        visibleStart={data.total === 0 ? 0 : data.offset + 1}
        visibleEnd={Math.min(data.offset + data.items.length, data.total)}
        onPrevious={() => setPage((value) => Math.max(0, value - 1))}
        onNext={() => setPage((value) => value + 1)}
      />
      <PromoTable items={data.items} onToggle={(promo) => void toggle(promo)} />
    </AdminPageShell>
  );
}

function CreateForm({
  isBusy,
  isDisabled,
  onCreate,
}: {
  isBusy: boolean;
  isDisabled: boolean;
  onCreate: (draft: {
    code: string;
    maxUses: string;
    description: string;
    expires: string;
    offering: string;
    source: string;
  }) => Promise<boolean>;
}) {
  const [code, setCode] = useState('');
  const [maxUses, setMaxUses] = useState('100');
  const [description, setDescription] = useState('');
  const [expires, setExpires] = useState('');
  const [offering, setOffering] = useState('email');
  const [source, setSource] = useState('');

  return (
    <form
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const created = await onCreate({ code, maxUses, description, expires, offering, source });
        if (created) {
          setCode('');
          setDescription('');
          setExpires('');
          setSource('');
        }
      }}
    >
      <Field label="Mã">
        <input className={inputClass} value={code} required maxLength={50} onChange={(event) => setCode(event.target.value)} />
      </Field>
      <Field label="Số lượt">
        <input className={inputClass} type="number" min={1} required value={maxUses} onChange={(event) => setMaxUses(event.target.value)} />
      </Field>
      <Field label="Offering RevenueCat" hint="Gói app mở khi mã hợp lệ.">
        <input className={inputClass} required value={offering} onChange={(event) => setOffering(event.target.value)} />
      </Field>
      <Field label="Chỉ dùng từ offering" hint="Để trống nếu mã dùng được ở mọi gói đang bán.">
        <input className={inputClass} value={source} onChange={(event) => setSource(event.target.value)} />
      </Field>
      <Field label="Hết hạn" hint="Để trống nếu không hết hạn.">
        <input className={inputClass} type="datetime-local" value={expires} onChange={(event) => setExpires(event.target.value)} />
      </Field>
      <Field label="Mô tả">
        <input className={inputClass} value={description} maxLength={255} onChange={(event) => setDescription(event.target.value)} />
      </Field>
      <div className="md:col-span-3">
        <Button type="submit" variant="primary" icon="plus" isBusy={isBusy} disabled={isDisabled}>
          Tạo mã
        </Button>
      </div>
    </form>
  );
}

function PromoTable({ items, onToggle }: { items: PromoCode[]; onToggle: (promo: PromoCode) => void }) {
  if (items.length === 0) {
    return <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chưa có mã nào.</p>;
  }
  return (
    <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
          <tr>
            <th className="px-4 py-3">Mã</th>
            <th className="px-4 py-3">Lượt</th>
            <th className="px-4 py-3">Offering</th>
            <th className="px-4 py-3">Nguồn</th>
            <th className="px-4 py-3">Hết hạn</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((promo) => (
            <tr key={promo.id} className="border-b border-slate-100 last:border-b-0">
              <td className="px-4 py-3 font-semibold text-slate-900">
                {promo.code}
                {promo.description && <span className="block text-xs font-normal text-slate-500">{promo.description}</span>}
              </td>
              <td className="px-4 py-3">
                {promo.current_uses} / {promo.max_uses}
              </td>
              <td className="px-4 py-3">{promo.rc_offering_id}</td>
              <td className="px-4 py-3">{promo.source_offering_id ?? 'Mọi gói'}</td>
              <td className="px-4 py-3 text-slate-500">{promo.expires_at ? new Date(promo.expires_at).toLocaleString('vi-VN') : 'Không'}</td>
              <td className="px-4 py-3">{promo.is_active ? 'Đang bật' : 'Đã tắt'}</td>
              <td className="px-4 py-3 text-right">
                <Button size="sm" variant={promo.is_active ? 'danger' : 'secondary'} onClick={() => onToggle(promo)}>
                  {promo.is_active ? 'Tắt' : 'Bật'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const emptyList: PromoCodeList = { items: [], total: 0, limit: PAGE_SIZE, offset: 0 };
