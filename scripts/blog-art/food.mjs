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
  clamp,
  clipTo,
  define,
  ellipsePoints,
  frame,
  frameOf,
  inOrder,
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

// ---------- phở: noodles, beef, broth and herbs ----------
/** A flat rice noodle (bánh phở) lying along a screen polyline: a pale ribbon with a soft shine. */
export function noodleRibbon(points, { width = 9, light = 1, opacity = 1 } = {}) {
  const d = openPath(points);
  const body = tone(['#FFFDF6', '#B9B29C'], light);
  const edge = tone(['#D8D0B8', '#857C64'], light);
  return (
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${n(opacity)}">` +
    `<path d="${d}" stroke="${edge}" stroke-width="${n(width + 1.6)}"/>` +
    `<path d="${d}" stroke="${body}" stroke-width="${n(width)}"/>` +
    `<path d="${d}" transform="translate(${n(LIGHT_2D[0] * width * 0.2)} ${n(LIGHT_2D[1] * width * 0.2)})" stroke="#FFFFFF" stroke-opacity="${n(0.55 * light)}" stroke-width="${n(width * 0.28)}"/>` +
    `</g>`
  );
}

/** A wavy noodle path on a frame: starts at [p, q], heads off at angle degrees, length long. */
export function noodlePath(rand, at, [p, q], angle, length, { wave = 10, steps = 18 } = {}) {
  const points = [];
  let a = rad(angle);
  let [x, y] = [p, q];
  const phase = rand.range(0, 6);
  for (let i = 0; i <= steps; i++) {
    points.push(at(x, y));
    a += 0.18 * Math.sin(phase + i * 0.7) + rand.range(-0.08, 0.08);
    x += (Math.cos(a) * length) / steps;
    y += (Math.sin(a) * length) / steps + (wave / steps) * Math.sin(phase + i);
  }
  return points;
}

/** Rice noodles heaped on a mound: a pale bed and ribbons draped over it, lit by their slope. */
export function noodleHeap(rand, origin, mound, { count = 70, width = 10 } = {}) {
  const bed = heapBed(origin, mound, ['#F6F1E2', '#DCD3BC', '#ABA28A']);
  const ribbons = mound.scatter(origin, rand, count).map((p) => {
    const X = p.point[0];
    const Z = p.point[2];
    const angle = rand.range(0, 360);
    const length = rand.range(200, 320);
    const pts3 = [];
    for (let i = 0; i <= 14; i++) {
      const t = (i / 14 - 0.5) * length;
      const wobble = 8 * Math.sin(i * 0.9 + angle);
      const x = X + Math.cos(rad(angle)) * t - Math.sin(rad(angle)) * wobble;
      const z = Z + Math.sin(rad(angle)) * t * 0.6 + Math.cos(rad(angle)) * wobble;
      if (x * x + z * z > mound.rx * mound.rx * 0.97) continue;
      pts3.push(project(origin, mound.at(x, z, 2)));
    }
    const { diffuse, spec } = lightOn(p.normal);
    return { depth: p.depth, svg: pts3.length > 2 ? noodleRibbon(pts3, { width, light: clamp(diffuse * 0.75 + 0.3 + spec * 0.3) }) : '' };
  });
  return `${bed}\n${inOrder(ribbons)}`;
}

export const BEEF = {
  // Rare beef (tái) cooked pink by the hot broth, and well-done brisket or flank (chín).
  tai: { top: ['#D98C80', '#8A3C34'], side: ['#B86A5E', '#6A2A24'], core: '#E9A49A' },
  chin: { top: ['#B89880', '#6A4A38'], side: ['#9C7A64', '#4E3426'], core: '#C9AE98' },
  // Raw sliced beef, deep red with white fat.
  raw: { top: ['#E2584E', '#8E1C18'], side: ['#C8443C', '#6E1410'], core: '#EC6E62' },
};

