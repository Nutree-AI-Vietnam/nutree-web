'use client';

import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { useAdminSession } from '@/hooks/useAdminSession';

export function AdminMealCatalogPageClient() {
  const admin = useAdminSession();

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/meal-catalog"
      title="Danh mục món ăn"
      description="Bảng máy chủ này đã bỏ. Món mới chỉ đưa vào thư viện công thức."
      alert={
        <div role="status" className="border border-[#8E2F2F] bg-[#F8EBE8] px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8E2F2F]">Đã bỏ</p>
          <p className="mt-1 text-lg font-medium text-[#1A2820]">Không nhập, sửa, hay tạo ảnh ở đây nữa.</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#1A2820]">
            Danh mục món máy chủ trùng thư viện công thức điện thoại tải về. Tuần ăn do model viết và lưu bản sao trên từng ô. Trang này không gọi API danh mục nữa.
          </p>
        </div>
      }
    >
      <p className="max-w-3xl text-sm leading-relaxed text-[#1A2820]">
        Món đã ghi trong nhật ký vẫn giữ tên trên chính bữa đó. Ô tuần cũ chỉ trỏ vào bảng này thì không ghi bữa được nữa.
      </p>
    </AdminPageShell>
  );
}
