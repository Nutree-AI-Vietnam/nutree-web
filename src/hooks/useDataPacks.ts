'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { packLabel } from '@/components/admin/data-packs/pack-meta';
import { adminErrorMessage, type AdminSession } from '@/hooks/useAdminSession';
import {
  adoptLegacyDataPack,
  fetchDataPacks,
  promoteDataPack,
  rollbackDataPack,
  uploadDataPack,
} from '@/lib/data-pack-admin-api';
import type { DataPack, DataPackEntry, DataPackListResponse } from '@/types/data-pack-admin';

export type PackMessage = { tone: 'info' | 'error'; text: string };

const empty: DataPackListResponse = { channel: 'sit', updated_at: '', packs: [] };

/**
 * The published versions of every pack on the admin's target, and the
 * release actions (upload, restore, release to users, start tracking).
 */
export function useDataPacks(admin: AdminSession, reloadKey: number) {
  const { environment, getValidToken, isPreviewMode, session } = admin;
  const [data, setData] = useState<DataPackListResponse>(empty);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<PackMessage | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [localReload, setLocalReload] = useState(0);

  useEffect(() => {
    if (isPreviewMode || !session) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    (async () => {
      try {
        const response = await fetchDataPacks(await getValidToken(), environment);
        if (!cancelled) setData(response);
      } catch (requestError) {
        if (!cancelled) setError(adminErrorMessage(requestError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [environment, getValidToken, isPreviewMode, session, reloadKey, localReload]);

  const byId = useMemo(() => new Map(data.packs.map((pack) => [pack.pack_id, pack])), [data]);
  const isProd = data.channel === 'prod';
  const where = isProd ? 'đã tới người dùng' : 'đang trên SIT';
  const reach = isProd
    ? 'Điện thoại sẽ nhận trong vài giờ.'
    : 'Máy thử sẽ nhận trong vài giờ. Khi ổn, chuyển sang PROD để phát hành cho người dùng.';
  const versionOf = useCallback((packId: string) => byId.get(packId)?.current?.version ?? 0, [byId]);
  const reload = useCallback(() => setLocalReload((value) => value + 1), []);

  const run = useCallback(
    async (key: string, action: (token: string) => Promise<unknown>, done: string) => {
      setBusy(key);
      setMessage(null);
      try {
        await action(await getValidToken());
        setMessage({ tone: 'info', text: done });
        reload();
        return true;
      } catch (requestError) {
        setMessage({ tone: 'error', text: adminErrorMessage(requestError) });
        return false;
      } finally {
        setBusy(null);
      }
    },
    [getValidToken, reload]
  );

  return {
    data,
    byId,
    isProd,
    isLoading,
    error,
    message,
    setMessage,
    busy,
    reload,
    run,
    versionOf,
    upload: (packId: string, file: File, note: string) =>
      run(
        packId,
        (token) => uploadDataPack(packId, file, note, versionOf(packId), token, environment),
        `${packLabel(packId)}: phiên bản ${versionOf(packId) + 1} ${where}. ${reach}`
      ),
    restore: (pack: DataPack, entry: DataPackEntry) =>
      run(
        pack.pack_id,
        (token) => rollbackDataPack(pack.pack_id, entry.version, pack.current?.version ?? 0, token, environment),
        `${packLabel(pack.pack_id)}: đã khôi phục nội dung phiên bản ${entry.version}. ${reach}`
      ),
    release: (pack: DataPack) =>
      run(
        pack.pack_id,
        (token) => promoteDataPack(pack.pack_id, pack.current?.version ?? 0, token, environment),
        `${packLabel(pack.pack_id)}: bản đã thử nghiệm giờ đã tới người dùng.`
      ),
    track: (packId: string) =>
      run(
        packId,
        (token) => adoptLegacyDataPack(packId, token, environment),
        `${packLabel(packId)}: đã bắt đầu theo dõi, phiên bản 1 là nội dung điện thoại đang dùng.`
      ),
  };
}

export type DataPacks = ReturnType<typeof useDataPacks>;
