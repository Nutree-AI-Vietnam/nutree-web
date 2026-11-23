'use client';

import { useCallback, useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { PremiumGrantForm } from '@/components/admin/PremiumGrantForm';
import { Button, Card, Field, inputClass } from '@/components/admin/ui/AdminUi';
import { adminErrorMessage, useAdminSession } from '@/hooks/useAdminSession';
import {
  grantPremiumByEmail,
  lookupPremiumByEmail,
  revokePremiumByEmail,
  type PremiumAccount,
  type PremiumGrantResponse,
} from '@/lib/premium-grant-admin-api';

const ENTITLEMENT: Record<PremiumAccount['entitlement'], string> = {
  entitled: 'Đang có Premium',
  not_entitled: 'Chưa có Premium',
  unavailable: 'RevenueCat chưa trả lời',
  no_account: 'Chưa có tài khoản',
  account_disabled: 'Tài khoản đang bị khóa',
};

export function AdminPremiumGrantPageClient() {
  const [isGranting, setIsGranting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PremiumGrantResponse | null>(null);
  const [lookupEmail, setLookupEmail] = useState('');
  const [account, setAccount] = useState<PremiumAccount | null>(null);
  const [isLooking, setIsLooking] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const admin = useAdminSession({
    onReset: () => {
      setError(null);
      setResult(null);
      setAccount(null);
    },
  });
  const disabled = admin.isPreviewMode || !admin.session;

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

  const lookup = useCallback(async () => {
    const email = lookupEmail.trim().toLowerCase();
    if (!email) return;
    setIsLooking(true);
    setError(null);
    setAccount(null);
    try {
      const token = await admin.getValidToken();
      setAccount(await lookupPremiumByEmail(email, token, admin.environment));
    } catch (requestError) {
      setError(adminErrorMessage(requestError));
    } finally {
      setIsLooking(false);
    }
  }, [admin, lookupEmail]);

  const revoke = useCallback(async () => {
    if (!account?.account_exists) return;
    if (!window.confirm(`Gỡ Premium được cấp cho ${account.email}? Gói người đó tự mua vẫn giữ.`)) return;
    setIsRevoking(true);
    setError(null);
    try {
      const token = await admin.getValidToken();
      setAccount(await revokePremiumByEmail(account.email, token, admin.environment));
    } catch (requestError) {
      setError(adminErrorMessage(requestError));
    } finally {
      setIsRevoking(false);
    }
  }, [account, admin]);

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
      description="Tra email để xem quyền hiện tại trên RevenueCat, rồi cấp hoặc gỡ Premium trọn đời. Trang này không lưu lịch sử cấp. Gỡ chỉ lấy lại quyền được tặng, không hủy gói đã mua."
    >
      {error && <AdminBanner tone="error" title="Không thực hiện được" message={error} />}
      {message && <AdminBanner tone="info" title="Xong" message={message} />}
      <Card>
        <form
          className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            void lookup();
          }}
        >
          <Field label="Tra email" hint="Không tạo tài khoản. Chỉ đọc quyền đang có.">
            <input
              className={inputClass}
              type="email"
              value={lookupEmail}
              placeholder="kol@example.com"
              onChange={(event) => setLookupEmail(event.target.value)}
            />
          </Field>
          <Button type="submit" icon="search" isBusy={isLooking} disabled={disabled || !lookupEmail.trim()}>
            Tra cứu
          </Button>
          <Button
            variant="danger"
            icon="trash"
            isBusy={isRevoking}
            disabled={disabled || !account?.account_exists || account.entitlement === 'account_disabled'}
            onClick={() => void revoke()}
          >
            Gỡ Premium
          </Button>
        </form>
        {account && (
          <p className="border-t border-[#E3DDD2] px-4 py-3 text-sm text-[#1A2820]">
            {account.email}: {ENTITLEMENT[account.entitlement]}
            {account.firebase_uid ? ` · ${account.firebase_uid}` : ''}
          </p>
        )}
      </Card>
      <PremiumGrantForm isBusy={isGranting} isDisabled={disabled} onGrant={handleGrant} />
    </AdminPageShell>
  );
}
