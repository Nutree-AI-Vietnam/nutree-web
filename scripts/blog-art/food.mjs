// Food parts shared by the recipes in objects/. A part returns a piece ({ depth, svg }) to draw back
// to front with inOrder(), or SVG to add to a vessel's contents directly. Reuse these before drawing
// a new part, and add new parts here so later recipes can use them.
import {
  LIGHT,
  LIGHT_2D,
  add,
  blob,
  blur,
  bounds,
  clipTo,
  define,
  ellipsePoints,
  frame,
  frameOf,
  lightOn,
  linear,
  mix,
  n,
  nearness,
  norm,
  openPath,
  pathOf,
  project,
  rad,
  radial,
  scale,
  slab,
  softShadow,
  tilt,
  tone,
  turn,
  uid,
  underside,
} from './kit.mjs';

// ---------- helpers ----------
/** An ellipse lying on a frame, centred at [p, q] with radii [a, b], turned by angle degrees. */
export function discOn(at, [cp, cq], [a, b], angle = 0, count = 28) {
  const c = Math.cos(rad(angle));
  const s = Math.sin(rad(angle));
  return pathOf(ellipsePoints(a, b, count).map(([x, y]) => at(cp + x * c - y * s, cq + x * s + y * c)));
}

/** A rounded lump seen through the glass of a bowl: an ellipse in one colour with a small shine. */
export function lump([x, y], { rx, ry, angle = 0, color, shine = 0.35 }) {
  const m = Math.min(rx, ry);
  const sx = x + LIGHT_2D[0] * m * 0.4;
  const sy = y + LIGHT_2D[1] * m * 0.4;
  return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" transform="rotate(${n(angle)} ${n(x)} ${n(y)})" fill="${color}" stroke="#1E140A" stroke-opacity="0.14" stroke-width="0.8"/><ellipse cx="${n(sx)}" cy="${n(sy)}" rx="${n(m * 0.45)}" ry="${n(m * 0.25)}" transform="rotate(${n(angle)} ${n(sx)} ${n(sy)})" fill="#FFFFFF" fill-opacity="${shine}"/>`;
}

// ---------- inside a bowl ----------
/**
 * The food packed below a bowl's rim, seen through its wall: a fill from the rim to the bottom and
 * pieces scattered over it. piece(rand, [x, y], light) returns SVG; light runs from 1 at the rim to 0
 * at the bottom. sorted draws the pieces top to bottom, for pieces big enough to overlap.
 */
export function bowlInside(rand, { colors, count, piece, sorted = false }) {
  const fill = linear([0, 200], [0, 420], [
    [0, colors[0]],
    [1, colors[1]],
  ]);
  const clip = uid();
  define(`<clipPath id="${clip}"><use href="#interior"/></clipPath>`);
  const spots = Array.from({ length: count }, () => [rand.range(62, 578), rand.range(214, 424)]);
  if (sorted) spots.sort((a, b) => a[1] - b[1]);
  const pieces = spots.map((at) => piece(rand, at, 1 - (at[1] - 214) / 210));
  return `<use href="#interior" fill="${fill}"/>\n<g clip-path="url(#${clip})">\n${pieces.join('\n')}\n</g>`;
}

/** The fill under a heap of pieces, so gaps between them read as shadow. */
export function heapBed(origin, mound, [light, mid, dark]) {
  const top = project(origin, [0, mound.height, 0])[1];
  const fill = radial({ center: [origin[0] - 0.3 * mound.rx, top], radii: [1.4 * mound.rx, 1.4 * mound.rx] }, [
    [0, light],
    [0.6, mid],
    [1, dark],
  ]);
  return `<path d="${mound.outline(origin)}" fill="${fill}"/>`;
}

// ---------- rice ----------
const RICE = ['#FFFDF7', '#B5B4A0'];

/** Three looks of a rice grain, by how much light it catches. Each <use> sets the grain's colour. */
function grainKinds({ length = 7, width = 3.1 } = {}) {
  const kinds = { lit: uid(), mid: uid(), dim: uid() };
  const body = (opacity) =>
    `<ellipse rx="${length}" ry="${width}" stroke="#6D6448" stroke-opacity="${opacity}" stroke-width="0.7"/>`;
  const shine = (size, height, opacity) =>
    `<ellipse cx="${n(-length * 0.11)}" cy="${n(-width * 0.39)}" rx="${n(length * size)}" ry="${n(width * height)}" fill="#FFFFFF" fill-opacity="${opacity}"/>`;
  define(`<g id="${kinds.lit}">${body(0.13)}${shine(0.63, 0.29, 0.85)}</g>`);
  define(`<g id="${kinds.mid}">${body(0.13)}${shine(0.6, 0.26, 0.45)}</g>`);
  define(`<g id="${kinds.dim}">${body(0.15)}</g>`);
  return kinds;
}

