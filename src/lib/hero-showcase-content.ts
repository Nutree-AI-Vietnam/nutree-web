import type { Locale } from './translations';

interface HeroMacro {
  label: string;
  grams: number;
  color: string;
}

export interface HeroShowcaseContent {
  mealImage: string;
  mealName: string;
  mealEnergy: string;
  consumed: number;
  target: number;
  remaining: string;
  macros: HeroMacro[];
}

// Macro colours match the in-app rings and chips.
const PROTEIN = '#FD9067';
const CARBS = '#6FCCC1';
const FAT = '#FDB628';

// Figures mirror each locale's dashboard screenshot so the overlay agrees with the phone behind it.
export const HERO_SHOWCASE: Record<Locale, HeroShowcaseContent> = {
  vi: {
    mealImage: '/images/hero/meal-cha-gio.webp',
    mealName: 'Chả giò chiên rau củ',
    mealEnergy: '851 kcal',
    consumed: 851,
    target: 3688,
    remaining: 'Còn 2837 kcal',
    macros: [
      { label: 'Đạm', grams: 37, color: PROTEIN },
      { label: 'Tinh bột', grams: 70, color: CARBS },
      { label: 'Béo', grams: 47, color: FAT },
    ],
  },
  en: {
    mealImage: '/images/hero/meal-sashimi.webp',
    mealName: 'Assorted Sashimi Platter',
    mealEnergy: '557 cal',
    consumed: 557,
    target: 2516,
    remaining: '1959 kcal left',
    macros: [
      { label: 'Protein', grams: 87, color: PROTEIN },
      { label: 'Carbs', grams: 5, color: CARBS },
      { label: 'Fat', grams: 21, color: FAT },
    ],
  },
};
