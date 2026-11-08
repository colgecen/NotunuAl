import type { Note } from '../../types';
import { exportDocx } from './docx';
import { exportPdf } from './pdf';
import { exportPptx } from './pptx';
import { exportTxt } from './txt';
import { exportXlsx } from './xlsx';

export type ExportFormat = 'xlsx' | 'docx' | 'pptx' | 'pdf' | 'txt';

export const EXPORT_EXTENSIONS: Record<ExportFormat, string> = {
  xlsx: 'xlsx',
  docx: 'docx',
  pptx: 'pptx',
  pdf: 'pdf',
  txt: 'txt',
};

export const EXPORT_MIME: Record<ExportFormat, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pdf: 'application/pdf',
  txt: 'text/plain;charset=utf-8',
};

export async function exportNote(note: Note, format: ExportFormat): Promise<Uint8Array> {
  switch (format) {
    case 'txt':
      return exportTxt(note);
    case 'docx':
      return exportDocx(note);
    case 'xlsx':
      return exportXlsx(note);
    case 'pdf':
      return exportPdf(note);
    case 'pptx':
      return exportPptx(note);
  }
}

export function downloadBytes(fileName: string, bytes: Uint8Array, mime: string): void {
  if (typeof URL === 'undefined' || typeof document === 'undefined') return;
  const blobUrl = URL.createObjectURL(new Blob([bytes.slice()], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(blobUrl);
}