/** A grain at a screen point, turned so its shine faces the light. */
function grainAt(rand, kinds, [x, y], color, glow) {
  let angle = rand.range(0, 180);
  if (Math.sin(rad(angle)) * LIGHT[0] - Math.cos(rad(angle)) * LIGHT[1] < 0) angle += 180;
  const kind = glow > 0.6 ? kinds.lit : glow > 0.32 ? kinds.mid : kinds.dim;
  return `<use href="#${kind}" transform="translate(${Math.round(x)} ${Math.round(y)}) rotate(${Math.round(angle)})" fill="${color}"/>`;
}

/** Grains of rice heaped on a mound (see heap() in kit.mjs). grain sets { length, width }. */
export function riceHeap(rand, origin, mound, { count, grain }) {
  const kinds = grainKinds(grain);
  const top = project(origin, [0, mound.height, 0])[1];
  const fill = radial({ center: [origin[0] - 0.32 * mound.rx, top + 0.07 * mound.rx], radii: [1.43 * mound.rx, 1.43 * mound.rx] }, [
    [0, '#F4F0E6'],
    [0.6, '#DCD6C6'],
    [1, '#B4B09C'],
  ]);
  const grains = mound.scatter(origin, rand, count).map((p) => {
    const { diffuse, spec } = lightOn(p.normal);
    const light = diffuse * (0.8 + 0.2 * Math.sqrt(p.rise));
    return grainAt(rand, kinds, p.screen, tone(RICE, light + rand.range(-0.05, 0.05), spec * 0.2), light + spec);
  });
  return `<path d="${mound.outline(origin)}" fill="${fill}"/>\n${grains.join('\n')}`;
}

/** Rice packed below a bowl's rim. */
export function riceInside(rand, count = 900) {
  const kinds = grainKinds();
  return bowlInside(rand, {
    colors: ['#E9E4D6', '#CBC5B0'],
    count,
    piece: (rand, at, depth) => {
      const light = 0.32 + 0.3 * depth + rand.range(-0.08, 0.08);
      return grainAt(rand, kinds, at, tone(['#FFFDF7', '#ABA894'], light), light - 0.2);
    },
  });
}

// ---------- leaves ----------
export const GREENS = {
  lettuce: { top: ['#CFEC80', '#5A9628'], side: ['#A6D35E', '#3D7020'] },
  romaine: { top: ['#95D054', '#2D6A1A'], side: ['#74B03E', '#22501A'] },
  spinach: { top: ['#66AA46', '#1C4614'], side: ['#4E8C35', '#163A10'] },
};

/** A leaf cupped along its midrib, which runs along the frame's u. Returns its two halves. */
export function leaf(origin, fr, { length, width, fold = 20, greens = GREENS.lettuce, ruffle = 0.1, phase = 0, thick = 2.5 }) {
  const steps = 20;
  const halfWidth = (t) => (width / 2) * Math.pow(Math.sin(Math.PI * t), 0.75);
  const edge = (sign) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps;
      const wave = 1 + ruffle * Math.sin(t * Math.PI * 9 + phase + (sign > 0 ? 0 : 2));
      return [length * (t - 0.5), sign * halfWidth(t) * wave];
    });
  const vein = mix(greens.top[0], '#FFFFFF', 0.35);
  return [1, -1].map((sign) => {
    const w = add(scale(fr.w, Math.cos(rad(fold))), scale(fr.v, -sign * Math.sin(rad(fold))));
    const half = frameOf(fr.origin, fr.u, w);
    const piece = slab(origin, half, edge(sign), thick, {
      top: greens.top,
      side: greens.side,
      gloss: 0.6,
      bevel: 2,
      rim: 0.4,
      rimShade: 0.25,
      shadow: { opacity: 0.28, color: '#10260A' },
      decorate: ({ project: at }) => {
        let svg = `<path d="${openPath([at(-length * 0.48, 0), at(length * 0.48, 0)])}" fill="none" stroke="${vein}" stroke-opacity="0.8" stroke-width="2.4"/>`;
        for (let k = 1; k <= 5; k++) {
          const t = k / 6;
          const p = length * (t - 0.5);
          const reach = halfWidth(t) * 0.85;
          svg += `<path d="${openPath([at(p, 0), at(p + reach * 0.7, sign * reach)])}" fill="none" stroke="${vein}" stroke-opacity="0.45" stroke-width="1.2"/>`;
        }
        return svg;
      },
    });
    return { ...piece, depth: nearness(half.at(0, (sign * width) / 4)) };
  });
}

