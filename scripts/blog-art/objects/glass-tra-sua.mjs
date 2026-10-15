import { CUP, linear, n, radial } from '../kit.mjs';
import { tapiocaPearl } from '../food.mjs';

export const vessel = CUP;
export const description = 'A glass of milk tea with black tapioca pearls at the bottom and a wide straw';

export function draw() {
  // Filled like the glass of milk, in the beige of milk tea. The cup narrows from 139 at the rim (y 97) to 112 at y 494.
  const y = 118;
  const rx = 139 - (27 * (y - 97)) / 397;
  const ry = 0.28 * rx;
  const body = `M${n(200 - rx)},${y} A${n(rx)},${n(ry)} 0 0 1 ${n(200 + rx)},${y} L312,494 A112,31 0 0 1 88,494 Z`;
  const across = linear([200 - rx, 0], [200 + rx, 0], [
    [0, '#7A3A18'],
    [0.08, '#B05A28'],
    [0.28, '#D88A4E'],
    [0.42, '#E49A5C'],
    [0.62, '#DA8E52'],
    [0.86, '#B25E2C'],
    [1, '#743616'],
  ]);
  const down = linear([0, y], [0, 525], [
    [0, '#FFFFFF', 0],
    [0.7, '#A07A52', 0.2],
    [1, '#6E4E30', 0.45],
  ]);
  const surface = radial({ center: [200 - rx * 0.3, y - ry * 0.3], radii: [rx * 1.3, ry * 1.3] }, [
    [0, '#F0C894'],
    [0.6, '#E2B07A'],
    [1, '#C48E58'],
  ]);

  // Pearls settled at the bottom, pressed against the front wall: rows rising from the base, back to front.
  const pearls = [];
  const r = 17;
  for (let row = 0; row < 5; row++) {
    for (let k = 0; k < 9; k++) {
      const x = 104 + k * 24 + (row % 2) * 12 + Math.sin(row * 3 + k * 1.7) * 4;
      const dx = (x - 200) / 112;
      if (Math.abs(dx) > 0.92) continue;
      const floor = 494 + 31 * Math.sqrt(1 - dx * dx) - r * 0.9;
      const py = floor - row * 25 + Math.cos(row + k * 2.3) * 3;
      pearls.push([x, py]);
    }
  }
  pearls.sort((a, b) => a[1] - b[1]);
  const pearlSvg = pearls.map(([x, py]) => tapiocaPearl([x, py], { r, light: 0.6 + 0.4 * ((py - 380) / 140) })).join('');

  // A wide straw, standing in the pearls and leaning out over the rim to the right.
  const [bx, by] = [228, y + 6];
  const [tx, ty] = [292, 10];
  const strawFill = linear([bx - 16, 0], [bx + 16, 0], [
    [0, '#E07A92'],
    [0.35, '#FFC2D0'],
    [1, '#C24E6C'],
  ]);
  const straw = `M${bx - 15},${by} L${tx - 15},${ty + 4} A15,6 0 0 1 ${tx + 15},${ty - 4} L${bx + 15},${by} A15,6 0 0 1 ${bx - 15},${by} Z`;

  return [
    `<path d="${body}" fill="${across}"/>`,
    `<path d="${body}" fill="${down}"/>`,
    `<clipPath id="teaBody"><path d="${body}"/></clipPath>`,
    `<g clip-path="url(#teaBody)">${pearlSvg}</g>`,
    `<ellipse cx="200" cy="${y}" rx="${n(rx)}" ry="${n(ry)}" fill="${surface}"/>`,
    `<path d="M${n(200 - rx + 1)},${y} A${n(rx - 1)},${n(ry - 0.5)} 0 0 1 ${n(200 + rx - 1)},${y}" fill="none" stroke="#FFF6E8" stroke-width="4"/>`,
    `<path d="M${n(200 - rx + 3)},${y + 2} A${n(rx - 3)},${n(ry - 1.5)} 0 0 0 ${n(200 + rx - 3)},${y + 2}" fill="none" stroke="#A88560" stroke-opacity="0.7" stroke-width="3"/>`,
    `<ellipse cx="${bx}" cy="${by}" rx="19" ry="7" fill="#B8956C" fill-opacity="0.6"/>`,
    `<path d="${straw}" fill="${strawFill}"/>`,
    `<path d="M${bx - 8},${by - 4} L${tx - 8},${ty + 6}" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round"/>`,
    `<ellipse cx="${tx}" cy="${ty}" rx="15" ry="6" transform="rotate(-15 ${tx} ${ty})" fill="#8E2E48"/>`,
  ].join('\n');
}
