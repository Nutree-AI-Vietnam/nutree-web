import { CUP, linear, n, radial } from '../kit.mjs';

export const vessel = CUP;
export const description = 'A glass of milk';

export function draw() {
  // Filled nearly to the brim. Behind the tinted glass white milk looks just like the empty glass, so the milk
  // reads by its surface, which shows untinted through the opening above the front of the rim.
  // The cup narrows from 139 at the rim (y 97) to 112 at y 494.
  const y = 111;
  const rx = 139 - (27 * (y - 97)) / 397;
  const ry = 0.28 * rx;
  const body = `M${n(200 - rx)},${y} A${n(rx)},${n(ry)} 0 0 1 ${n(200 + rx)},${y} L312,494 A112,31 0 0 1 88,494 Z`;
  // Milk is opaque, so it shades like a white cylinder: bright down the lit left of centre, grey at the sides.
  const across = linear([200 - rx, 0], [200 + rx, 0], [
    [0, '#A3B1B6'],
    [0.08, '#C9D3D7'],
    [0.26, '#F3F6F7'],
    [0.42, '#FFFFFF'],
    [0.62, '#F6F8F8'],
    [0.86, '#D2DADD'],
    [1, '#9FADB3'],
  ]);
  const down = linear([0, y], [0, 525], [
    [0, '#FFFFFF', 0],
    [0.7, '#C8D2D6', 0.25],
    [1, '#9AA9AF', 0.5],
  ]);
  const surface = radial({ center: [200 - rx * 0.3, y - ry * 0.3], radii: [rx * 1.3, ry * 1.3] }, [
    [0, '#FFFFFF'],
    [0.6, '#F5F7F8'],
    [1, '#DCE3E6'],
  ]);
  return [
    `<path d="${body}" fill="${across}"/>`,
    `<path d="${body}" fill="${down}"/>`,
    `<ellipse cx="200" cy="${y}" rx="${n(rx)}" ry="${n(ry)}" fill="${surface}"/>`,
    // The meniscus: milk creeping up the far wall catches the light; the near edge sits in a faint shadow.
    `<path d="M${n(200 - rx + 1)},${y} A${n(rx - 1)},${n(ry - 0.5)} 0 0 1 ${n(200 + rx - 1)},${y}" fill="none" stroke="#FFFFFF" stroke-width="4"/>`,
    `<path d="M${n(200 - rx + 3)},${y + 2} A${n(rx - 3)},${n(ry - 1.5)} 0 0 0 ${n(200 + rx - 3)},${y + 2}" fill="none" stroke="#AEBCC2" stroke-opacity="0.7" stroke-width="3"/>`,
    `<ellipse cx="${n(200 - rx * 0.38)}" cy="${n(y - ry * 0.32)}" rx="${n(rx * 0.3)}" ry="${n(ry * 0.22)}" fill="#FFFFFF" fill-opacity="0.9"/>`,
  ].join('\n');
}
