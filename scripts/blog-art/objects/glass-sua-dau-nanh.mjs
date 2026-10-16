import { CUP, linear, n, radial } from '../kit.mjs';

export const vessel = CUP;
export const description = 'A glass of Vietnamese soy milk (sua dau nanh)';

export function draw() {
  // Filled nearly to the brim. Its creamy beige colour and the surface seen through the opening above the
  // front of the rim tell it apart from cow's milk.
  // The cup narrows from 139 at the rim (y 97) to 112 at y 494.
  const y = 111;
  const rx = 139 - (27 * (y - 97)) / 397;
  const ry = 0.28 * rx;
  const body = `M${n(200 - rx)},${y} A${n(rx)},${n(ry)} 0 0 1 ${n(200 + rx)},${y} L312,494 A112,31 0 0 1 88,494 Z`;
  // Soy milk is opaque and creamy beige, so it shades like a pale cylinder: bright down the lit left of centre, grey at the sides.
  const across = linear([200 - rx, 0], [200 + rx, 0], [
    [0, '#B79F74'],
    [0.08, '#D8C7A3'],
    [0.26, '#EFE3C8'],
    [0.42, '#F7EDD6'],
    [0.62, '#F1E6CC'],
    [0.86, '#D9C8A4'],
    [1, '#B19A70'],
  ]);
  const down = linear([0, y], [0, 525], [
    [0, '#F7EDD6', 0],
    [0.7, '#CDB88F', 0.25],
    [1, '#9E8660', 0.5],
  ]);
  const surface = radial({ center: [200 - rx * 0.3, y - ry * 0.3], radii: [rx * 1.3, ry * 1.3] }, [
    [0, '#FAF2DF'],
    [0.6, '#F2E7CE'],
    [1, '#DCCBA6'],
  ]);
  return [
    `<path d="${body}" fill="${across}"/>`,
    `<path d="${body}" fill="${down}"/>`,
    `<ellipse cx="200" cy="${y}" rx="${n(rx)}" ry="${n(ry)}" fill="${surface}"/>`,
    // The meniscus: soy milk creeping up the far wall catches the light; the near edge sits in a faint shadow.
    `<path d="M${n(200 - rx + 1)},${y} A${n(rx - 1)},${n(ry - 0.5)} 0 0 1 ${n(200 + rx - 1)},${y}" fill="none" stroke="#FFFFFF" stroke-width="4"/>`,
    `<path d="M${n(200 - rx + 3)},${y + 2} A${n(rx - 3)},${n(ry - 1.5)} 0 0 0 ${n(200 + rx - 3)},${y + 2}" fill="none" stroke="#B9A27A" stroke-opacity="0.7" stroke-width="3"/>`,
    `<ellipse cx="${n(200 - rx * 0.38)}" cy="${n(y - ry * 0.32)}" rx="${n(rx * 0.3)}" ry="${n(ry * 0.22)}" fill="#FFFFFF" fill-opacity="0.9"/>`,
  ].join('\n');
}