/** Salad leaves covering a mound: a dark bed to fill the gaps, and the leaves as pieces. */
export function leafBed(rand, origin, mound, { count, size = 1, kinds = Object.keys(GREENS), lean = 0.35 }) {
  const bed = heapBed(origin, mound, ['#5E9E3A', '#2F6A22', '#173E12']);
  const pieces = mound.scatter(origin, rand, count).flatMap((p) => {
    let normal = norm(add(tilt(rand, p.normal, 30), [0, 0, lean]));
    // A leaf seen edge on reads as a stray line, so turn those toward the viewer.
    if (turn(normal)[2] < 0.35) normal = norm(add(p.normal, [0, 0, 0.6]));
    const at = add(p.point, scale(p.normal, rand.range(2, 9)));
    return leaf(origin, frame(at, normal, rand.range(0, 360)), {
      length: size * rand.range(85, 125),
      width: size * rand.range(50, 72),
      fold: rand.range(10, 30),
      greens: GREENS[rand.pick(kinds)],
      phase: rand.range(0, 6),
    });
  });
  return { bed, pieces };
}

/** Leaves packed below a bowl's rim. */
export function leavesInside(rand, count = 140) {
  return bowlInside(rand, {
    colors: ['#4F8E33', '#173E12'],
    count,
    piece: (rand, [x, y], depth) => {
      const length = rand.range(40, 80);
      const width = length * rand.range(0.35, 0.5);
      const greens = GREENS[rand.pick(Object.keys(GREENS))];
      const body = tone(greens.top, 0.25 + 0.55 * depth + rand.range(-0.1, 0.1));
      const vein = mix(body, '#FFFFFF', 0.25);
      return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(rand.range(0, 180))})"><path d="M${n(-length / 2)},0 Q0,${n(-width)} ${n(length / 2)},0 Q0,${n(width)} ${n(-length / 2)},0Z" fill="${body}" stroke="#0E2A0A" stroke-opacity="0.25" stroke-width="1"/><path d="M${n(-length * 0.45)},0 L${n(length * 0.45)},0" stroke="${vein}" stroke-opacity="0.6" stroke-width="1.4"/></g>`;
    },
  });
}

// ---------- meat and fish ----------
/** A slice of grilled chicken breast, its length along the frame's u. */
export function chickenSlice(origin, fr, { length, width, thick, bend = 0.08 }) {
  const outline = Array.from({ length: 40 }, (_, i) => {
    const t = (2 * Math.PI * i) / 40;
    const p = (length / 2) * Math.sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), 0.55);
    const q = (width / 2) * Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), 0.7);
    return [p, q + bend * width * (1 - Math.pow((2 * p) / length, 2))];
  });
  return slab(origin, fr, outline, thick, {
    top: ['#F4B867', '#8A4214'],
    side: ['#FBF0DC', '#C9A174'],
    gloss: 0.6,
    bevel: 4,
    rim: 0.5,
    rimShade: 0.45,
    shadow: { opacity: 0.35 },
    decorate: ({ project: at, top }) => {
      const stripes = [];
      for (let k = -3; k <= 3; k++) stripes.push([at(k * 22 - width * 0.5, -width * 0.8), at(k * 22 + width * 0.5, width * 0.8)]);
      const lines = stripes.map((line) => `<path d="${openPath(line)}"/>`).join('');
      const box = bounds(top);
      return `<path d="${pathOf(top)}" fill="none" stroke="#7A3A0E" stroke-opacity="0.5" stroke-width="12" filter="${blur(4, box)}"/><g fill="none" stroke="#3A1604" stroke-opacity="0.75" stroke-width="5" stroke-linecap="round" filter="${blur(0.9, bounds(stripes.flat()))}">${lines}</g>`;
    },
  });
}

