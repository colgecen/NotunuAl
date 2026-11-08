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