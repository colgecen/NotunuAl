import { describe, expect, it } from 'vitest';
import { unzipSync } from 'fflate';
import { createNote } from '../noteRepo';
import { exportPdf } from './pdf';
import { exportPptx } from './pptx';

function noteWithBody(paragraphs: string[]) {
  return createNote({
    title: 'Şiir Başlığı',
    titleColor: '#ff0000',
    date: '2026-11-08',
    body: {
      type: 'doc',
      content: paragraphs.map((text) => ({
        type: 'paragraph',
        content: [
          { type: 'text', text, marks: [{ type: 'bold' }] },
          {
            type: 'text',
            text: ' İzgili Çiçek',
            marks: [{ type: 'textStyle', attrs: { color: '#00ff00', fontSize: '18px' } }],
          },
        ],
      })),
    },
  });
}

describe('pdf export', () => {
  it('starts with %PDF and embeds Liberation Sans', async () => {
    const bytes = await exportPdf(noteWithBody(['Çok uzun bir şiir metni ğüşiöç.']));
    const head = new TextDecoder('latin1').decode(bytes.slice(0, 5));
    expect(head).toBe('%PDF-');
    const raw = new TextDecoder('latin1').decode(bytes);
    expect(raw).toContain('LiberationSans');
  });

  it('splits long content into multiple pages', async () => {
    const long = Array.from({ length: 80 }, (_, i) => `Satır ${i} ğüşiöç içeriği`);
    const bytes = await exportPdf(noteWithBody(long));
    const raw = new TextDecoder('latin1').decode(bytes);
    const pages = raw.match(/\/Type\s*\/Page[^s]/g) ?? [];
    expect(pages.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a single-page short note', async () => {
    const bytes = await exportPdf(noteWithBody(['Kısa not.']));
    const raw = new TextDecoder('latin1').decode(bytes);
    const pages = raw.match(/\/Type\s*\/Page[^s]/g) ?? [];
    expect(pages).toHaveLength(1);
  });
});

describe('pptx export', () => {
  it('creates a valid zip with title and Turkish text on slide 1', async () => {
    const bytes = await exportPptx(noteWithBody(['Çiçek Şişli ğüşiöç']));
    const files = unzipSync(bytes);
    expect(files['ppt/presentation.xml']).toBeDefined();
    const slide1 = new TextDecoder().decode(files['ppt/slides/slide1.xml']);
    expect(slide1).toContain('Şiir Başlığı');
    expect(slide1).toContain('Çiçek Şişli ğüşiöç');
    expect(slide1).toContain('2026-11-08');
    expect(slide1).toContain('b="1"');
  });

  it('splits overflowing body into extra slides', async () => {
    const many = Array.from({ length: 15 }, (_, i) => `Blok ${i}`);
    const bytes = await exportPptx(noteWithBody(many));
    const files = unzipSync(bytes);
    const slideNames = Object.keys(files).filter(
      (n) => /^ppt\/slides\/slide\d+\.xml$/.test(n),
    );
    expect(slideNames.length).toBe(3);
    const last = new TextDecoder().decode(files['ppt/slides/slide3.xml']);
    expect(last).toContain('Blok 14');
  });
});