/** A thin slice of beef with a ragged edge and a few streaks of fat, its length along u. */
export function beefSlice(origin, fr, { length = 120, width = 70, thick = 4, kind = BEEF.tai, seed = 1 } = {}) {
  const rand = (k) => Math.sin(seed * 12.9898 + k * 78.233) * 0.5 + 0.5;
  const outline = Array.from({ length: 44 }, (_, i) => {
    const t = (2 * Math.PI * i) / 44;
    const k = 1 + 0.07 * Math.sin(3 * t + seed) + 0.04 * Math.sin(7 * t + seed * 2) + 0.03 * (rand(i) - 0.5);
    return [(length / 2) * k * Math.cos(t), (width / 2) * k * Math.sin(t) * (0.85 + 0.15 * Math.cos(t))];
  });
  return slab(origin, fr, outline, thick, {
    top: kind.top,
    side: kind.side,
    gloss: 0.7,
    bevel: 3,
    rim: 0.45,
    rimShade: 0.35,
    shadow: { opacity: 0.3, blur: 2.5 },
    decorate: ({ project: at, top }) => {
      const box = bounds(top);
      const core = `<path d="${discOn(at, [length * 0.05, 0], [length * 0.3, width * 0.25], 10)}" fill="${kind.core}" fill-opacity="0.55" filter="${blur(4, box)}"/>`;
      // Thin, irregular streaks of fat across the grain.
      let fat = '';
      for (let k = 0; k < 4; k++) {
        const p = length * (rand(k + 10) - 0.5) * 0.75;
        const q = width * (rand(k + 20) - 0.5) * 0.5;
        const reach = width * (0.12 + 0.18 * rand(k + 30));
        fat += `<path d="${openPath([at(p - 6, q - reach), at(p + 3, q), at(p - 2, q + reach)])}"/>`;
      }
      return `${core}<g fill="none" stroke="#FFF4EA" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" filter="${blur(0.8, box)}">${fat}</g>`;
    },
  });
}

/** A thin ring of white onion lying flat on a frame. */
export function onionRing(origin, fr, { r = 20 } = {}) {
  const ring = (a, b) => ellipsePoints(a, b, 32).map(([p, q]) => project(origin, fr.at(p, q)));
  const d = pathOf(ring(r, r * 0.92)) + pathOf(ring(r * 0.78, r * 0.7));
  const lit = project(origin, fr.at(-r * 0.55, -r * 0.55));
  return {
    depth: nearness(fr.origin),
    svg:
      `<path d="${d}" fill-rule="evenodd" fill="#FBF7EC" fill-opacity="0.92" stroke="#B8B09A" stroke-opacity="0.5" stroke-width="0.7"/>` +
      `<circle cx="${n(lit[0])}" cy="${n(lit[1])}" r="${n(r * 0.16)}" fill="#FFFFFF" fill-opacity="0.8"/>`,
  };
}

/** A cilantro (ngò) leaf: three rounded, toothed lobes, flat on screen. */
export function cilantroLeaf([x, y], { size = 12, angle = 0, color = '#3E8E2A' } = {}) {
  let lobes = '';
  for (const [dx, dy, s] of [[0, -0.9, 1], [-0.85, 0.15, 0.85], [0.85, 0.15, 0.85]]) {
    const pts2 = Array.from({ length: 14 }, (_, i) => {
      const t = (2 * Math.PI * i) / 14;
      const k = s * size * 0.55 * (1 + 0.16 * Math.cos(5 * t));
      return [dx * size * 0.62 + k * Math.cos(t), dy * size * 0.62 + k * Math.sin(t) * 0.9];
    });
    lobes += `<path d="${pathOf(pts2)}"/>`;
  }
  return (
    `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})">` +
    `<g transform="translate(1.5 2)" fill="#0E2A0A" fill-opacity="0.25">${lobes}</g>` +
    `<g fill="${color}" stroke="#1E5212" stroke-width="0.8">${lobes}</g>` +
    `<path d="M0,${n(size * 1.6)} L0,${n(-size * 0.3)} M0,0 L${n(-size * 0.5)},${n(size * 0.1)} M0,0 L${n(size * 0.5)},${n(size * 0.1)}" stroke="#A8D878" stroke-width="1.1" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="${n(-size * 0.3)}" cy="${n(-size * 0.75)}" rx="${n(size * 0.28)}" ry="${n(size * 0.12)}" fill="#FFFFFF" fill-opacity="0.45"/>` +
    `</g>`
  );
}