/** A baked salmon fillet, its length along u, narrowing toward the tail at -u. */
export function salmonFillet(origin, fr, { length = 250, width = 118, thick = 40 } = {}) {
  const outline = Array.from({ length: 56 }, (_, i) => {
    const t = (2 * Math.PI * i) / 56;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const p = (length / 2) * Math.sign(c) * Math.pow(Math.abs(c), 0.45);
    const q = (width / 2) * Math.sign(s) * Math.pow(Math.abs(s), 0.6) * (0.84 + 0.16 * ((2 * p) / length));
    return [p, q];
  });
  return slab(origin, fr, outline, thick, {
    top: ['#FFA672', '#C2502A'],
    side: ['#FFB693', '#D2633A'],
    gloss: 0.8,
    bevel: 5,
    rim: 0.55,
    rimShade: 0.35,
    shadow: { opacity: 0.35 },
    decorate: ({ project: at, top }) => {
      const box = bounds(top);
      let lines = '';
      for (let k = -5; k <= 5; k++) {
        const p = (k * length) / 12;
        lines += `<path d="${openPath([at(p - 12, -width / 2), at(p + 8, 0), at(p - 12, width / 2)])}"/>`;
      }
      const c = at(length * 0.05, 0);
      const sear = radial({ center: c, radii: [length * 0.45, width * 0.4] }, [
        [0, '#8A3A12', 0.4],
        [1, '#8A3A12', 0],
      ]);
      return `<g fill="none" stroke="#FFF1E6" stroke-opacity="0.6" stroke-width="3.2" stroke-linejoin="round" filter="${blur(0.7, box)}">${lines}</g><path d="${pathOf(top)}" fill="${sear}"/>`;
    },
    sideDecorate: ({ top, moved }) => {
      let lines = '';
      for (let i = 0; i < top.length; i += 4) lines += `<path d="${openPath([top[i], moved[i]])}"/>`;
      return `<g stroke="#FFF1E6" stroke-opacity="0.5" stroke-width="2.6">${lines}</g>`;
    },
  });
}

/** A grilled pork chop with a sticky caramel glaze (sườn nướng), its length along u. */
export function porkChop(origin, fr, { length = 220, width = 124, thick = 13 } = {}) {
  const outline = Array.from({ length: 56 }, (_, i) => {
    const t = (2 * Math.PI * i) / 56;
    const k = 1 + 0.06 * Math.sin(2 * t + 1) + 0.035 * Math.sin(5 * t);
    return [(length / 2) * k * Math.cos(t), (width / 2) * k * Math.sin(t) * (0.86 + 0.14 * Math.cos(t))];
  });
  return slab(origin, fr, outline, thick, {
    top: ['#E39A50', '#6A2606'],
    side: ['#B4642C', '#4A1804'],
    gloss: 1.2,
    bevel: 4,
    rim: 0.55,
    rimShade: 0.45,
    shadow: { opacity: 0.4 },
    decorate: ({ project: at, top }) => {
      const box = bounds(top);
      const stripes = [];
      for (let k = -4; k <= 4; k++) stripes.push([at(k * 27 - width * 0.35, -width * 0.7), at(k * 27 + width * 0.35, width * 0.7)]);
      const lines = stripes.map((line) => `<path d="${openPath(line)}"/>`).join('');
      // The glaze catches the light in streaks along the char lines.
      const glints = stripes
        .filter((_, k) => k % 2 === 0)
        .map(([a, b]) => `<path d="${openPath([[a[0] * 0.6 + b[0] * 0.4, a[1] * 0.6 + b[1] * 0.4], [a[0] * 0.4 + b[0] * 0.6, a[1] * 0.4 + b[1] * 0.6]])}"/>`)
        .join('');
      return (
        `<path d="${pathOf(top)}" fill="none" stroke="#3A1004" stroke-opacity="0.55" stroke-width="22" filter="${blur(7, box)}"/>` +
        `<g fill="none" stroke="#2A0A02" stroke-opacity="0.6" stroke-width="7" stroke-linecap="round" filter="${blur(1.6, box)}">${lines}</g>` +
        `<g transform="translate(-6 -3)" fill="none" stroke="#FFE2B8" stroke-opacity="0.55" stroke-width="2.4" stroke-linecap="round" filter="${blur(0.8, box)}">${glints}</g>`
      );
    },
  });
}

