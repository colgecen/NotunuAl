import { describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { FONT_STACKS } from '../theme/fonts';

function makeEditor() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return new Editor({
    element,
    extensions: [StarterKit, TextStyleKit, Highlight.configure({ multicolor: true })],
    content: '<p>merhaba dünya</p>',
  });
}

describe('editor format marks', () => {
  it('writes bold/italic/color/highlight/font/size into JSON', () => {
    const editor = makeEditor();
    editor.commands.selectAll();
    editor.commands.setBold();
    editor.commands.setItalic();
    editor.commands.setColor('#ff0000');
    editor.commands.toggleHighlight({ color: '#fff200' });
    editor.commands.setFontFamily(FONT_STACKS.verdana);
    editor.commands.setFontSize('20px');
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('bold');
    expect(json).toContain('italic');
    expect(json).toContain('#ff0000');
    expect(json).toContain('#fff200');
    expect(json).toContain('Verdana');
    expect(json).toContain('20px');
    editor.destroy();
  });
});