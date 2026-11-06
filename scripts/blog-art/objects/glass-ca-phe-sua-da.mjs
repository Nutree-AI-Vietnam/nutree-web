import { CUP } from '../kit.mjs';
import { icedCoffee } from '../food.mjs';

export const vessel = CUP;
export const description = 'A glass of Vietnamese iced milk coffee (ca phe sua da), stirred, with ice cubes';

export function draw() {
  // Coffee stirred with condensed milk turns an opaque caramel brown.
  return icedCoffee({
    id: 'caPheSuaDa',
    colors: ['#4A2410', '#7A4220', '#A8683A'],
    surface: ['#C89062', '#A86C3E', '#7A4620'],
  });
}
