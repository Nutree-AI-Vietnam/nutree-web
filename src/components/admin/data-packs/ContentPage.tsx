'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AdminBanner } from '@/components/admin/AdminBanner';
import { AdminPageShell, type AdminPageHref } from '@/components/admin/AdminPageShell';
import { ItemBrowser, type ItemColumn } from '@/components/admin/data-packs/ItemBrowser';
import { ReleaseWorkspace } from '@/components/admin/data-packs/ReleaseWorkspace';
import { packLabel } from '@/components/admin/data-packs/pack-meta';
import { Button, Tabs, type IconName } from '@/components/admin/ui/AdminUi';
import { adminErrorMessage, useAdminSession, type AdminSession } from '@/hooks/useAdminSession';
import { useDataPacks } from '@/hooks/useDataPacks';
import { deletePackItem, fetchPackItems, savePackItem } from '@/lib/data-pack-admin-api';
import type { PackItem, PackItemListResponse } from '@/types/data-pack-admin';

const PAGE_SIZE = 25;

export interface EditorProps<T extends PackItem> {
  item: T | null;
  isNew: boolean;
  /** "Vietnamese library · saving creates version 4 in testing" */
  description: string;
  isProd: boolean;
  isBusy: boolean;
  onClose: () => void;
  onSave: (item: T) => void;
  onDelete: (item: T) => void;
}

interface Props<T extends PackItem> {
  current: AdminPageHref;
  title: string;
  description: string;
  icon: IconName;
  packIds: readonly string[];
  /** The pack to open first, when it is published. */
  preferredPackId?: string;
  noun: { one: string; many: string };
  /** What a pack is called: "library", "database", "catalog". */
  packNoun: string;
  releases: { title: string; description: string; unit: { one: string; many: string } };
  columns: ItemColumn<T>[];
  newItem: () => T;
  itemName: (item: T) => string;
  editor: (props: EditorProps<T>) => ReactNode;
  /** More tabs after the two shared ones, e.g. the supplement review queue. */
  extraTabs?: {
    value: string;
    label: string;
    render: (context: { admin: AdminSession; reloadReleases: () => void }) => ReactNode;
  }[];
}

type Tab = string;

/**
 * The page every kind of content shares: "Versions & releases" to publish,
 * test and release files, and "Edit" to change single rows.
 */
export function ContentPage<T extends PackItem>(props: Props<T>) {
  const { current, title, description, icon, packIds, preferredPackId, noun, packNoun, releases, columns, newItem, itemName, editor, extraTabs = [] } = props;
  const [tab, setTab] = useState<Tab>('versions');
  // ?tab=review and the like open a tab directly (old links redirect here).
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('tab');
    if (wanted && (wanted === 'edit' || extraTabs.some((extra) => extra.value === wanted))) setTab(wanted);
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  const admin = useAdminSession({ onReload: reload });
  const packs = useDataPacks(admin, reloadKey);
  const { environment, getValidToken, isPreviewMode, session } = admin;

  const [packId, setPackId] = useState(preferredPackId ?? packIds[0]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<PackItemListResponse<T> | null>(null);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ item: T; isNew: boolean } | null>(null);
  const latest = useRef(0);

  const isPublished = Boolean(packs.byId.get(packId)?.current);
  useEffect(() => {
    if (packs.isLoading || packs.byId.get(packId)?.current) return;
    const first = packIds.find((id) => packs.byId.get(id)?.current);
    if (first) setPackId(first);
  }, [packs.isLoading, packs.byId, packId, packIds]);

  useEffect(() => {
    if (tab !== 'edit' || isPreviewMode || !session || !isPublished) return;
    const request = ++latest.current;
    setIsLoadingItems(true);
    setLoadError(null);
    (async () => {
      try {
        const response = await fetchPackItems<T>(packId, { q: query, offset: page * PAGE_SIZE, limit: PAGE_SIZE }, await getValidToken(), environment);
        if (request === latest.current) setItems(response);
      } catch (requestError) {
        if (request === latest.current) setLoadError(adminErrorMessage(requestError));
      } finally {
        if (request === latest.current) setIsLoadingItems(false);
      }
    })();
  }, [tab, environment, getValidToken, isPreviewMode, session, packId, isPublished, query, page, reloadKey, packs.data]);

  const base = items?.pack_id === packId ? items.version : packs.versionOf(packId);
  const where = packs.isProd ? 'live for users' : 'in testing';
  const name = packIds.length > 1 ? `${packLabel(packId)} ${packNoun}` : packLabel(packId);
  const change = async (verb: string, item: T, action: (token: string) => Promise<unknown>) => {
    const ok = await packs.run(packId, action, `${verb} “${itemName(item) || noun.one}”. ${name} version ${base + 1} is now ${where}.`);
    if (ok) setEditing(null);
  };

  return (
    <AdminPageShell
      admin={admin}
      current={current}
      title={title}
      description={description}
      actions={
        <Button icon="refresh" onClick={packs.reload} isBusy={packs.isLoading && !packs.error}>
          Refresh
        </Button>
      }
      toolbar={
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'versions', label: 'Versions & releases' },
            { value: 'edit', label: `Edit ${noun.many}` },
            ...extraTabs.map(({ value, label }) => ({ value, label })),
          ]}
        />
      }
    >
      {extraTabs.find((extra) => extra.value === tab)?.render({ admin, reloadReleases: packs.reload }) ??
        (tab === 'versions' ? (
        <ReleaseWorkspace packs={packs} packIds={packIds} icon={icon} title={releases.title} description={releases.description} unit={releases.unit} />
      ) : (
        <>
          {packs.message && (
            <AdminBanner tone={packs.message.tone} title={packs.message.tone === 'error' ? 'That did not work' : 'Saved'} message={packs.message.text} />
          )}
          {loadError && <AdminBanner tone="error" title={`Could not load ${noun.many}`} message={loadError} />}
          <ItemBrowser<T>
            noun={noun}
            icon={icon}
            packIds={packIds}
            packId={packId}
            isPublished={isPublished}
            data={items?.pack_id === packId ? items : null}
            isLoading={isLoadingItems || packs.isLoading}
            page={page}
            pageSize={PAGE_SIZE}
            columns={columns}
            onPackChange={(id) => {
              setPackId(id);
              setPage(0);
              setItems(null);
            }}
            onSearch={(value) => {
              setQuery(value);
              setPage(0);
            }}
            onPage={setPage}
            onOpen={(item) => setEditing({ item, isNew: false })}
            onAdd={() => setEditing({ item: newItem(), isNew: true })}
            onSetUp={() => setTab('versions')}
          />
        </>
      ))}

      {editor({
        item: editing?.item ?? null,
        isNew: editing?.isNew ?? false,
        description: `${name} · saving creates version ${base + 1} ${packs.isProd ? 'for users' : 'in testing'}`,
        isProd: packs.isProd,
        isBusy: packs.busy !== null,
        onClose: () => setEditing(null),
        onSave: (item) => void change('Saved', item, (token) => savePackItem(packId, item, base, token, environment)),
        onDelete: (item) => void change('Removed', item, (token) => deletePackItem(packId, item.id, base, token, environment)),
      })}
    </AdminPageShell>
  );
}
