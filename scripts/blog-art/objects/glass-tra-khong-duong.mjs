import { CUP, linear, n, radial } from '../kit.mjs';

export const vessel = CUP;
export const description = 'A glass of clear unsweetened iced tea with ice cubes';

export function draw() {
  // Filled like the glass of milk tea, but clear amber: the tea lets the light through, so it is
  // brighter towards the bottom where the light gathers, and the ice cubes show through it.
  // The cup narrows from 139 at the rim (y 97) to 112 at y 494.
  const y = 124;
  const rx = 139 - (27 * (y - 97)) / 397;
  const ry = 0.28 * rx;
  const body = `M${n(200 - rx)},${y} A${n(rx)},${n(ry)} 0 0 1 ${n(200 + rx)},${y} L312,494 A112,31 0 0 1 88,494 Z`;
  const across = linear([200 - rx, 0], [200 + rx, 0], [
    [0, '#8A3E08'],
    [0.1, '#B8600E'],
    [0.3, '#D9821C'],
    [0.45, '#E8952A'],
    [0.65, '#D57E1A'],
    [0.88, '#AE560C'],
    [1, '#7E3606'],
  ]);
  const down = linear([0, y], [0, 525], [
    [0, '#5A2404', 0.25],
    [0.5, '#FFFFFF', 0],
    [1, '#F7C26A', 0.35],
  ]);
  const surface = radial({ center: [200 - rx * 0.3, y - ry * 0.3], radii: [rx * 1.3, ry * 1.3] }, [
    [0, '#F2B458'],
    [0.6, '#D98A2A'],
    [1, '#A85A12'],
  ]);

  // Ice cubes floating at the top and a couple sunk lower, seen through the tea: pale, see-through squares.
  const cube = (x, cy, s, angle, opacity) =>
    `<g transform="rotate(${angle} ${x} ${cy})">` +
    `<rect x="${n(x - s / 2)}" y="${n(cy - s / 2)}" width="${s}" height="${s}" rx="${n(s * 0.16)}" fill="#FFF4E0" fill-opacity="${opacity}" stroke="#FFFFFF" stroke-opacity="${n(opacity + 0.2)}" stroke-width="2.5"/>` +
    `<rect x="${n(x - s * 0.34)}" y="${n(cy - s * 0.36)}" width="${n(s * 0.36)}" height="${n(s * 0.14)}" rx="${n(s * 0.06)}" fill="#FFFFFF" fill-opacity="${n(opacity + 0.25)}"/>` +
    `</g>`;
  const cubes = [
    cube(150, 175, 70, -12, 0.42),
    cube(236, 168, 74, 14, 0.42),
    cube(190, 238, 68, 28, 0.32),
    cube(258, 290, 60, -20, 0.24),
    cube(138, 318, 58, 8, 0.2),
  ];
  // Tops of the floating cubes poking out of the surface.
  const tops = [
    `<path d="M128,${y - 4} L160,${y - 14} L184,${y - 2} L152,${y + 8} Z" fill="#FFF8EC" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="2"/>`,
    `<path d="M214,${y - 10} L250,${y - 16} L266,${y - 2} L230,${y + 4} Z" fill="#FFF8EC" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="2"/>`,
  ];

  return [
    `<path d="${body}" fill="${across}"/>`,
    `<path d="${body}" fill="${down}"/>`,
    `<clipPath id="teaBody"><path d="${body}"/></clipPath>`,
    `<g clip-path="url(#teaBody)">${cubes.join('')}</g>`,
    `<ellipse cx="200" cy="${y}" rx="${n(rx)}" ry="${n(ry)}" fill="${surface}"/>`,
    `<path d="M${n(200 - rx + 1)},${y} A${n(rx - 1)},${n(ry - 0.5)} 0 0 1 ${n(200 + rx - 1)},${y}" fill="none" stroke="#FFE6B8" stroke-width="4"/>`,
    `<path d="M${n(200 - rx + 3)},${y + 2} A${n(rx - 3)},${n(ry - 1.5)} 0 0 0 ${n(200 + rx - 3)},${y + 2}" fill="none" stroke="#8E4A12" stroke-opacity="0.6" stroke-width="3"/>`,
    tops.join('\n'),
  ].join('\n');
}