/** A slice of red chilli, flat on screen, with its pale seeds. */
export function chilliSlice([x, y], { size = 10, angle = 0 } = {}) {
  const rx = size;
  const ry = size * 0.7;
  return (
    `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})">` +
    `<ellipse cx="1.5" cy="2" rx="${n(rx)}" ry="${n(ry)}" fill="#3A0A04" fill-opacity="0.25"/>` +
    `<ellipse rx="${n(rx)}" ry="${n(ry)}" fill="#D8261A" stroke="#8E1208" stroke-width="1"/>` +
    `<ellipse rx="${n(rx * 0.62)}" ry="${n(ry * 0.58)}" fill="#F6B886"/>` +
    `<circle cx="${n(-rx * 0.2)}" cy="0" r="${n(size * 0.12)}" fill="#FFF2C8"/><circle cx="${n(rx * 0.22)}" cy="${n(ry * 0.1)}" r="${n(size * 0.12)}" fill="#FFF2C8"/>` +
    `<ellipse cx="${n(-rx * 0.45)}" cy="${n(-ry * 0.55)}" rx="${n(rx * 0.35)}" ry="${n(ry * 0.18)}" fill="#FFFFFF" fill-opacity="0.65"/>` +
    `</g>`
  );
}

/** A bean sprout (giá đỗ) along a screen curve: a crisp white stem, a yellow-green head and a thin tail. */
export function beanSprout([x, y], { length = 60, angle = 0, bend = 0.25, light = 1 } = {}) {
  const L = length;
  const d = `M${n(-L / 2)},0 Q0,${n(-L * bend)} ${n(L / 2)},0`;
  const stem = tone(['#FFFFF4', '#B8B6A0'], light);
  return (
    `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(angle)})">` +
    `<path d="${d}" transform="translate(1.5 2.5)" fill="none" stroke="#2B2014" stroke-opacity="0.18" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="#C9C6AE" stroke-width="7.2" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${stem}" stroke-width="5.6" stroke-linecap="round"/>` +
    `<path d="${d}" transform="translate(-0.8 -1.4)" fill="none" stroke="#FFFFFF" stroke-opacity="0.8" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M${n(L / 2)},0 q${n(L * 0.12)},${n(L * 0.04)} ${n(L * 0.22)},${n(L * 0.12)}" fill="none" stroke="#C8BC98" stroke-width="1.4" stroke-linecap="round"/>` +
    `<ellipse cx="${n(-L / 2 - 3)}" cy="-1" rx="6" ry="4.4" transform="rotate(-20 ${n(-L / 2 - 3)} -1)" fill="#E2DE7A" stroke="#8E8A3A" stroke-width="0.8"/>` +
    `<path d="M${n(-L / 2 - 6)},-3 q-4,-5 -1,-9" fill="none" stroke="#9CC452" stroke-width="2.4" stroke-linecap="round"/>` +
    `</g>`
  );
}

/** Thai basil (húng quế) leaves: glossy, deep green, for leaf(). */
export const BASIL = { top: ['#5FB040', '#164A10'], side: ['#3E8A2A', '#103A0A'] };

/** A lime slice (chanh). */
export function limeSlice(origin, fr, { r = 34, thick = 6 } = {}) {
  return roundSlice(origin, fr, {
    r,
    thick,
    top: ['#E8F7A8', '#9CC040'],
    side: ['#6FB22A', '#3A7410'],
    rings: [
      [1, '#4E9A1E'],
      [0.9, '#F4FBDC'],
      [0.84, '#C8E66A'],
    ],
    details: (at) => {
      let lines = '';
      for (let k = 0; k < 9; k++) {
        const a = (2 * Math.PI * k) / 9;
        lines += `<path d="${openPath([at(0, 0), at(Math.cos(a) * r * 0.84, Math.sin(a) * r * 0.84)])}"/>`;
      }
      return `<g stroke="#F4FBDC" stroke-width="${n(r * 0.05)}" stroke-linecap="round">${lines}</g><path d="${discOn(at, [0, 0], [r * 0.09, r * 0.09])}" fill="#F4FBDC"/>`;
    },
  });
}

/**
 * Clear phở broth in a bowl, its surface 40 below the rim: the broth seen through the glass (with
 * noodles under it when noodles is set) and its golden surface dotted with fat. Returns
 * { below, surface, onSurface }: draw below, then surface, then the toppings. onSurface(X, Z, spin)
 * is the frame of a point on the surface.
 */