// ---------- eggs ----------
export const EGGSHELL = { brown: ['#F8E6CE', '#A9774C'], white: ['#FFFFFF', '#BDB6AA'] };

/** A whole egg in its shell, its length along u. */
export function egg(origin, fr, { length = 70, shell = EGGSHELL.brown } = {}) {
  return blob(origin, fr, [length / 2, length * 0.39, length * 0.39], {
    colors: shell,
    gloss: 0.45,
    shine: 0.3,
    rimLight: 0.42,
    matte: true,
    shadow: { opacity: 0.32 },
  });
}

/** Half a boiled egg, cut face up on the frame, its length along u. */
export function eggHalf(origin, fr, { length = 72, width = 54, depth = 25 } = {}) {
  const outline = ellipsePoints(length / 2, width / 2, 48);
  const back = underside(origin, fr, outline, depth);
  const box = bounds(back);
  const d = pathOf(back);
  const c = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2];
  const r = Math.max(box[2] - box[0], box[3] - box[1]) / 2;
  const backFill = linear([c[0] + LIGHT_2D[0] * r, c[1] + LIGHT_2D[1] * r], [c[0] - LIGHT_2D[0] * r, c[1] - LIGHT_2D[1] * r], [
    [0, '#FFFFFF'],
    [0.55, '#EEEAE0'],
    [1, '#B9B2A2'],
  ]);
  const face = slab(origin, fr, outline, 0.6, {
    top: ['#FFFFFF', '#EAE6DC'],
    side: ['#FFFFFF', '#DDD8CC'],
    shadow: false,
    bevel: 3,
    rim: 0.9,
    rimShade: 0.18,
    gloss: 0.3,
  });
  const yolk = blob(
    origin,
    frameOf(fr.at(length * 0.03, 0, 0), fr.u, fr.w),
    [length * 0.22, width * 0.29, 6],
    { colors: ['#FFD25A', '#E58A00'], gloss: 0.45, shine: 0.3, rimLight: 0.55, shadow: false },
    { half: true },
  );
  const shadow = softShadow(d, box, { dx: 3, dy: 5, opacity: 0.32, blur: 4 });
  return { depth: nearness(fr.origin), svg: `${shadow}<path d="${d}" fill="${backFill}"/>${face.svg}${yolk.svg}` };
}

/** A fried egg (ốp la): a wavy white with crisp brown edges and a domed yolk. */
export function friedEgg(origin, fr, { r = 64 } = {}) {
  const outline = Array.from({ length: 64 }, (_, i) => {
    const t = (2 * Math.PI * i) / 64;
    const k = 1 + 0.09 * Math.sin(3 * t + 0.5) + 0.05 * Math.sin(7 * t + 2) + 0.03 * Math.sin(11 * t);
    return [r * k * Math.cos(t), r * k * 0.9 * Math.sin(t)];
  });
  const white = slab(origin, fr, outline, 4, {
    top: ['#FFFFFF', '#ECE6DA'],
    side: ['#F4ECDC', '#C9B898'],
    gloss: 0.8,
    bevel: 3,
    rim: 0.8,
    rimShade: 0.25,
    shadow: { opacity: 0.25 },
    decorate: ({ top }) =>
      `<path d="${pathOf(top)}" fill="none" stroke="#B0662A" stroke-opacity="0.75" stroke-width="11" filter="${blur(3, bounds(top))}"/>`,
  });
  const yolk = blob(
    origin,
    frameOf(fr.at(r * 0.08, -r * 0.05, 1), fr.u, fr.w),
    [r * 0.34, r * 0.32, r * 0.2],
    { colors: ['#FFC63D', '#DD7400'], gloss: 0.85, shine: 0.25, rimLight: 0.5, shadow: { opacity: 0.25, blur: 3 } },
    { half: true },
  );
  return { depth: nearness(fr.origin), svg: white.svg + yolk.svg };
}

