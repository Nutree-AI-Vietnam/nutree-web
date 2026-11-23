'use client';

import { useState } from 'react';
import { Button, Drawer, Field, inputClass } from '@/components/admin/ui/AdminUi';
import type { MealCatalogUpdate } from '@/lib/mealtrack-admin-api';
import type { MealCatalogItem, MealType } from '@/types/meal-catalog';

const MEALS: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Sáng' },
  { value: 'lunch', label: 'Trưa' },
  { value: 'dinner', label: 'Tối' },
  { value: 'snack', label: 'Ăn vặt' },
];

interface Props {
  item: MealCatalogItem | null;
  isBusy: boolean;
  onClose: () => void;
  onSave: (item: MealCatalogItem, changes: MealCatalogUpdate) => void;
}

/** Display fields of one server catalog meal. Macros stay with the ingredients. */
export function MealCatalogEditor({ item, isBusy, onClose, onSave }: Props) {
  return item ? <Editor key={item.id} item={item} isBusy={isBusy} onClose={onClose} onSave={onSave} /> : null;
}

function Editor({
  item,
  isBusy,
  onClose,
  onSave,
}: Props & { item: MealCatalogItem }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? '');
  const [meals, setMeals] = useState<MealType[]>(item.meal_types);
  const [isActive, setIsActive] = useState(item.is_active);
  const [rank, setRank] = useState(item.popularity_rank == null ? '' : String(item.popularity_rank));
  const [imageUrl, setImageUrl] = useState(item.image_url ?? '');
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Món ăn cần một tên.');
      return;
    }
    if (meals.length === 0) {
      setError('Chọn ít nhất một bữa.');
      return;
    }
    const url = imageUrl.trim();
    if (url && !/^https?:\/\//.test(url)) {
      setError('Link ảnh phải bắt đầu bằng http:// hoặc https://.');
      return;
    }
    const popularity = rank.trim() === '' ? null : Number(rank);
    if (popularity !== null && (!Number.isInteger(popularity) || popularity < 0)) {
      setError('Vị trí phổ biến là một số từ 0 trở lên, hoặc để trống.');
      return;
    }
    setError(null);
    onSave(item, {
      name: trimmed,
      description: description.trim() || null,
      meal_types: meals,
      is_active: isActive,
      popularity_rank: popularity,
      image_url: url || null,
    });
  };

  return (
    <Drawer
      open
      width="max-w-xl"
      title={item.name}
      description="Sửa cách món hiện trên kế hoạch. Nhập lại file seed sau này có thể ghi đè tên, bữa ăn và nguyên liệu. Năng lượng vẫn tính từ nguyên liệu."
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary" icon="check" isBusy={isBusy} onClick={save}>
            Lưu
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <Field label="Tên">
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Mô tả">
          <textarea
            className={`${inputClass} h-24 py-2`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
        <fieldset>
          <legend className="mb-1 text-xs font-medium uppercase tracking-[0.08em] text-[#53635B]">Bữa ăn</legend>
          <div className="flex flex-wrap gap-2">
            {MEALS.map((meal) => {
              const on = meals.includes(meal.value);
              return (
                <button
                  key={meal.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setMeals((current) =>
                      on ? current.filter((value) => value !== meal.value) : [...current, meal.value]
                    )
                  }
                  className={`h-11 cursor-pointer border px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4336] ${on ? 'border-[#1B4336] bg-[#1B4336] text-[#F4F1EA]' : 'border-[#D5CFC3] text-[#3E4A43]'}`}
                >
                  {meal.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm text-[#1A2820]">
          <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          Đang dùng trong kế hoạch bữa ăn
        </label>
        <Field label="Vị trí phổ biến" hint="Để trống nếu không xếp hạng.">
          <input className={inputClass} inputMode="numeric" value={rank} onChange={(event) => setRank(event.target.value)} />
        </Field>
        <Field label="Link ảnh" hint="Để trống để bỏ ảnh. Tạo ảnh AI vẫn ở nút trên bảng.">
          <input className={inputClass} value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
        </Field>
        <p className="text-xs text-slate-500">
          {item.calories} kcal · Đạm {item.protein_g}g · Tinh bột {item.carbs_g}g · Béo {item.fat_g}g · {item.ingredient_count} nguyên liệu
        </p>
      </div>
    </Drawer>
  );
}
