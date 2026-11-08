import type { JSONContent } from '@tiptap/core';

export type FontKey = 'arial' | 'times' | 'georgia' | 'courier' | 'verdana';
export type ViewMode = 'rows' | 'icons' | 'home';
export type Theme = 'light' | 'dark';

export interface Note {
  id: string;
  title: string;
  titleColor: string | null;
  titleFont: FontKey | null;
  body: JSONContent;
  bodyText: string;
  date: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  theme: Theme;
  viewMode: ViewMode;
  bodyFontSize: number;
  bodyFont: FontKey;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  viewMode: 'home',
  bodyFontSize: 16,
  bodyFont: 'arial',
};