// ---------- fruit and vegetables ----------
/** A cherry tomato sitting at a world point. */
export function cherryTomato(origin, at, { r = 20, spin = 0, calyx = false } = {}) {
  const fr = frame(at, [0, 1, 0], spin);
  const star = () => {
    const points = [];
    for (let k = 0; k < 10; k++) {
      const a = (Math.PI * k) / 5;
      const reach = k % 2 ? 0.16 * r : 0.62 * r;
      points.push(project(origin, fr.at(Math.cos(a) * reach, Math.sin(a) * reach, r * (k % 2 ? 0.9 : 0.72))));
    }
    const stem = project(origin, fr.at(0, 0, r * 0.92));
    return `<path d="${pathOf(points)}" fill="#5E9E2E" stroke="#2F5E16" stroke-opacity="0.6" stroke-width="0.8"/><circle cx="${n(stem[0])}" cy="${n(stem[1])}" r="${n(r * 0.12)}" fill="#3F6E1E"/>`;
  };
  return blob(origin, fr, [r * 1.04, r, r * 0.9], {
    colors: ['#FF6B57', '#A51B12'],
    gloss: 0.9,
    shine: 0.2,
    rimLight: 0.35,
    decorate: calyx ? star : undefined,
  });
}

/** A round slice: rings of colour from the skin in, then details(at) on top. */
function roundSlice(origin, fr, { r, thick, top, side, rings, details = () => '' }) {
  return slab(origin, fr, ellipsePoints(r, r, 48), thick, {
    top,
    side,
    gloss: 0.7,
    bevel: 1.6,
    rim: 0.7,
    rimShade: 0.25,
    shadow: { opacity: 0.28 },
    decorate: ({ project: at }) =>
      rings.map(([s, color]) => `<path d="${discOn(at, [0, 0], [r * s, r * s], 0, 48)}" fill="${color}"/>`).join('') + details(at),
  });
}

/** A lemon slice. */
export function lemonSlice(origin, fr, { r = 40, thick = 7 } = {}) {
  return roundSlice(origin, fr, {
    r,
    thick,
    top: ['#FFF3A6', '#E0BE30'],
    side: ['#FFD83A', '#C49400'],
    rings: [
      [1, '#F5C11A'],
      [0.9, '#FFFBE8'],
      [0.83, '#FFE45C'],
    ],
    details: (at) => {
      let lines = '';
      for (let k = 0; k < 10; k++) {
        const a = (2 * Math.PI * k) / 10;
        lines += `<path d="${openPath([at(0, 0), at(Math.cos(a) * r * 0.83, Math.sin(a) * r * 0.83)])}"/>`;
      }
      return `<g stroke="#FFFBE8" stroke-width="${n(r * 0.05)}" stroke-linecap="round">${lines}</g><path d="${discOn(at, [0, 0], [r * 0.09, r * 0.09])}" fill="#FFFBE8"/>`;
    },
  });
}

/** A cucumber slice. */
export function cucumberSlice(origin, fr, { r = 26, thick = 6 } = {}) {
  return roundSlice(origin, fr, {
    r,
    thick,
    top: ['#E6F4C4', '#A9C878'],
    side: ['#4E8A2A', '#1E4A10'],
    rings: [
      [1, '#2E6B1C'],
      [0.9, '#9CCB66'],
      [0.84, '#DDF0B4'],
      [0.52, '#F1F9DC'],
    ],
    details: (at) => {
      let seeds = '';
      for (let k = 0; k < 6; k++) {
        const a = (2 * Math.PI * k) / 6 + 0.5;
        seeds += `<path d="${discOn(at, [Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3], [r * 0.09, r * 0.05], (a * 180) / Math.PI, 12)}"/>`;
      }
      return `<g fill="#FFFFFF" stroke="#A8C880" stroke-width="0.6">${seeds}</g>`;
    },
  });
}

/** A tomato slice. */
export function tomatoSlice(origin, fr, { r = 28, thick = 6 } = {}) {
  return roundSlice(origin, fr, {
    r,
    thick,
    top: ['#FF7A60', '#C42A18'],
    side: ['#E8402A', '#9A1A0E'],
    rings: [
      [1, '#C8281A'],
      [0.93, '#F04A32'],
    ],
    details: (at) => {
      let svg = '';
      for (let k = 0; k < 4; k++) {
        const a = (Math.PI / 2) * k + Math.PI / 4;
        const c = [Math.cos(a) * r * 0.48, Math.sin(a) * r * 0.48];
        svg += `<path d="${discOn(at, c, [r * 0.27, r * 0.19], (a * 180) / Math.PI + 90, 20)}" fill="#FF9C7E"/>`;
        for (let s = -1; s <= 1; s++) {
          const b = a + s * 0.35;
          svg += `<path d="${discOn(at, [Math.cos(b) * r * 0.5, Math.sin(b) * r * 0.5], [r * 0.06, r * 0.035], (b * 180) / Math.PI, 10)}" fill="#F7E08A"/>`;
        }
      }
      return `${svg}<path d="${discOn(at, [0, 0], [r * 0.2, r * 0.2])}" fill="#F46A50"/>`;
    },
  });
}

