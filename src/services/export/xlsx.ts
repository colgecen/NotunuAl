import * as XLSX from 'xlsx';
import type { Note } from '../../types';
import { buildExportDoc, blockText } from './model';

export function exportXlsx(note: Note): Uint8Array {
  const doc = buildExportDoc(note);
  const title = doc.title.map((r) => r.text).join('');
  const body = doc.blocks.map(blockText).join('\n');
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    [title],
    [body],
    [doc.date ?? ''],
  ]);
  ws['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Not');
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  return new Uint8Array(buffer);
}