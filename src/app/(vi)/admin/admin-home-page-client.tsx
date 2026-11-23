'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { packStatus } from '@/components/admin/data-packs/pack-meta';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import { fetchDataPacks } from '@/lib/data-pack-admin-api';
import { fetchSupplementReview } from '@/lib/supplement-admin-api';
import { KNOWN_DATA_PACKS } from '@/types/data-pack-admin';

interface Counts {
  pendingSupplements: number | null;
  packsWaiting: number | null;
}

export function AdminHomePageClient() {
  const [counts, setCounts] = useState<Counts>({ pendingSupplements: null, packsWaiting: null });
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const admin = useAdminSession({ onReload: () => setReloadKey((value) => value + 1) });
  const { environment, getValidToken, isPreviewMode, session } = admin;
  const isProd = environment === 'prod';

  const load = useCallback(async () => {
    if (isPreviewMode || !session) return;
    setError(null);
    try {
      const token = await getValidToken();
      const [reviews, packs] = await Promise.all([
        fetchSupplementReview(
          { kind: 'all', q: '', approved: false, photo: 'all', limit: 1, offset: 0 },
          token,
          environment
        ),
        fetchDataPacks(token, environment),
      ]);
      const byId = new Map(packs.packs.map((pack) => [pack.pack_id, pack]));
      const waiting = KNOWN_DATA_PACKS.filter((packId) => {
        const status = packStatus(byId.get(packId), isProd);
        return isProd ? status === 'sit-ahead' || status === 'sit-only' : status === 'missing';
      }).length;
      setCounts({
        pendingSupplements: reviews.total,
        packsWaiting: waiting,
      });
    } catch (requestError) {
      setError(adminErrorMessage(requestError));
    }
  }, [environment, getValidToken, isPreviewMode, isProd, session]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  return (
    <AdminPageShell
      admin={admin}
      current="/admin"
      title="Việc cần làm"
      description="Hai việc nội dung hay kẹt: TPCN đang chờ duyệt, và file điện thoại đã thử trên SIT nhưng chưa phát hành. Danh mục món máy chủ đã bỏ."
    >
      {admin.isPreviewMode && (
        <AdminBanner tone="warning" title="Chưa cấu hình backend" message="Các số bên dưới chỉ hiện khi đã nối MealTrack." />
      )}
      {error && <AdminBanner tone="error" title="Không tải được số liệu" message={error} />}
      <div className="grid gap-3 md:grid-cols-3">
        <TaskCard
          href="/admin/meal-catalog"
          label="Danh mục món máy chủ"
          value="Đã bỏ"
          hint="Không còn nhập, sửa, hay tạo ảnh. Món mới đưa vào thư viện công thức."
        />
        <TaskCard href="/admin/supplement-catalog?tab=review" label="TPCN đang chờ" value={counts.pendingSupplements} hint="Ảnh chụp nhãn và sản phẩm bị giữ khi nhập." />
        <TaskCard
          href="/admin/recipes"
          label={isProd ? 'File chờ phát hành' : 'File chưa theo dõi'}
          value={counts.packsWaiting}
          hint={`${KNOWN_DATA_PACKS.length} file công thức, thực phẩm và TPCN điện thoại đọc.`}
        />
      </div>
    </AdminPageShell>
  );
}

function TaskCard({ href, label, value, hint }: { href: string; label: string; value: number | string | null; hint: string }) {
  const retired = typeof value === 'string';
  return (
    <Link href={href} className={retired
      ? 'border border-[#8E2F2F] bg-[#F8EBE8] p-5 transition-colors duration-200 hover:border-[#742626] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8E2F2F]'
      : 'border border-[#E3DDD2] bg-[#FBF9F4] p-5 transition-colors duration-200 hover:border-[#1B4336] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336]'}>
      <p className="text-[13px] text-[#5C6B62]">{label}</p>
      <p className={retired
        ? 'mt-3 font-body text-[28px] font-medium leading-none tracking-[-0.03em] text-[#8E2F2F]'
        : 'mt-3 font-body text-[32px] font-medium leading-none tracking-[-0.03em] text-[#1A2820]'}>{value === null ? '—' : value}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#53635B]">{hint}</p>
    </Link>
  );
}
