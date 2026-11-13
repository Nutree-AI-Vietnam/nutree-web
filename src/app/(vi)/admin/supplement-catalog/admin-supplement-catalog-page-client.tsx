'use client';

import { useCallback, useState } from 'react';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { ReleaseWorkspace } from '@/components/admin/data-packs/ReleaseWorkspace';
import { packIdsOf } from '@/components/admin/data-packs/pack-meta';
import { Button } from '@/components/admin/ui/AdminUi';
import { useAdminSession } from '@/hooks/useAdminSession';
import { useDataPacks } from '@/hooks/useDataPacks';
import { KNOWN_DATA_PACKS } from '@/types/data-pack-admin';

const SUPPLEMENT_PACKS = packIdsOf('supplements', KNOWN_DATA_PACKS);

export function AdminSupplementCatalogPageClient() {
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReload: reload });
  const packs = useDataPacks(admin, reloadKey);

  return (
    <AdminPageShell
      admin={admin}
      current="/admin/supplement-catalog"
      title="Supplement catalog releases"
      description="The supplement catalog phones download for search, barcode lookup and the popular list. Approve products in the review queue first, then publish a new catalog file here."
      actions={
        <Button icon="refresh" onClick={packs.reload} isBusy={packs.isLoading && !packs.error}>
          Refresh
        </Button>
      }
    >
      <ReleaseWorkspace
        packs={packs}
        packIds={SUPPLEMENT_PACKS}
        icon="pill"
        title="Catalog file"
        description="One catalog for every language. Test a new file first, then release it to users from the PROD target."
        unit={{ one: 'catalog', many: 'catalogs' }}
      />
    </AdminPageShell>
  );
}
