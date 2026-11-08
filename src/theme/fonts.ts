import '@fontsource/arimo/400.css';
import '@fontsource/arimo/700.css';
import '@fontsource/arimo/400-italic.css';
import '@fontsource/arimo/700-italic.css';

import '@fontsource/tinos/400.css';
import '@fontsource/tinos/700.css';
import '@fontsource/tinos/400-italic.css';
import '@fontsource/tinos/700-italic.css';

import '@fontsource/gelasio/400.css';
import '@fontsource/gelasio/700.css';
import '@fontsource/gelasio/400-italic.css';
import '@fontsource/gelasio/700-italic.css';

import '@fontsource/cousine/400.css';
import '@fontsource/cousine/700.css';
import '@fontsource/cousine/400-italic.css';
import '@fontsource/cousine/700-italic.css';

import '@fontsource/dejavu-sans/400.css';
import '@fontsource/dejavu-sans/700.css';
import '@fontsource/dejavu-sans/400-italic.css';
import '@fontsource/dejavu-sans/700-italic.css';

import type { FontKey } from '../types';

export const FONT_DISPLAY: Record<FontKey, string> = {
  arial: 'Arial',
  times: 'Times New Roman',
  georgia: 'Georgia',
  courier: 'Courier New',
  verdana: 'Verdana',
};

export const FONT_STACKS: Record<FontKey, string> = {
  arial: 'Arial, "Arimo", sans-serif',
  times: '"Times New Roman", "Tinos", serif',
  georgia: 'Georgia, "Gelasio", serif',
  courier: '"Courier New", "Cousine", monospace',
  verdana: 'Verdana, "DejaVu Sans", sans-serif',
};

export const FONT_EXPORT: Record<FontKey, string> = {
  arial: 'Arial',
  times: 'Times New Roman',
  georgia: 'Georgia',
  courier: 'Courier New',
  verdana: 'Verdana',
};