import { CUP } from '../kit.mjs';
import { icedCoffee } from '../food.mjs';

export const vessel = CUP;
export const description = 'A glass of iced coffee not yet stirred: dark coffee on top of a thick layer of sweetened condensed milk';

export function draw() {
  // Before stirring, the condensed milk lies at the bottom in a thick creamy band under the dark coffee.
  return icedCoffee({
    id: 'caPheSuaDacChuaKhuay',
    colors: ['#160A04', '#2C160A', '#44261A'],
    surface: ['#5E3822', '#3E2012', '#200E06'],
    milkLayer: 120,
    cubeOpacity: 0.3,
  });
}
