import type { ExportFormat } from './export';

export interface SaveOutcome {
  status: 'saved' | 'cancelled' | 'error';
  path?: string;
  message?: string;
}

const FILTER_NAMES: Record<ExportFormat, string> = {
  xlsx: 'Excel',
  docx: 'Word',
  pptx: 'PowerPoint',
  pdf: 'PDF',
  txt: 'Düz metin',
};

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function saveBytes(
  fileName: string,
  bytes: Uint8Array,
  format: ExportFormat,
): Promise<SaveOutcome> {
  if (isTauri()) {
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const chosen = await save({
        defaultPath: fileName,
        filters: [{ name: FILTER_NAMES[format], extensions: [format] }],
      });
      if (!chosen) return { status: 'cancelled' };
      const { writeFile } = await import('@tauri-apps/plugin-fs');
      await writeFile(chosen, bytes);
      return { status: 'saved', path: chosen };
    } catch (err) {
      return { status: 'error', message: errorMessage(err) };
    }
  }
  try {
    const { EXPORT_MIME, downloadBytes } = await import('./export');
    downloadBytes(fileName, bytes, EXPORT_MIME[format]);
    return { status: 'saved', path: fileName };
  } catch (err) {
    return { status: 'error', message: errorMessage(err) };
  }
}
