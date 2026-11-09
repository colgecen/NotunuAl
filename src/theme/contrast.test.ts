import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function parseTheme(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  const block = css.slice(start, css.indexOf('}', start));
  const vars: Record<string, string> = {};
  for (const match of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3,8})/g)) {
    vars[match[1]] = match[2];
  }
  return vars;
}

function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const channels = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');

describe.each([
  ['light', ':root {'],
  ['dark', "[data-theme='dark'] {"],
])('%s tema kontrastı', (_name, selector) => {
  const theme = parseTheme(css, selector);

  it('metin ve arka plan AA (4.5:1) geçer', () => {
    expect(contrast(theme.fg, theme.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.fg, theme.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('soluk metin AA geçer', () => {
    expect(contrast(theme.muted, theme.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.muted, theme.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it('tehlike rengi AA geçer', () => {
    expect(contrast(theme.danger, theme.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.danger, theme.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('vurgu rengi arayüz bileşeni için 3:1 geçer', () => {
    expect(contrast(theme.accent, theme.bg)).toBeGreaterThanOrEqual(3);
  });
});
