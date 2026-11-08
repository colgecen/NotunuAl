import PptxGenJS from 'pptxgenjs';
import type { Note } from '../../types';
import { buildExportDoc, type Block, type Run } from './model';
import { FONT_EXPORT } from '../../theme/fonts';

function runOptions(run: Run, defaultSize: number) {
  return {
    bold: run.bold ?? false,
    italic: run.italic ?? false,
    color: run.color?.replace('#', '') ?? '000000',
    fontFace: run.font ? FONT_EXPORT[run.font] : 'Arial',
    fontSize: (run.size ?? defaultSize) * 0.75,
  };
}

function blocksToTextProps(blocks: Block[], defaultSize: number, startFromFirst = true) {
  const items: { text: string; options: Record<string, unknown> }[] = [];
  blocks.forEach((block, blockIndex) => {
    const blockOptions = {
      bullet: block.type === 'bullet' || block.type === 'ordered',
      fontSize: (block.type === 'heading' ? defaultSize + 4 : defaultSize) * 0.75,
    };
    block.runs.forEach((run, runIndex) => {
      items.push({
        text: run.text,
        options: {
          ...runOptions(run, defaultSize),
          ...blockOptions,
          bullet: blockOptions.bullet && runIndex === 0,
          breakLine:
            runIndex === block.runs.length - 1 &&
            (blockIndex < blocks.length - 1 || !startFromFirst),
        },
      });
    });
    if (block.runs.length === 0) {
      items.push({
        text: '',
        options: {
          ...blockOptions,
          breakLine: blockIndex < blocks.length - 1,
        },
      });
    }
  });
  return items;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function exportPptx(note: Note, defaultSize = 18): Promise<Uint8Array> {
  const doc = buildExportDoc(note);
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'A4', width: 10, height: 7.5 });
  pptx.layout = 'A4';

  const titleText = doc.title.map((r) => r.text).join('');
  const chunks = chunk(doc.blocks, 7);
  const first = chunks[0] ?? [];

  const s1 = pptx.addSlide();
  s1.addText(titleText || 'Not', { x: 0.5, y: 0.35, w: 9, h: 1, fontSize: 36, bold: true, color: doc.titleColor?.replace('#', '') ?? '000000' });
  if (doc.date) {
    s1.addText(doc.date, { x: 0.5, y: 1.35, w: 9, h: 0.4, fontSize: 14, italic: true });
  }
  if (first.length > 0) {
    s1.addText(blocksToTextProps(first, defaultSize, true), { x: 0.5, y: 1.85, w: 9, h: 5.2, valign: 'top' });
  }

  for (const blockChunk of chunks.slice(1)) {
    const slide = pptx.addSlide();
    slide.addText(titleText || 'Not', { x: 0.5, y: 0.35, w: 9, h: 0.8, fontSize: 28, bold: true });
    slide.addText(blocksToTextProps(blockChunk, defaultSize, false), { x: 0.5, y: 1.35, w: 9, h: 5.6, valign: 'top' });
  }

  const buffer = (await pptx.write({ outputType: 'arraybuffer' })) as ArrayBuffer;
  return new Uint8Array(buffer);
}