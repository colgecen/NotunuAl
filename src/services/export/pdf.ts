import { jsPDF } from 'jspdf';
import type { Note } from '../../types';
import { buildExportDoc, type Block, type Run } from './model';
import { pdfFonts } from './pdfFonts';

type Style = {
  bold?: boolean;
  italic?: boolean;
  size: number;
  color?: string;
  highlight?: string;
};

function hexToRgb(color?: string): [number, number, number] {
  if (!color) return [0, 0, 0];
  const c = color.replace('#', '');
  const expanded = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  const num = Number.parseInt(expanded, 16);
  if (Number.isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function styleFromRun(run: Run, fallback: number): Style {
  return {
    bold: run.bold,
    italic: run.italic,
    size: run.size ?? fallback,
    color: run.color,
    highlight: run.highlight,
  };
}

function applyStyle(doc: jsPDF, style: Style) {
  const styleName = style.bold && style.italic ? 'bolditalic' : style.bold ? 'bold' : style.italic ? 'italic' : 'normal';
  doc.setFont('LiberationSans', styleName);
  doc.setFontSize(style.size);
  const [r, g, b] = hexToRgb(style.color);
  doc.setTextColor(r, g, b);
}

function charWidth(doc: jsPDF, ch: string): number {
  return doc.getTextWidth(ch);
}

export async function exportPdf(note: Note, defaultSize = 16): Promise<Uint8Array> {
  const doc = buildExportDoc(note);
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const registrations: [string, { name: string; base64: () => string }][] = [
    ['normal', pdfFonts.regular],
    ['bold', pdfFonts.bold],
    ['italic', pdfFonts.italic],
    ['bolditalic', pdfFonts.boldItalic],
  ];
  for (const [style, font] of registrations) {
    pdf.addFileToVFS(font.name, font.base64());
    pdf.addFont(font.name, 'LiberationSans', style);
  }
  pdf.setFont('LiberationSans', 'normal');

  const margin = 42;
  const maxWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  let x = margin;
  let y = margin + 12;

  const newPage = () => {
    pdf.addPage();
    pdf.setFont('LiberationSans', 'normal');
    x = margin;
    y = margin + 12;
  };

  const ensureLine = (size: number) => {
    if (y + size * 1.25 > pdf.internal.pageSize.getHeight() - margin) newPage();
  };

  const drawBlock = (runs: Run[], fallback: number, lineHeight: number) => {
    if (runs.length === 0) {
      y += lineHeight;
      return;
    }
    for (const run of runs) {
      const style = styleFromRun(run, fallback);
      applyStyle(pdf, style);
      let line = '';
      let lineWidth = 0;
      const flushLine = () => {
        if (!line) return;
        ensureLine(style.size);
        if (style.highlight) {
          const [r, g, b] = hexToRgb(style.highlight);
          pdf.setFillColor(r, g, b);
          pdf.rect(x - 1, y - style.size * 0.82, lineWidth + 2, style.size * 1.1, 'F');
        }
        pdf.text(line, x, y);
        line = '';
        lineWidth = 0;
        y += lineHeight;
      };
      for (const ch of run.text) {
        if (ch === '\n') {
          flushLine();
          continue;
        }
        const cw = charWidth(pdf, ch);
        if (lineWidth + cw > maxWidth) flushLine();
        line += ch;
        lineWidth += cw;
      }
      flushLine();
    }
  };

  if (doc.title.length > 0) {
    drawBlock(doc.title.map((r) => ({ ...r, size: defaultSize + 6, bold: true })), defaultSize + 6, defaultSize + 14);
    y += 8;
  }
  if (doc.date) {
    drawBlock([{ text: doc.date, italic: true, size: defaultSize - 2 }], defaultSize - 2, defaultSize);
    y += 8;
  }
  const blockLineHeight = (b: Block) => defaultSize + 6 + (b.type === 'heading' ? 4 : 0);
  for (const block of doc.blocks) {
    const prefix = block.type === 'bullet' ? '• ' : block.type === 'ordered' ? '• ' : '';
    const runs = prefix && block.runs.length > 0 ? [{ text: prefix }, ...block.runs] : block.runs;
    drawBlock(runs, block.type === 'heading' ? defaultSize + 2 : defaultSize, blockLineHeight(block));
  }

  const bytes = pdf.output('arraybuffer') as ArrayBuffer;
  return new Uint8Array(bytes);
}