/** Half an avocado, cut face up on the frame, its narrow end toward -u. */
export function avocadoHalf(origin, fr, { length = 160, width = 112, depth = 50, pit = true } = {}) {
  const outline = Array.from({ length: 56 }, (_, i) => {
    const t = (2 * Math.PI * i) / 56;
    return [(length / 2) * Math.cos(t), (width / 2) * Math.sin(t) * (0.8 + 0.2 * Math.cos(t))];
  });
  const back = underside(origin, fr, outline, depth);
  const box = bounds(back);
  const d = pathOf(back);
  const c = [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2];
  const r = Math.max(box[2] - box[0], box[3] - box[1]) / 2;
  const skin = linear([c[0] + LIGHT_2D[0] * r, c[1] + LIGHT_2D[1] * r], [c[0] - LIGHT_2D[0] * r, c[1] - LIGHT_2D[1] * r], [
    [0, '#5E8236'],
    [0.45, '#2E4A1C'],
    [1, '#101C07'],
  ]);
  const hole = [length * 0.12, 0];
  const pitR = length * 0.19;
  const ringAt = (at, s) => pathOf(outline.map(([p, q]) => at(hole[0] + (p - hole[0]) * s, q * s)));
  const face = slab(origin, fr, outline, 1, {
    top: ['#C8DF72', '#A9C25A'],
    side: ['#3C6420', '#1C3010'],
    shadow: false,
    bevel: 2.5,
    rim: 0.55,
    rimShade: 0.2,
    gloss: 0.5,
    decorate: ({ project: at, top }) => {
      const flesh = [
        [0.93, '#9CCB48'],
        [0.8, '#CCE07A'],
        [0.62, '#E8E89E'],
      ]
        .map(([s, color]) => `<path d="${ringAt(at, s)}" fill="${color}"/>`)
        .join('');
      let svg = `<path d="${ringAt(at, 1)}" fill="#5C8C26"/><g filter="${blur(4, bounds(top))}">${flesh}</g>`;
      svg += `<path d="${pathOf(top)}" fill="none" stroke="#25420F" stroke-width="4"/>`;
      if (!pit) {
        // The hollow the pit left: in shade on the side nearest the light, lit on the far side.
        const hollow = discOn(at, hole, [pitR * 1.04, pitR * 1.04], 0, 32);
        const box = bounds(top);
        const shift = (k) => `translate(${n(LIGHT_2D[0] * k)} ${n(LIGHT_2D[1] * k)})`;
        svg += `<path d="${hollow}" fill="#DCDA8C"/><g clip-path="${clipTo(hollow)}">`;
        svg += `<path d="${hollow}" fill="none" stroke="#5E6A1C" stroke-opacity="0.8" stroke-width="18" transform="${shift(-8)}" filter="${blur(4, box)}"/>`;
        svg += `<path d="${hollow}" fill="none" stroke="#FFFCE0" stroke-opacity="0.75" stroke-width="5" transform="${shift(4)}" filter="${blur(1.5, box)}"/></g>`;
      }
      return svg;
    },
  });
  let svg = `${softShadow(d, box, { dx: 4, dy: 6, opacity: 0.35, blur: 5 })}<path d="${d}" fill="${skin}"/>${face.svg}`;
  if (pit) {
    const seed = blob(origin, frameOf(fr.at(hole[0], 0, 0), fr.u, fr.w), [pitR, pitR * 0.96, pitR * 0.75], {
      colors: ['#B5743E', '#4A2410'],
      gloss: 0.8,
      shine: 0.25,
      rimLight: 0.45,
      shadow: { opacity: 0.35, blur: 3 },
    }, { half: true });
    svg += seed.svg;
  }
  return { depth: nearness(fr.origin), svg };
}

// ---------- nuts, beans and tofu ----------
export function almond(origin, fr, { size = 1 } = {}) {
  return blob(origin, fr, [15 * size, 9.5 * size, 6 * size], {
    colors: ['#D4935A', '#5A2C0E'],
    gloss: 0.3,
    shine: 0.3,
    rimLight: 0.4,
    matte: true,
    shadow: { opacity: 0.35, blur: 2 },
  });
}

