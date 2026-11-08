import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ShadingType,
  type IRunOptions,
} from 'docx';
import type { Note } from '../../types';
import { buildExportDoc, type Run } from './model';
import { FONT_EXPORT } from '../../theme/fonts';

function halfPointSize(size?: number): number | undefined {
  return size ? Math.round(size * 2) : undefined;
}

function toTextRun(run: Run, defaultSize: number): TextRun {
  const options: IRunOptions = {
    text: run.text,
    bold: run.bold,
    italics: run.italic,
    size: halfPointSize(run.size ?? defaultSize),
    color: run.color?.replace('#', ''),
    font: run.font ? FONT_EXPORT[run.font] : undefined,
    shading: run.highlight
      ? { type: ShadingType.CLEAR, color: 'auto', fill: run.highlight.replace('#', '') }
      : undefined,
  };
  return new TextRun(options);
}

export async function exportDocx(note: Note, defaultSize = 16): Promise<Uint8Array> {
  const doc = buildExportDoc(note);
  const children: Paragraph[] = [];
  if (doc.title.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: doc.title.map((r) => toTextRun({ ...r, size: undefined }, defaultSize + 6)),
      }),
    );
  }
  if (doc.date) {
    children.push(new Paragraph({ children: [new TextRun({ text: doc.date, italics: true })] }));
  }
  for (const block of doc.blocks) {
    children.push(
      new Paragraph({
        children: block.runs.map((r) => toTextRun(r, defaultSize)),
      }),
    );
  }
  const file = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(file);
  return new Uint8Array(buffer);
}