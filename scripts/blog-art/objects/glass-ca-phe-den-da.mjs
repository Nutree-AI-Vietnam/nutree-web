import { CUP } from '../kit.mjs';
import { icedCoffee } from '../food.mjs';

export const vessel = CUP;
export const description = 'A glass of Vietnamese black iced coffee (ca phe den da) with ice cubes and no milk';

export function draw() {
  // Black coffee is nearly opaque and very dark; the ice cubes show only where they touch the front.
  return icedCoffee({
    id: 'caPheDenDa',
    colors: ['#120804', '#24120A', '#3A2014'],
    surface: ['#5A3420', '#3A1E10', '#1E0E06'],
    cubeOpacity: 0.3,
  });
}