export function macadamia(origin, fr, { size = 1 } = {}) {
  return blob(origin, fr, [11 * size, 11 * size, 10 * size], {
    colors: ['#FCF0D4', '#AE8656'],
    gloss: 0.45,
    shine: 0.3,
    rimLight: 0.45,
    shadow: { opacity: 0.35, blur: 2 },
  });
}

/** A shelled edamame bean. */
export function edamameBean(origin, fr, { size = 1 } = {}) {
  return blob(origin, fr, [10 * size, 7.5 * size, 6.5 * size], {
    colors: ['#B4E070', '#2F6A14'],
    gloss: 0.7,
    shine: 0.3,
    rimLight: 0.45,
    shadow: { opacity: 0.3, blur: 1.5 },
  });
}

/** An edamame pod with three beans in it, its length along u. */
export function edamamePod(origin, fr, { length = 72, width = 20, thick = 9 } = {}) {
  const outline = Array.from({ length: 48 }, (_, i) => {
    const t = (2 * Math.PI * i) / 48;
    const p = (length / 2) * Math.cos(t);
    return [p, (width / 2) * Math.sin(t) * (1 + 0.16 * Math.cos((6 * Math.PI * p) / length))];
  });
  return slab(origin, fr, outline, thick, {
    top: ['#B8DE72', '#3F7A1C'],
    side: ['#9CC85A', '#2F5E14'],
    gloss: 0.35,
    bevel: 4,
    rim: 0.6,
    rimShade: 0.35,
    shadow: { opacity: 0.3, blur: 2 },
  });
}

/** A cube of fried tofu: golden sides and a pale cut face on the frame. */
export function tofuCube(origin, fr, { size = 46 } = {}) {
  const h = size / 2;
  const corner = 5;
  const outline = [];
  for (const [cp, cq, a0] of [
    [h - corner, h - corner, 0],
    [corner - h, h - corner, 90],
    [corner - h, corner - h, 180],
    [h - corner, corner - h, 270],
  ]) {
    for (let k = 0; k <= 4; k++) {
      const a = rad(a0 + (90 * k) / 4);
      outline.push([cp + corner * Math.cos(a), cq + corner * Math.sin(a)]);
    }
  }
  return slab(origin, fr, outline, size * 0.9, {
    top: ['#FFF7E2', '#D8C69A'],
    side: ['#F2C26C', '#9C5A18'],
    gloss: 0.35,
    bevel: 3,
    rim: 0.7,
    rimShade: 0.3,
    shadow: { opacity: 0.35 },
  });
}

/** A stick of pickled carrot or daikon (đồ chua). */
export function pickleStick(origin, fr, { length = 46, width = 7, thick = 6, carrot = true } = {}) {
  const outline = [
    [-length / 2, -width / 2],
    [length / 2, -width / 2],
    [length / 2, width / 2],
    [-length / 2, width / 2],
  ];
  const colors = carrot
    ? { top: ['#FFB463', '#D9620E'], side: ['#FF9A3A', '#A84406'] }
    : { top: ['#FFFFFF', '#E3DCC8'], side: ['#F6F1E2', '#C2B796'] };
  return slab(origin, fr, outline, thick, { ...colors, gloss: 0.8, bevel: 1.2, rim: 0.6, rimShade: 0.3, shadow: { opacity: 0.3, blur: 1.5 } });
}

// ---------- toppings drawn flat on screen ----------
/** A sesame seed at a screen point. */
export function sesame([x, y], angle) {
  return `<ellipse cx="${n(x)}" cy="${n(y)}" rx="2.6" ry="1.4" transform="rotate(${n(angle)} ${n(x)} ${n(y)})" fill="#FFF3D6" stroke="#9A7A48" stroke-opacity="0.6" stroke-width="0.5"/>`;
}

/** A ring of chopped spring onion at a screen point, glossy with oil. */
export function scallionRing([x, y], { size = 4.5, angle = 0 } = {}) {
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})"><ellipse rx="${n(size)}" ry="${n(size * 0.55)}" fill="#A8DC6A" fill-opacity="0.85" stroke="#2F7A1A" stroke-width="${n(size * 0.45)}"/><ellipse cx="${n(-size * 0.35)}" cy="${n(-size * 0.3)}" rx="${n(size * 0.4)}" ry="${n(size * 0.15)}" fill="#FFFFFF" fill-opacity="0.8"/></g>`;
}
