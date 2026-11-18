'use client';

import { useCallback, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { PremiumGrantForm } from '@/components/admin/PremiumGrantForm';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import { grantPremiumByEmail, type PremiumGrantResponse } from '@/lib/premium-grant-admin-api';

export function AdminPremiumGrantPageClient() {
  const [isGranting, setIsGranting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PremiumGrantResponse | null>(null);
  const admin = useAdminSession({
    onReset: () => {
      setError(null);
      setResult(null);
    },
  });

  const handleGrant = useCallback(
    async (email: string): Promise<boolean> => {
      setIsGranting(true);
      setError(null);
      setResult(null);
      try {
        const token = await admin.getValidToken();
        setResult(await grantPremiumByEmail(email, token, admin.environment));
        return true;
      } catch (requestError) {
        setError(adminErrorMessage(requestError));
        return false;
      } finally {
        setIsGranting(false);
      }
    },
    [admin]
  );

  const message = result
    ? result.already_entitled
      ? `${result.email} đã có Premium.`
      : `Đã cấp Premium trọn đời cho ${result.email}. Họ đăng nhập sau bằng đúng email này.`
    : null;

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/premium-grant"
      title="Cấp Premium"
      description="Nhập email là cấp Premium trọn đời ngay, kể cả khi người đó chưa từng mở app."
    >
      {error && <AdminBanner tone="error" title="Không cấp được" message={error} />}
      {message && <AdminBanner tone="info" title="Xong" message={message} />}
      <PremiumGrantForm
        isBusy={isGranting}
        isDisabled={admin.isPreviewMode || !admin.session}
        onGrant={handleGrant}
      />
    </AdminPageShell>
  );
}
