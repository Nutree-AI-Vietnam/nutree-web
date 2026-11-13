'use client';

import { useState, type ReactNode } from 'react';
import { Badge, Button, Card, EmptyState, Icon, inputClass, type IconName } from '@/components/admin/ui/AdminUi';
import { packLabel } from '@/components/admin/data-packs/pack-meta';
import type { PackItem, PackItemListResponse } from '@/types/data-pack-admin';

export interface ItemColumn<T extends PackItem> {
  label: string;
  align?: 'right';
  render: (item: T) => ReactNode;
}

interface Props<T extends PackItem> {
  noun: { one: string; many: string };
  icon: IconName;
  packIds: readonly string[];
  packId: string;
  isPublished: boolean;
  data: PackItemListResponse<T> | null;
  isLoading: boolean;
  page: number;
  pageSize: number;
  columns: ItemColumn<T>[];
  onPackChange: (packId: string) => void;
  onSearch: (query: string) => void;
  onPage: (page: number) => void;
  onOpen: (item: T) => void;
  onAdd: () => void;
  onSetUp: () => void;
}

/** Search the rows of one pack (a language, or the one catalog) and open one to edit. */
export function ItemBrowser<T extends PackItem>({
  noun,
  icon,
  packIds,
  packId,
  isPublished,
  data,
  isLoading,
  page,
  pageSize,
  columns,
  onPackChange,
  onSearch,
  onPage,
  onOpen,
  onAdd,
  onSetUp,
}: Props<T>) {
  const [query, setQuery] = useState('');
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
        {packIds.length > 1 && (
          <select
            aria-label="Ngôn ngữ"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            value={packId}
            onChange={(event) => onPackChange(event.target.value)}
          >
            {packIds.map((id) => (
              <option key={id} value={id}>
                {packLabel(id)}
              </option>
            ))}
          </select>
        )}
        <form
          className="relative min-w-[220px] flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(query.trim());
          }}
        >
          <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            aria-label={`Tìm ${noun.many}`}
            className={`${inputClass} pl-9`}
            placeholder={`Tìm ${noun.many} theo tên rồi nhấn Enter`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        {data && <Badge>Phiên bản {data.version}</Badge>}
        <Button variant="primary" icon="plus" onClick={onAdd} disabled={!isPublished}>
          Thêm {noun.one}
        </Button>
      </div>

      {!isPublished ? (
        <EmptyState icon={icon} title={packIds.length > 1 ? `Chưa có ${noun.many} ${packLabel(packId)} ở đây` : `Chưa có ${noun.many} ở đây`}>
          <p>Hãy thiết lập ở tab “Phiên bản & phát hành” trước.</p>
          <Button size="sm" className="mt-3" onClick={onSetUp}>
            Tới Phiên bản & phát hành
          </Button>
        </EmptyState>
      ) : isLoading && !data ? (
        <EmptyState icon="refresh" title={`Đang tải ${noun.many}…`} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState icon="search" title={`Không có ${noun.many} phù hợp`} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  {columns.map((column) => (
                    <th key={column.label} className={`px-5 py-2.5 font-medium ${column.align === 'right' ? 'text-right' : ''}`}>
                      {column.label}
                    </th>
                  ))}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item) => (
                  <tr key={item.id} className="group cursor-pointer hover:bg-slate-50" onClick={() => onOpen(item)}>
                    {columns.map((column) => (
                      <td key={column.label} className={`px-5 py-3 ${column.align === 'right' ? 'text-right tabular-nums text-slate-600' : ''}`}>
                        {column.render(item)}
                      </td>
                    ))}
                    <td className="pr-4 text-slate-300 group-hover:text-slate-500">›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span>
              {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} / {total.toLocaleString('vi-VN')}
            </span>
            <div className="flex gap-2">
              <Button size="sm" disabled={page === 0} onClick={() => onPage(page - 1)}>
                Trước
              </Button>
              <Button size="sm" disabled={page + 1 >= pages} onClick={() => onPage(page + 1)}>
                Sau
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
