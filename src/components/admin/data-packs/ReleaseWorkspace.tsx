'use client';

import { useState } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { HistoryDrawer } from '@/components/admin/data-packs/HistoryDrawer';
import { ReleaseList } from '@/components/admin/data-packs/ReleaseList';
import { UploadDialog } from '@/components/admin/data-packs/UploadDialog';
import { formatRelative, packStatus } from '@/components/admin/data-packs/pack-meta';
import { Card, type IconName } from '@/components/admin/ui/AdminUi';
import type { DataPacks } from '@/hooks/useDataPacks';

interface Props {
  packs: DataPacks;
  packIds: readonly string[];
  title: string;
  description: string;
  icon: IconName;
  /** "language" or "catalog": how the summary counts things. */
  unit: { one: string; many: string };
}

/** Summary, the release list, and its upload and versions panels, for one kind of content. */
export function ReleaseWorkspace({ packs, packIds, title, description, icon, unit }: Props) {
  const [uploading, setUploading] = useState<string | null>(null);
  const [versionsOf, setVersionsOf] = useState<string | null>(null);
  const { byId, isProd, busy } = packs;

  const statuses = packIds.map((packId) => packStatus(byId.get(packId), isProd));
  const live = statuses.filter((status) => status === 'live' || status === 'sit-ahead').length;
  const waiting = statuses.filter((status) => status === 'sit-ahead' || status === 'sit-only').length;
  const missing = statuses.filter((status) => status === 'missing').length;
  const lastUpdate = packIds
    .map((packId) => byId.get(packId)?.current?.published_at)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const count = (n: number) => `${n} ${n === 1 ? unit.one : unit.many}`;

  return (
    <>
      {packs.error && <AdminBanner tone="error" title="Could not load" message={packs.error} />}
      {packs.message && (
        <AdminBanner tone={packs.message.tone} title={packs.message.tone === 'error' ? 'That did not work' : 'Done'} message={packs.message.text} />
      )}

      {packIds.length > 1 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Summary
            label={isProd ? 'Live for users' : 'Live in testing'}
            value={`${live} of ${packIds.length}`}
            hint={lastUpdate ? `Last change ${formatRelative(lastUpdate)}` : 'Nothing published yet'}
          />
          {isProd ? (
            <Summary label="Ready to release" value={String(waiting)} hint={waiting ? `${count(waiting)} tested and waiting` : 'Users have everything tested'} tone={waiting ? 'amber' : 'neutral'} />
          ) : (
            <Summary label="You are in testing" value="Safe" hint="Changes here reach test phones only" tone="blue" />
          )}
          <Summary label="Not tracked yet" value={String(missing)} hint={missing ? 'Start tracking to manage versions' : `Every ${unit.one} has versions`} />
        </div>
      )}

      {!packs.isLoading && (
        <ReleaseList
          title={title}
          description={description}
          icon={icon}
          isProd={isProd}
          packIds={packIds}
          byId={byId}
          busy={busy}
          onUpload={setUploading}
          onVersions={(pack) => setVersionsOf(pack.pack_id)}
          onRelease={(pack) => void packs.release(pack)}
          onTrack={(packId) => void packs.track(packId)}
        />
      )}

      <UploadDialog
        packId={uploading}
        nextVersion={uploading ? packs.versionOf(uploading) + 1 : 1}
        isProd={isProd}
        isBusy={busy !== null}
        onClose={() => setUploading(null)}
        onUpload={(packId, file, note) => void packs.upload(packId, file, note).then((ok) => ok && setUploading(null))}
      />
      <HistoryDrawer
        pack={versionsOf ? (byId.get(versionsOf) ?? null) : null}
        isBusy={busy !== null}
        onClose={() => setVersionsOf(null)}
        onRollback={(pack, entry) => void packs.restore(pack, entry).then((ok) => ok && setVersionsOf(null))}
      />
    </>
  );
}

function Summary({ label, value, hint, tone = 'neutral' }: { label: string; value: string; hint: string; tone?: 'neutral' | 'amber' | 'blue' }) {
  const accent = tone === 'amber' ? 'text-amber-600' : tone === 'blue' ? 'text-sky-600' : 'text-slate-900';
  return (
    <Card className="px-5 py-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </Card>
  );
}