export function phoBroth(rand, { noodles = true, fat = 34 } = {}) {
  const [CX, CY, RX, RY] = [320, 210.4, 250, 69.4];
  const clip = uid();
  define(`<clipPath id="${clip}"><use href="#interior"/></clipPath>`);
  const body = `M${CX - RX},${CY} A${RX},${RY} 0 0 1 ${CX + RX},${CY} L640,560 L0,560 Z`;
  const amber = linear([0, CY], [0, 420], [
    [0, '#F2CF7E'],
    [0.6, '#DDA850'],
    [1, '#B9822E'],
  ]);
  let sunk = '';
  if (noodles) {
    for (let k = 0; k < 26; k++) {
      const x0 = rand.range(110, 520);
      const y0 = rand.range(250, 390);
      const line = Array.from({ length: 10 }, (_, i) => [x0 + (i - 5) * 16 + rand.range(-3, 3), y0 + 9 * Math.sin(i * 0.8 + k) + (i - 5) * rand.range(-3, 3)]);
      sunk += noodleRibbon(line, { width: 10, light: 0.75 - (y0 - 250) / 400, opacity: 0.75 });
    }
  }
  const surface = linear([0, CY - RY], [0, CY + RY], [
    [0, '#FBE3A6'],
    [0.5, '#F0C670'],
    [1, '#D9A245'],
  ]);
  const shine = [CX - RX * 0.4, CY - RY * 0.45];
  const box = [CX - RX, CY - RY, CX + RX, CY + RY];
  let drops = '';
  for (let k = 0; k < fat; k++) {
    const a = rand.range(0, 2 * Math.PI);
    const d = 0.9 * Math.sqrt(rand());
    const [x, y] = [CX + Math.cos(a) * d * RX, CY + Math.sin(a) * d * RY];
    const r = rand.range(2.5, 7);
    drops += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r)}" ry="${n(r * 0.45)}" fill="#F8D27A" stroke="#B88430" stroke-opacity="0.55" stroke-width="0.8"/><ellipse cx="${n(x - r * 0.3)}" cy="${n(y - r * 0.15)}" rx="${n(r * 0.4)}" ry="${n(r * 0.14)}" fill="#FFFFFF" fill-opacity="0.85"/>`;
  }
  return {
    below: `<g clip-path="url(#${clip})"><path d="${body}" fill="${amber}" fill-opacity="0.9"/>${sunk}</g>`,
    surface: [
      `<ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="${surface}"/>`,
      `<ellipse cx="${n(shine[0])}" cy="${n(shine[1])}" rx="${n(RX * 0.34)}" ry="${n(RY * 0.18)}" fill="#FFFFFF" fill-opacity="0.5" filter="${blur(5, box)}"/>`,
      `<path d="M${CX - RX + 2},${CY} A${RX - 2},${RY - 1} 0 0 1 ${CX + RX - 2},${CY}" fill="none" stroke="#FFF6DE" stroke-opacity="0.85" stroke-width="3"/>`,
      `<path d="M${CX - RX + 4},${CY + 2} A${RX - 4},${RY - 2} 0 0 0 ${CX + RX - 4},${CY + 2}" fill="none" stroke="#9A6A20" stroke-opacity="0.3" stroke-width="2.5"/>`,
      drops,
    ].join('\n'),
    onSurface: (X, Z, spin = 0) => frame([X, -40, Z], [0, 1, 0], spin),
  };
}

// ---------- bánh mì: the baguette and its fillings ----------
const CRUST = ['#F6C474', '#8A4810'];

