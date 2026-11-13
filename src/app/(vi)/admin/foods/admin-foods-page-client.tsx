'use client';

import { useCallback, useState } from 'react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { ReleaseWorkspace } from '@/components/admin/data-packs/ReleaseWorkspace';
import { packIdsOf } from '@/components/admin/data-packs/pack-meta';
import { Button } from '@/components/admin/ui/AdminUi';
import { useAdminSession } from '@/hooks/useAdminSession';
import { useDataPacks } from '@/hooks/useDataPacks';
import { KNOWN_DATA_PACKS } from '@/types/data-pack-admin';

const FOOD_PACKS = packIdsOf('food', KNOWN_DATA_PACKS);

export function AdminFoodsPageClient() {
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReload: reload });
  const packs = useDataPacks(admin, reloadKey);

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/foods"
      title="Food database"
      description="The foods people search when they log a meal by hand, one database per language. Phones keep a copy for offline search and update it on their next check."
      actions={
        <Button icon="refresh" onClick={packs.reload} isBusy={packs.isLoading && !packs.error}>
          Refresh
        </Button>
      }
    >
      <ReleaseWorkspace
        packs={packs}
        packIds={FOOD_PACKS}
        icon="globe"
        title="Food databases"
        description="Upload a new database to test it, then release it to users from the PROD target."
        unit={{ one: 'language', many: 'languages' }}
      />
    </AdminPageShell>
  );
}
