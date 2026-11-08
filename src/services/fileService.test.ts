import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveBytes } from './fileService';
import { downloadBytes } from './export';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';

vi.mock('./export', () => ({
  EXPORT_MIME: {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    pdf: 'application/pdf',
    txt: 'text/plain;charset=utf-8',
  },
  downloadBytes: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-dialog', () => ({ save: vi.fn() }));
vi.mock('@tauri-apps/plugin-fs', () => ({ writeFile: vi.fn() }));

const bytes = new TextEncoder().encode('içerik');

describe('fileService.saveBytes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
  });

  it('falls back to download in web mode', async () => {
    const outcome = await saveBytes('Not.txt', bytes, 'txt');
    expect(outcome.status).toBe('saved');
    expect(downloadBytes).toHaveBeenCalledWith('Not.txt', bytes, 'text/plain;charset=utf-8');
    expect(save).not.toHaveBeenCalled();
  });

  it('saves via native dialog and fs in Tauri mode', async () => {
    (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {};
    vi.mocked(save).mockResolvedValueOnce('/home/user/Masaüstü/Şiir.pdf');
    const outcome = await saveBytes('Şiir.pdf', bytes, 'pdf');
    expect(save).toHaveBeenCalledWith({
      defaultPath: 'Şiir.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    expect(writeFile).toHaveBeenCalledWith('/home/user/Masaüstü/Şiir.pdf', bytes);
    expect(outcome).toEqual({ status: 'saved', path: '/home/user/Masaüstü/Şiir.pdf' });
  });

  it('reports cancelled when dialog returns null', async () => {
    (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {};
    vi.mocked(save).mockResolvedValueOnce(null);
    const outcome = await saveBytes('Not.txt', bytes, 'txt');
    expect(outcome.status).toBe('cancelled');
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('reports error when write fails', async () => {
    (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {};
    vi.mocked(save).mockResolvedValueOnce('/tmp/x.txt');
    vi.mocked(writeFile).mockRejectedValueOnce(new Error('izin yok'));
    const outcome = await saveBytes('Not.txt', bytes, 'txt');
    expect(outcome.status).toBe('error');
    expect(outcome.message).toBe('izin yok');
  });
});