/** A rounded length of baguette crust along u, depth tall along w; ridge adds the oven scores this far toward +v (a fraction of width). */
function loafHalf(origin, fr, { length, width, depth, ridge }) {
  return blob(origin, fr, [length / 2, width / 2, depth], {
    colors: CRUST,
    gloss: 0.4,
    shine: 0.28,
    rimLight: 0.34,
    shadow: { opacity: 0.32 },
    decorate: ({ box }) => {
      if (ridge === undefined) return '';
      // Diagonal scores along the top where the crust opened in the oven, pale and blistered.
      let scores = '';
      for (let k = 0; k < 5; k++) {
        const p = (k / 4 - 0.5) * length * 0.62;
        const line = [-1, -0.5, 0, 0.5, 1].map((t) => {
          const pp = p + t * length * 0.075;
          const q = width * (ridge + 0.14 * t);
          const k2 = Math.sqrt(Math.max(0, 1 - (pp / (length / 2)) ** 2 - (q / (width / 2)) ** 2));
          return project(origin, fr.at(pp, q, depth * k2));
        });
        scores +=
          `<path d="${openPath(line)}" transform="translate(1.5 3.5)" fill="none" stroke="#6A3006" stroke-opacity="0.45" stroke-width="4" stroke-linecap="round" filter="${blur(1.2, box)}"/>` +
          `<path d="${openPath(line)}" fill="none" stroke="#FCE6B4" stroke-opacity="0.9" stroke-width="8" stroke-linecap="round" filter="${blur(1.6, box)}"/>`;
      }
      return scores;
    },
  });
}

/**
 * A Vietnamese baguette (bánh mì) lying along the frame's u, split along its front and filled:
 * a smear of pâté, slices of chả lụa and roast pork, cucumber, pickles, coriander and chilli
 * showing in the opening. frameIn sits on the cut, at the loaf's centre.
 */
export function banhMi(rand, origin, frameIn, { length = 400, width = 120, gap = 38 } = {}) {
  // Turn u around so that v, and the opening, faces the viewer.
  const fr = frameOf(frameIn.origin, scale(frameIn.u, -1), frameIn.w);
  const half = length / 2;
  const front = (p) => (width / 2) * Math.sqrt(Math.max(0, 1 - (p / half) ** 2));
  const bottom = loafHalf(origin, frameOf(fr.origin, fr.u, scale(fr.w, -1)), { length, width, depth: 34 });
  // The open crumb of the lower half, edged with pâté.
  const at = (p, q, r = 0) => project(origin, fr.at(p, q, r));
  const crumb = discOn(at, [0, 0], [half * 0.98, width * 0.49], 0, 48);
  const crumbBox = bounds([at(-half, 0), at(half, 0), at(0, width / 2), at(0, -width / 2)]);
  const pate = Array.from({ length: 25 }, (_, i) => {
    const p = (i / 24 - 0.5) * length * 0.8;
    return at(p, front(p) * 0.8, 3);
  });
  const bed =
    `<path d="${crumb}" fill="#FBEFD2" stroke="#D8A860" stroke-width="2"/>` +
    `<path d="${openPath(pate)}" fill="none" stroke="#8A5A36" stroke-width="9" stroke-linecap="round" filter="${blur(1, crumbBox)}"/>`;
  const pieces = [];
  const front3 = [];
  // Slices standing in the opening, leaning out toward the viewer.
  const lean = (p, q, r, back = 0.4) => frameOf(fr.at(p, q, r), fr.u, norm(add(scale(fr.v, 1), scale(fr.w, back))));
  for (let k = 0; k < 7; k++) {
    const p = (k / 6 - 0.5) * length * 0.62 + rand.range(-8, 8);
    const q = front(p) * 0.86;
    const pork = k % 2 === 1;
    const outline = ellipsePoints(pork ? 42 : 36, gap * (pork ? 0.6 : 0.7), 32);
    pieces.push(
      slab(origin, lean(p, q, gap * 0.55, rand.range(0.2, 0.5)), outline, 3, {
        top: pork ? ['#F6B49A', '#9A4A32'] : ['#FBE2CE', '#B88E72'],
        side: pork ? ['#C8402A', '#7A1A0E'] : ['#E8D2BC', '#8E7460'],
        gloss: 0.5,
        bevel: 2,
        rim: 0.5,
        rimShade: 0.3,
        shadow: { opacity: 0.25, blur: 2 },
        edge: pork ? '#B8301C' : '#8E7460',
        decorate: ({ top }) =>
          pork ? `<path d="${pathOf(top)}" fill="none" stroke="#C8341E" stroke-width="7" filter="${blur(1.2, bounds(top))}"/>` : '',
      }),
    );
  }
  // Long cucumber strips poking out at the front.
  for (let k = 0; k < 4; k++) {
    const p = (k / 3 - 0.5) * length * 0.5 + rand.range(-10, 10);
    const fr2 = frameOf(fr.at(p, front(p) * 0.85, gap * 0.35), add(fr.u, scale(fr.v, rand.range(-0.15, 0.15))), norm(add(fr.w, scale(fr.v, 0.9))));
    const L = rand.range(70, 95);
    front3.push(
      slab(origin, fr2, [[-L / 2, -7], [L / 2, -7], [L / 2, 7], [-L / 2, 7]], 6, {
        top: ['#E6F6C2', '#9CC06A'],
        side: ['#3E7E22', '#1A440C'],
        gloss: 0.8,
        bevel: 1.5,
        rim: 0.6,
        shadow: { opacity: 0.28, blur: 2 },
        decorate: ({ project: pr }) => `<path d="${openPath([pr(-L / 2, -6), pr(L / 2, -6)])}" stroke="#2E6B1C" stroke-width="3" fill="none"/>`,
      }),
    );
  }
  // Pickled carrot and daikon sticking out of the front between the slices.
  for (let k = 0; k < 9; k++) {
    const p = rand.range(-0.36, 0.36) * length;
    const fr2 = frameOf(fr.at(p, front(p) * 0.95, gap * rand.range(0.3, 0.7)), norm([rand.range(-0.4, 0.4), 0, 1]), norm(add(fr.w, scale(fr.v, 0.4))));
    front3.push(pickleStick(origin, frame(fr2.origin, fr2.w, rand.range(60, 120)), { length: rand.range(34, 46), carrot: rand() < 0.55 }));
  }
  const filling = inOrder(pieces);
  const poking = inOrder(front3);
  // Coriander sprigs and chilli along the opening, drawn flat on screen.
  let herbs = '';
  for (let k = 0; k < 11; k++) {
    const p = rand.range(-0.38, 0.38) * length;
    const [x, y] = at(p, front(p) * rand.range(0.85, 1.05), gap * rand.range(0.5, 1));
    herbs += cilantroLeaf([x, y - rand.range(0, 10)], { size: rand.range(10, 14), angle: rand.range(-50, 50) });
  }
  for (let k = 0; k < 4; k++) {
    const p = rand.range(-0.3, 0.3) * length;
    herbs += chilliSlice(at(p, front(p) * 1.02, gap * 0.4), { size: rand.range(7, 9), angle: rand.range(-30, 30) });
  }
  // The upper half, lifted on the filling and set back a little, so the filling shows at the front.
  const lid = loafHalf(origin, frameOf(fr.at(0, -width * 0.1, gap), fr.u, norm(add(fr.w, scale(fr.v, -0.32)))), {
    length: length * 0.98,
    width: width * 0.92,
    depth: 50,
    ridge: 0.3,
  });
  return [bottom.svg, bed, filling, lid.svg, poking, herbs].join('\n');
}

