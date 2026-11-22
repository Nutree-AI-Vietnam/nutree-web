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
import { applyPackEdits, deletePackItem, fetchPackItems, savePackItem } from '@/lib/data-pack-admin-api';
import type { PackItem, PackItemListResponse } from '@/types/data-pack-admin';

const PAGE_SIZE = 25;

export interface EditorProps<T extends PackItem> {
  item: T | null;
  isNew: boolean;
  /** "thư viện Tiếng Việt · lưu sẽ tạo phiên bản 4 trên SIT" */
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
  /** What a pack is called: "thư viện", "cơ sở dữ liệu", "danh mục". */
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
  const [batching, setBatching] = useState(false);
  const [draftSaves, setDraftSaves] = useState<T[]>([]);
  const [draftDeletes, setDraftDeletes] = useState<string[]>([]);
  const latest = useRef(0);
  const pending = draftSaves.length + draftDeletes.length;

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
  const where = packs.isProd ? 'đã tới người dùng' : 'đang trên SIT';
  const name = packIds.length > 1 ? `${packNoun} ${packLabel(packId)}` : packLabel(packId);
  const discardDrafts = () => {
    setDraftSaves([]);
    setDraftDeletes([]);
  };
  const confirmDiscard = () => pending === 0 || window.confirm('Bỏ các sửa chưa phát hành?');
  const queueSave = (item: T) => {
    setDraftDeletes((current) => current.filter((id) => id !== item.id));
    setDraftSaves((current) => [...current.filter((row) => row.id !== item.id), item]);
    setEditing(null);
  };
  const queueDelete = (item: T) => {
    const onServer = items?.pack_id === packId && items.items.some((row) => row.id === item.id);
    setDraftSaves((current) => current.filter((row) => row.id !== item.id));
    if (onServer) {
      setDraftDeletes((current) => (current.includes(item.id) ? current : [...current, item.id]));
    }
    setEditing(null);
  };
  const change = async (verb: string, item: T, action: (token: string) => Promise<unknown>) => {
    const ok = await packs.run(packId, action, `${verb} “${itemName(item) || noun.one}”. Phiên bản ${base + 1} của ${name} ${where}.`);
    if (ok) setEditing(null);
  };
  const visibleItems = (() => {
    if (!items || items.pack_id !== packId) return null;
    const removed = new Set(draftDeletes);
    const saved = new Map(draftSaves.map((item) => [item.id, item]));
    const pageItems = items.items.filter((item) => !removed.has(item.id)).map((item) => saved.get(item.id) ?? item);
    const extras = draftSaves.filter((item) => !items.items.some((row) => row.id === item.id) && !removed.has(item.id));
    return { ...items, items: [...extras, ...pageItems] };
  })();
  const publishDraft = async () => {
    const ok = await packs.run(
      packId,
      (token) =>
        applyPackEdits(
          packId,
          { baseVersion: base, saves: draftSaves, deletes: draftDeletes },
          token,
          environment
        ),
      `Đã phát hành ${pending} thay đổi. Phiên bản ${base + 1} của ${name} ${where}.`
    );
    if (ok) discardDrafts();
  };

  return (
    <AdminPageShell
      admin={admin}
      current={current}
      title={title}
      description={description}
      actions={
        <Button icon="refresh" onClick={packs.reload} isBusy={packs.isLoading && !packs.error}>
          Làm mới
        </Button>
      }
      toolbar={
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'versions', label: 'Phiên bản & phát hành' },
            { value: 'edit', label: `Sửa ${noun.many}` },
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
            <AdminBanner tone={packs.message.tone} title={packs.message.tone === 'error' ? 'Không thực hiện được' : 'Đã lưu'} message={packs.message.text} />
          )}
          {loadError && <AdminBanner tone="error" title={`Không tải được ${noun.many}`} message={loadError} />}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={batching}
                onChange={(event) => {
                  if (!event.target.checked && !confirmDiscard()) return;
                  if (!event.target.checked) discardDrafts();
                  setBatching(event.target.checked);
                }}
              />
              Gom nhiều sửa thành một phiên bản
            </label>
            {batching && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{pending === 0 ? 'Chưa có thay đổi' : `${pending} thay đổi chưa phát hành`}</span>
                <Button size="sm" variant="primary" icon="rocket" disabled={pending === 0} isBusy={packs.busy !== null} onClick={() => void publishDraft()}>
                  Phát hành
                </Button>
              </div>
            )}
          </div>
          <ItemBrowser<T>
            noun={noun}
            icon={icon}
            packIds={packIds}
            packId={packId}
            isPublished={isPublished}
            data={visibleItems}
            isLoading={isLoadingItems || packs.isLoading}
            page={page}
            pageSize={PAGE_SIZE}
            columns={columns}
            onPackChange={(id) => {
              if (id === packId || !confirmDiscard()) return;
              discardDrafts();
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
        description: batching
          ? `${name} · lưu vào bản nháp, phát hành một lần khi xong`
          : `${name} · lưu sẽ tạo phiên bản ${base + 1} ${packs.isProd ? 'cho người dùng' : 'trên SIT'}`,
        isProd: packs.isProd,
        isBusy: packs.busy !== null,
        onClose: () => setEditing(null),
        onSave: (item) => (batching ? queueSave(item) : void change('Đã lưu', item, (token) => savePackItem(packId, item, base, token, environment))),
        onDelete: (item) => (batching ? queueDelete(item) : void change('Đã xoá', item, (token) => deletePackItem(packId, item.id, base, token, environment))),
      })}
    </AdminPageShell>
  );
}
