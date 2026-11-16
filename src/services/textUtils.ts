import type { JSONContent } from '@tiptap/core';

export function extractBodyText(doc: JSONContent | null | undefined): string {
  if (!doc) return '';
  const parts: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.type === 'text' && typeof node.text === 'string') {
      parts.push(node.text);
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
      if (node.type === 'paragraph' || node.type === 'heading') {
        parts.push('\n');
      }
    }
  };
  walk(doc);
  return parts.join('').replace(/\n+$/g, '').trim();
}

const TR_MONTHS = [
  'Oca',
  'Şub',
  'Mar',
  'Nis',
  'May',
  'Haz',
  'Tem',
  'Ağu',
  'Eyl',
  'Eki',
  'Kas',
  'Ara',
];

/**
 * ISO tarihi (YYYY-MM-DD) listede okunur biçime çevirir: 2026-11-16 → "16 Kas 2026".
 * Geçersiz veya boş değer olduğu gibi döner.
 */
export function formatNoteDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  const monthName = TR_MONTHS[monthIndex];
  if (!monthName) return iso;
  return `${Number(day)} ${monthName} ${year}`;
}