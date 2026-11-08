import type { Note } from '../../types';
import { buildExportDoc, docToPlainText } from './model';

export function exportTxt(note: Note): Uint8Array {
  const doc = buildExportDoc(note);
  const text = docToPlainText(doc) + '\n';
  return new TextEncoder().encode(text);
}

export function cleanFileName(title: string): string {
  const cleaned = title
    .replace(/[/\\:*?"<>|]/g, '')
    .trim()
    .slice(0, 80);
  return cleaned.length > 0 ? cleaned : 'Adsiz-Not';
}