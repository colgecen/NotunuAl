import { describe, expect, it } from 'vitest';
import { buildExportDoc, docToPlainText } from './model';
import { exportTxt, cleanFileName } from './txt';
import { createNote } from '../noteRepo';

describe('export model', () => {
  it('converts TipTap marks to runs', () => {
    const note = createNote({
      title: 'Önemli',
      titleColor: '#123456',
      titleFont: 'georgia',
      body: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'kalın ', marks: [{ type: 'bold' }] },
              {
                type: 'text',
                text: 'renkli',
                marks: [{ type: 'textStyle', attrs: { color: '#ff0000', fontSize: '20px' } }],
              },
            ],
          },
        ],
      },
    });
    const doc = buildExportDoc(note);
    expect(doc.title[0]?.color).toBe('#123456');
    expect(doc.title[0]?.font).toBe('georgia');
    expect(doc.blocks[0]?.runs[0]?.bold).toBe(true);
    expect(doc.blocks[0]?.runs[1]?.color).toBe('#ff0000');
    expect(doc.blocks[0]?.runs[1]?.size).toBe(20);
  });

  it('writes plain text with Turkish characters', () => {
    const bytes = exportTxt(
      createNote({ title: 'Çiçek', bodyText: 'Şişli', body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Şişli' }] }] } }),
    );
    const text = new TextDecoder().decode(bytes);
    expect(text).toContain('Çiçek');
    expect(text).toContain('Şişli');
    expect(docToPlainText(buildExportDoc(createNote({ title: 'A', body: { type: 'doc' } })))).toContain('A');
  });

  it('cleans file names', () => {
    expect(cleanFileName('A/B:C*?')).toBe('ABC');
    expect(cleanFileName('   ')).toBe('Adsiz-Not');
    expect(cleanFileName('Çoklu kelime')).toBe('Çoklu kelime');
  });
});