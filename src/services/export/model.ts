import type { JSONContent } from '@tiptap/core';
import type { FontKey, Note } from '../../types';

export interface Run {
  text: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  highlight?: string;
  font?: FontKey;
  size?: number;
  fontFamily?: string;
}

export type BlockType = 'paragraph' | 'heading' | 'bullet' | 'ordered';

export interface Block {
  type: BlockType;
  level?: number;
  runs: Run[];
}

export interface ExportDoc {
  title: Run[];
  titleColor: string | null;
  date: string | null;
  blocks: Block[];
}

function fontKeyFromFamily(family?: string): FontKey | undefined {
  if (!family) return undefined;
  const f = family.toLowerCase();
  if (f.includes('arimo') || f.includes('arial')) return 'arial';
  if (f.includes('tinos') || f.includes('times')) return 'times';
  if (f.includes('gelasio') || f.includes('georgia')) return 'georgia';
  if (f.includes('cousine') || f.includes('courier')) return 'courier';
  if (f.includes('dejavu') || f.includes('verdana')) return 'verdana';
  return undefined;
}

function markAttr(marks: JSONContent['marks'], type: string) {
  return marks?.find((m) => m.type === type)?.attrs as Record<string, unknown> | undefined;
}

function nodeToRun(node: JSONContent): Run | null {
  if (node.type !== 'text' || typeof node.text !== 'string') return null;
  const marks = node.marks ?? [];
  const textStyle = markAttr(marks, 'textStyle');
  const highlight = markAttr(marks, 'highlight');
  const fontSizeRaw = textStyle?.fontSize;
  const size =
    typeof fontSizeRaw === 'number'
      ? fontSizeRaw
      : typeof fontSizeRaw === 'string'
        ? parseInt(fontSizeRaw, 10)
        : undefined;
  return {
    text: node.text,
    bold: marks.some((m) => m.type === 'bold') || undefined,
    italic: marks.some((m) => m.type === 'italic') || undefined,
    color: typeof textStyle?.color === 'string' ? textStyle.color : undefined,
    highlight: typeof highlight?.color === 'string' ? highlight.color : undefined,
    fontFamily: typeof textStyle?.fontFamily === 'string' ? textStyle.fontFamily : undefined,
    font: fontKeyFromFamily(typeof textStyle?.fontFamily === 'string' ? textStyle.fontFamily : undefined),
    size: Number.isNaN(size) ? undefined : size,
  };
}

function collectRuns(nodes: JSONContent[] | undefined, out: Run[]) {
  if (!nodes) return;
  for (const node of nodes) {
    const run = nodeToRun(node);
    if (run) out.push(run);
    else if (node.content) collectRuns(node.content, out);
  }
}

function nodeToBlocks(node: JSONContent): Block[] {
  if (node.type === 'bullet_list' || node.type === 'ordered_list') {
    const type: BlockType = node.type === 'bullet_list' ? 'bullet' : 'ordered';
    const blocks: Block[] = [];
    for (const item of node.content ?? []) {
      const runs: Run[] = [];
      collectRuns(item.content, runs);
      if (runs.length > 0) blocks.push({ type, runs });
      else blocks.push({ type, runs: [{ text: '' }] });
    }
    return blocks;
  }
  if (node.type === 'paragraph' || node.type === 'heading') {
    const runs: Run[] = [];
    collectRuns(node.content, runs);
    return [
      {
        type: node.type === 'heading' ? 'heading' : 'paragraph',
        level: typeof node.attrs?.level === 'number' ? node.attrs.level : undefined,
        runs,
      },
    ];
  }
  if (node.content) {
    return node.content.flatMap(nodeToBlocks);
  }
  return [];
}

export function buildExportDoc(note: Note): ExportDoc {
  const title: Run[] = note.title
    ? [{ text: note.title, color: note.titleColor ?? undefined, font: note.titleFont ?? undefined }]
    : [];
  const blocks = nodeToBlocks(note.body);
  return { title, titleColor: note.titleColor, date: note.date, blocks };
}

export function blockText(block: Block): string {
  return block.runs.map((r) => r.text).join('');
}

export function docToPlainText(doc: ExportDoc): string {
  const title = doc.title.map((r) => r.text).join('');
  const body = doc.blocks.map(blockText).filter((line) => line.trim().length > 0).join('\n');
  return [title, '', body, doc.date ? `\n${doc.date}` : ''].join('\n').trim();
}