'use client';

import { ContentPage } from '@/components/admin/data-packs/ContentPage';
import { FieldFormDrawer, type FormSection } from '@/components/admin/data-packs/FieldFormDrawer';
import { packIdsOf } from '@/components/admin/data-packs/pack-meta';
import { SupplementReviewPanel } from '@/components/admin/supplements/SupplementReviewPanel';
import { Badge } from '@/components/admin/ui/AdminUi';
import { KNOWN_DATA_PACKS, type PackItem, type PackSupplement } from '@/types/data-pack-admin';
import { SUPPLEMENT_FORMS } from '@/types/supplement-admin';

const SUPPLEMENT_PACKS = packIdsOf('supplements', KNOWN_DATA_PACKS);

const SECTIONS: FormSection[] = [
  {
    title: 'Sản phẩm',
    fields: [
      { key: 'name', label: 'Tên', type: 'text', required: true, wide: true },
      { key: 'brand', label: 'Thương hiệu', type: 'text' },
      { key: 'name_original', label: 'Tên in trên nhãn', type: 'text', hint: 'Nếu khác, VD tên tiếng Anh.' },
      { key: 'image_url', label: 'Link ảnh sản phẩm', type: 'text', wide: true },
      { key: 'barcodes', label: 'Mã vạch', type: 'list', hint: 'Nhiều mã thì cách nhau bằng dấu phẩy.' },
    ],
  },
  {
    title: 'Liều dùng',
    columns: 3,
    fields: [
      { key: 'form', label: 'Dạng', type: 'select', options: SUPPLEMENT_FORMS, required: true },
      { key: 'unit_label', label: 'Đơn vị', type: 'text', required: true, hint: 'VD: viên, ml, muỗng' },
      { key: 'units_per_serving', label: 'Số đơn vị mỗi lần dùng', type: 'number', required: true },
    ],
  },
  {
    title: 'Hoạt chất mỗi đơn vị',
    fields: [{ key: 'nutrients_json', label: 'Hàm lượng', type: 'amounts', hint: 'Tên như vitamin_d hay epa_mg, theo nhãn.' }],
  },
  {
    title: 'Hiển thị',
    fields: [
      { key: 'sold_in_vn', label: 'Có bán ở Việt Nam', type: 'toggle', hint: 'Ưu tiên lên đầu khi người dùng Việt Nam tìm kiếm.' },
      { key: 'macro_bearing', label: 'Ghi như thực phẩm', type: 'toggle', hint: 'Bột protein, sữa tăng cân, shake: ghi như bữa ăn, không phải liều dùng.' },
      { key: 'popular_rank', label: 'Vị trí trong mục Hay dùng', type: 'number', hint: 'Để trống thì không hiện trong Hay dùng.' },
    ],
  },
];

export function AdminSupplementCatalogPageClient() {
  return (
    <ContentPage<PackSupplement>
      current="/admin/supplement-catalog"
      title="Danh mục thực phẩm chức năng"
      description="Danh mục điện thoại tải về để tìm kiếm, quét mã vạch và mục Hay dùng. Ảnh chụp nhãn đạt yêu cầu của người dùng tự vào danh mục; sửa sản phẩm và xem mục đang chờ tại đây."
      icon="pill"
      packIds={SUPPLEMENT_PACKS}
      noun={{ one: 'sản phẩm', many: 'sản phẩm' }}
      packNoun="danh mục"
      releases={{
        title: 'File danh mục',
        description: 'Một danh mục cho mọi ngôn ngữ. Thử thay đổi trên SIT trước, rồi phát hành cho người dùng ở PROD.',
        unit: { one: 'danh mục', many: 'danh mục' },
      }}
      columns={[
        {
          label: 'Sản phẩm',
          render: (product) => (
            <div>
              <p className="font-medium text-slate-900">{product.name}</p>
              {product.brand && <p className="text-xs text-slate-400">{product.brand}</p>}
            </div>
          ),
        },
        { label: 'Dạng', render: (product) => <Badge>{product.form}</Badge> },
        {
          label: 'Ở Việt Nam',
          render: (product) => (product.sold_in_vn ? <Badge tone="green">Có bán ở VN</Badge> : <span className="text-slate-300">—</span>),
        },
        { label: 'Mã vạch', align: 'right', render: (product) => product.barcodes.length },
      ]}
      newItem={() =>
        ({
          id: crypto.randomUUID(),
          name: '',
          brand: null,
          form: 'capsule',
          unit_label: 'capsule',
          units_per_serving: 1,
          sold_in_vn: false,
          macro_bearing: false,
          nutrients_json: {},
          label_rows_json: [],
          barcodes: [],
          image_url: null,
          source: 'admin',
        }) as PackSupplement
      }
      itemName={(product) => product.name}
      extraTabs={[
        {
          value: 'review',
          label: 'Đang chờ',
          render: ({ admin, reloadReleases }) => <SupplementReviewPanel admin={admin} onCatalogChanged={reloadReleases} />,
        },
      ]}
      editor={({ item, ...rest }) => (
        <FieldFormDrawer
          item={item}
          {...rest}
          title={(product: PackItem) => String(product.name ?? 'Sản phẩm')}
          sections={SECTIONS}
          onSave={(product) => rest.onSave(product as PackSupplement)}
          onDelete={(product) => rest.onDelete(product as PackSupplement)}
        />
      )}
    />
  );
}
