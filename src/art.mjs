// Hand-drawn style Connemara landscapes as inline SVG, so every site looks
// finished before the client's own photos arrive. No image files needed.

export const THEMES = {
  atlantic: { sky1: '#e6eef3', sky2: '#c9dbe6', sun: '#f2c66d', far: '#8fa7b5', mid: '#5b7f86', near: '#3b5f5a', sea: '#2c5d7c', sea2: '#3f7898', accent: '#1f4e6b', accentInk: '#ffffff', paper: '#f7f4ee' },
  heather: { sky1: '#f1e9ef', sky2: '#dccbdc', sun: '#f4c27a', far: '#b39bb5', mid: '#7f5d86', near: '#55405e', sea: '#41566f', sea2: '#5a7290', accent: '#6b3f6f', accentInk: '#ffffff', paper: '#f8f4f4' },
  bog: { sky1: '#eef0e6', sky2: '#d9dcc6', sun: '#efc46b', far: '#a5ae8f', mid: '#76835a', near: '#4e5a37', sea: '#4b6264', sea2: '#61797a', accent: '#2d5a4a', accentInk: '#ffffff', paper: '#f5f4ee' },
  stone: { sky1: '#eceeef', sky2: '#d5d9dc', sun: '#e9c477', far: '#a3abb1', mid: '#76818a', near: '#4d5760', sea: '#3c5566', sea2: '#56707f', accent: '#2f3e48', accentInk: '#ffffff', paper: '#f5f4f1' },
  turf: { sky1: '#f4ece4', sky2: '#e8d4c2', sun: '#f0b964', far: '#c0a28c', mid: '#8f6a52', near: '#5e4434', sea: '#3d5a6a', sea2: '#58768a', accent: '#8a3b22', accentInk: '#ffffff', paper: '#faf6f0' },
};

// variant changes the skyline so pages on one site don't repeat the same picture
export function landscape(themeName = 'atlantic', variant = 0, { label = '' } = {}) {
  const c = THEMES[themeName] || THEMES.atlantic;
  const v = variant % 4;
  const ridges = [
    'M0 250 L90 170 L150 205 L230 120 L300 180 L360 150 L430 205 L520 140 L600 190 L680 150 L760 200 L800 185 L800 400 L0 400Z',
    'M0 230 L70 200 L140 140 L210 190 L260 165 L340 110 L420 185 L500 160 L570 205 L650 130 L730 190 L800 160 L800 400 L0 400Z',
    'M0 210 L110 190 L180 150 L260 175 L330 130 L380 165 L470 120 L560 180 L640 165 L720 120 L800 175 L800 400 L0 400Z',
    'M0 240 L60 215 L130 175 L190 200 L280 140 L350 190 L410 170 L490 205 L560 150 L640 200 L710 170 L800 210 L800 400 L0 400Z',
  ][v];
  const mid = [
    'M0 285 Q120 230 230 262 T460 250 T800 262 L800 400 L0 400Z',
    'M0 270 Q150 245 300 275 T600 255 T800 270 L800 400 L0 400Z',
    'M0 290 Q100 250 220 270 T500 240 T800 280 L800 400 L0 400Z',
    'M0 275 Q180 240 360 268 T700 250 T800 258 L800 400 L0 400Z',
  ][v];
  const sunX = [610, 180, 520, 690][v];
  const id = `g${themeName}${v}`;
  return `<svg class="art" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label || 'Connemara landscape illustration'}" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.sky1}"/><stop offset="1" stop-color="${c.sky2}"/></linearGradient>
<linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.sea2}"/><stop offset="1" stop-color="${c.sea}"/></linearGradient></defs>
<rect width="800" height="400" fill="url(#${id}s)"/>
<circle cx="${sunX}" cy="95" r="34" fill="${c.sun}" opacity=".9"/>
<path d="M90 70 q20 -10 40 0 q15 -8 30 2" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>
<path d="M${sunX - 280} 60 q24 -12 48 0 q18 -9 36 2" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
<path d="${ridges}" fill="${c.far}"/>
<path d="${mid}" fill="${c.mid}"/>
<rect y="300" width="800" height="100" fill="url(#${id}w)"/>
<path d="M0 300 Q200 292 400 300 T800 300 L800 312 L0 312Z" fill="${c.near}" opacity=".55"/>
<g stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round"><path d="M60 330h60M220 352h90M420 326h50M560 360h110M690 334h60M140 378h70M470 384h90"/></g>
</svg>`;
}

// small icon set (stroke icons, currentColor)
const P = {
  sea: '<path d="M3 15c2 0 2-2 4.5-2S10 15 12 15s2-2 4.5-2S19 15 21 15M3 19c2 0 2-2 4.5-2S10 19 12 19s2-2 4.5-2S19 19 21 19M12 3l3 7H9z"/>',
  breakfast: '<path d="M4 10h13v3a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6zM17 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3c0 2 2 2 2 4M12 3c0 2 2 2 2 4"/>',
  walk: '<path d="M13 4a1.5 1.5 0 1 0 0 .01M9 21l2-6 3 3v3M11 15l1-5 3 2 2 1M9 10l3-1"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/>',
  parking: '<path d="M5 3h14v18H5zM10 17V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
  dog: '<path d="M5 13c0-4 3-7 7-7l3-3 1 4 3 2-1 3h-3l-1 5H8l-1-3M8 21v-3M14 21v-3"/>',
  fish: '<path d="M3 12c3-4 8-5 12-3l5-3v12l-5-3c-4 2-9 1-12-3zM16 11h.01"/>',
  golf: '<path d="M9 21V3l8 4-8 4M5 21h12"/>',
  ferry: '<path d="M3 17l2-6h14l2 6M7 11V7h8l2 4M3 20c2 0 2-1.5 4.5-1.5S10 20 12 20s2-1.5 4.5-1.5S19 20 21 20"/>',
  irish: '<path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h5"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M4 20l1.5-4A8 8 0 1 1 9 19.5z"/>',
  mail: '<path d="M3 5h18v14H3zM3 6l9 7 9-7"/>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  clock: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2"/>',
  coffee: '<path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3"/>',
  tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19l-3 1 1-3 7.5-7.5a4 4 0 0 0-5-5z"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  leaf: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8"/>',
  bed: '<path d="M3 18V7M3 13h18v5M21 18v-3a3 3 0 0 0-3-3H10v1M7 11.5a1.5 1.5 0 1 0 0-.01"/>',
  calendar: '<path d="M4 5h16v16H4zM4 10h16M8 3v4M16 3v4"/>',
  euro: '<path d="M17 6.5A6 6 0 0 0 7 11v2a6 6 0 0 0 10 4.5M5 10.5h8M5 13.5h8"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  family: '<path d="M7 7a2 2 0 1 0 0-.01M17 7a2 2 0 1 0 0-.01M4 21v-7l3-3 3 3v7M14 21v-7l3-3 3 3v7"/>',
};
export function icon(name, size = 22) {
  return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.check}</svg>`;
}
