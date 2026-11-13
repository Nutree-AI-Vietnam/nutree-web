'use client';

import { ContentPage } from '@/components/admin/data-packs/ContentPage';
import { FieldFormDrawer, type FormSection } from '@/components/admin/data-packs/FieldFormDrawer';
import { packIdsOf } from '@/components/admin/data-packs/pack-meta';
import { Badge } from '@/components/admin/ui/AdminUi';
import { KNOWN_DATA_PACKS, type PackItem, type PackSupplement } from '@/types/data-pack-admin';
import { SUPPLEMENT_FORMS } from '@/types/supplement-admin';

const SUPPLEMENT_PACKS = packIdsOf('supplements', KNOWN_DATA_PACKS);

const SECTIONS: FormSection[] = [
  {
    title: 'Product',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true, wide: true },
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'name_original', label: 'Name on the label', type: 'text', hint: 'If different, e.g. in English.' },
      { key: 'image_url', label: 'Photo URL', type: 'text', wide: true },
      { key: 'barcodes', label: 'Barcodes', type: 'list', hint: 'Separate several with commas.' },
    ],
  },
  {
    title: 'Dose',
    columns: 3,
    fields: [
      { key: 'form', label: 'Form', type: 'select', options: SUPPLEMENT_FORMS, required: true },
      { key: 'unit_label', label: 'Unit', type: 'text', required: true, hint: 'e.g. capsule, ml, scoop' },
      { key: 'units_per_serving', label: 'Units per serving', type: 'number', required: true },
    ],
  },
  {
    title: 'Nutrients per unit',
    fields: [{ key: 'nutrients_json', label: 'Amounts', type: 'amounts', hint: 'Keys like vitamin_d or epa_mg, as on the label.' }],
  },
  {
    title: 'Where it shows',
    fields: [
      { key: 'sold_in_vn', label: 'Sold in Vietnam', type: 'toggle', hint: 'Ranked first in search for Vietnamese users.' },
      { key: 'macro_bearing', label: 'Logs as food', type: 'toggle', hint: 'Protein powder, gainer or shake: logged as a meal, not a dose.' },
      { key: 'popular_rank', label: 'Popular list position', type: 'number', hint: 'Empty keeps it off the popular list.' },
    ],
  },
];

export function AdminSupplementCatalogPageClient() {
  return (
    <ContentPage<PackSupplement>
      current="/admin/supplement-catalog"
      title="Supplement catalog"
      description="The supplement catalog phones download for search, barcode lookup and the popular list. Edit a product here, or approve new ones in the review queue."
      icon="pill"
      packIds={SUPPLEMENT_PACKS}
      noun={{ one: 'product', many: 'products' }}
      packNoun="catalog"
      releases={{
        title: 'Catalog file',
        description: 'One catalog for every language. Test a change first, then release it to users from the PROD target.',
        unit: { one: 'catalog', many: 'catalogs' },
      }}
      columns={[
        {
          label: 'Product',
          render: (product) => (
            <div>
              <p className="font-medium text-slate-900">{product.name}</p>
              {product.brand && <p className="text-xs text-slate-400">{product.brand}</p>}
            </div>
          ),
        },
        { label: 'Form', render: (product) => <Badge>{product.form}</Badge> },
        {
          label: 'In Vietnam',
          render: (product) => (product.sold_in_vn ? <Badge tone="green">Sold in VN</Badge> : <span className="text-slate-300">—</span>),
        },
        { label: 'Barcodes', align: 'right', render: (product) => product.barcodes.length },
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
      editor={({ item, ...rest }) => (
        <FieldFormDrawer
          item={item}
          {...rest}
          title={(product: PackItem) => String(product.name ?? 'Product')}
          sections={SECTIONS}
          onSave={(product) => rest.onSave(product as PackSupplement)}
          onDelete={(product) => rest.onDelete(product as PackSupplement)}
        />
      )}
    />
  );
}
