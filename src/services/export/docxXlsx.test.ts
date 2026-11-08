import { describe, expect, it } from 'vitest';
import { unzipSync } from 'fflate';
import * as XLSX from 'xlsx';
import { createNote } from '../noteRepo';
import { exportDocx } from './docx';
import { exportXlsx } from './xlsx';

describe('docx and xlsx export', () => {
  it('creates DOCX zip preserving formatting and Turkish text', async () => {
    const note = createNote({
      title: 'Şiir',
      body: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Çiçek', marks: [{ type: 'bold' }] },
              {
                type: 'text',
                text: ' vurgu',
                marks: [{ type: 'highlight', attrs: { color: '#fff200' } }],
              },
            ],
          },
        ],
      },
    });
    const bytes = await exportDocx(note);
    const files = unzipSync(bytes);
    const xml = new TextDecoder().decode(files['word/document.xml']);
    expect(xml).toContain('Şiir');
    expect(xml).toContain('Çiçek');
    expect(xml).toContain('w:b');
    expect(xml.toLowerCase()).toContain('fff200');
  });

  it('creates XLSX with title A1, body A2, date A3', () => {
    const note = createNote({
      title: 'Özet',
      body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Işık' }] }] },
      date: '2026-11-08',
    });
    const bytes = exportXlsx(note);
    const wb = XLSX.read(bytes, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    expect(ws.A1.v).toBe('Özet');
    expect(ws.A2.v).toBe('Işık');
    expect(ws.A3.v).toBe('2026-11-08');
  });
});