/** A whole, unfilled baguette (ổ bánh mì không) lying along u. */
export function baguette(origin, fr, { length = 380, width = 110, depth = 52 } = {}) {
  return loafHalf(origin, frameOf(fr.origin, scale(fr.u, -1), fr.w), { length, width, depth, ridge: 0.12 });
}

/** A round slice of chả lụa: pale pink pork roll with a thin golden-brown skin. */
export function chaLuaSlice(origin, fr, { r = 62, thick = 6 } = {}) {
  return slab(origin, fr, ellipsePoints(r, r, 48), thick, {
    top: ['#FCE6D6', '#B8927A'],
    side: ['#D9A070', '#7A4A24'],
    gloss: 0.45,
    bevel: 2,
    rim: 0.6,
    rimShade: 0.3,
    shadow: { opacity: 0.28 },
    decorate: ({ project: at, top }) => {
      const box = bounds(top);
      let pores = '';
      for (let k = 0; k < 18; k++) {
        const a = k * 2.4;
        const d = r * 0.75 * Math.sqrt((k + 0.5) / 18);
        pores += `<path d="${discOn(at, [Math.cos(a) * d, Math.sin(a) * d], [2.2, 1.6], a * 40, 10)}"/>`;
      }
      return (
        `<path d="${discOn(at, [0, 0], [r, r], 0, 48)}" fill="none" stroke="#C88A52" stroke-width="${n(r * 0.1)}" filter="${blur(0.8, box)}"/>` +
        `<g fill="#D8B49C" fill-opacity="0.7">${pores}</g>`
      );
    },
  });
}
