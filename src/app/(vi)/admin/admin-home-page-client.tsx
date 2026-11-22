'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { packStatus } from '@/components/admin/data-packs/pack-meta';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import { fetchDataPacks } from '@/lib/data-pack-admin-api';
import { fetchMealCatalog } from '@/lib/mealtrack-admin-api';
import { fetchSupplementReview } from '@/lib/supplement-admin-api';
import { KNOWN_DATA_PACKS } from '@/types/data-pack-admin';

interface Counts {
  missingImages: number | null;
  pendingSupplements: number | null;
  packsWaiting: number | null;
}

export function AdminHomePageClient() {
  const [counts, setCounts] = useState<Counts>({ missingImages: null, pendingSupplements: null, packsWaiting: null });
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
      const [meals, reviews, packs] = await Promise.all([
        fetchMealCatalog(
          { has_image: 'false', is_active: 'true', limit: 1, offset: 0 },
          token,
          environment
        ),
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
        missingImages: meals.total,
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
      description="Ba việc nội dung hay kẹt: món máy chủ chưa có ảnh, TPCN đang chờ duyệt, và file điện thoại đã thử trên SIT nhưng chưa phát hành."
    >
      {admin.isPreviewMode && (
        <AdminBanner tone="warning" title="Chưa cấu hình backend" message="Các số bên dưới chỉ hiện khi đã nối MealTrack." />
      )}
      {error && <AdminBanner tone="error" title="Không tải được số liệu" message={error} />}
      <div className="grid gap-3 md:grid-cols-3">
        <TaskCard href="/admin/meal-catalog?has_image=false" label="Món đang dùng, thiếu ảnh" value={counts.missingImages} hint="Tạo ảnh hoặc sửa món trong danh mục máy chủ." />
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

function TaskCard({ href, label, value, hint }: { href: string; label: string; value: number | null; hint: string }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value === null ? '—' : value}</p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </Link>
  );
}
