/**
 * Icon geometry, copied from Lucide v1.82.0 (https://lucide.dev), ISC licensed.
 *
 * Only the shapes are vendored, not the package: a dependency would ship a
 * whole icon set to consumers who need six of them, and the set has to be
 * frozen so an upstream rename cannot silently break a public `name` value.
 * Each entry keeps Lucide's 24x24 viewBox, so stroke width stays consistent
 * across sizes.
 */
export type ChIconName =
  | 'alert'
  | 'arrowRight'
  | 'check'
  | 'chevronDown'
  | 'chevronRight'
  | 'close'
  | 'copy'
  | 'delete'
  | 'download'
  | 'error'
  | 'externalLink'
  | 'info'
  | 'menu'
  | 'plus'
  | 'search'
  | 'spinner'
  | 'success'
  | 'upload';

export interface ChIconShape {
  tag: 'path' | 'circle' | 'rect' | 'line' | 'polyline' | 'polygon';
  attrs: Record<string, string>;
}

export const chIcons: Record<ChIconName, ChIconShape[]> = {
  alert: [
    { tag: 'path', attrs: { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' } },
    { tag: 'path', attrs: { d: 'M12 9v4' } },
    { tag: 'path', attrs: { d: 'M12 17h.01' } },
  ],
  arrowRight: [
    { tag: 'path', attrs: { d: 'M5 12h14' } },
    { tag: 'path', attrs: { d: 'm12 5 7 7-7 7' } },
  ],
  check: [{ tag: 'path', attrs: { d: 'M20 6 9 17l-5-5' } }],
  chevronDown: [{ tag: 'path', attrs: { d: 'm6 9 6 6 6-6' } }],
  chevronRight: [{ tag: 'path', attrs: { d: 'm9 18 6-6-6-6' } }],
  close: [
    { tag: 'path', attrs: { d: 'M18 6 6 18' } },
    { tag: 'path', attrs: { d: 'm6 6 12 12' } },
  ],
  copy: [
    { tag: 'rect', attrs: { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' } },
    { tag: 'path', attrs: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' } },
  ],
  delete: [
    { tag: 'path', attrs: { d: 'M10 11v6' } },
    { tag: 'path', attrs: { d: 'M14 11v6' } },
    { tag: 'path', attrs: { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' } },
    { tag: 'path', attrs: { d: 'M3 6h18' } },
    { tag: 'path', attrs: { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' } },
  ],
  download: [
    { tag: 'path', attrs: { d: 'M12 15V3' } },
    { tag: 'path', attrs: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } },
    { tag: 'path', attrs: { d: 'm7 10 5 5 5-5' } },
  ],
  error: [
    { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
    { tag: 'line', attrs: {} },
    { tag: 'line', attrs: {} },
  ],
  externalLink: [
    { tag: 'path', attrs: { d: 'M15 3h6v6' } },
    { tag: 'path', attrs: { d: 'M10 14 21 3' } },
    { tag: 'path', attrs: { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } },
  ],
  info: [
    { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
    { tag: 'path', attrs: { d: 'M12 16v-4' } },
    { tag: 'path', attrs: { d: 'M12 8h.01' } },
  ],
  menu: [
    { tag: 'path', attrs: { d: 'M4 5h16' } },
    { tag: 'path', attrs: { d: 'M4 12h16' } },
    { tag: 'path', attrs: { d: 'M4 19h16' } },
  ],
  plus: [
    { tag: 'path', attrs: { d: 'M5 12h14' } },
    { tag: 'path', attrs: { d: 'M12 5v14' } },
  ],
  search: [
    { tag: 'path', attrs: { d: 'm21 21-4.34-4.34' } },
    { tag: 'circle', attrs: { cx: '11', cy: '11', r: '8' } },
  ],
  spinner: [
    { tag: 'path', attrs: { d: 'M12 2v4' } },
    { tag: 'path', attrs: { d: 'm16.2 7.8 2.9-2.9' } },
    { tag: 'path', attrs: { d: 'M18 12h4' } },
    { tag: 'path', attrs: { d: 'm16.2 16.2 2.9 2.9' } },
    { tag: 'path', attrs: { d: 'M12 18v4' } },
    { tag: 'path', attrs: { d: 'm4.9 19.1 2.9-2.9' } },
    { tag: 'path', attrs: { d: 'M2 12h4' } },
    { tag: 'path', attrs: { d: 'm4.9 4.9 2.9 2.9' } },
  ],
  success: [
    { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
    { tag: 'path', attrs: { d: 'm16 9-5.5 5.5L8 12' } },
  ],
  upload: [
    { tag: 'path', attrs: { d: 'M12 3v12' } },
    { tag: 'path', attrs: { d: 'm17 8-5-5-5 5' } },
    { tag: 'path', attrs: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } },
  ],
};
