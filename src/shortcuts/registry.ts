import { useSettingsStore } from '../store/settingsStore';
import { useUIStore } from '../store/uiStore';

export interface ShortcutContext {
  event: KeyboardEvent;
}

export interface Shortcut {
  keys: string;
  when?: (ctx: ShortcutContext) => boolean;
  run: (ctx: ShortcutContext) => void;
}

export function isTextInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
}



export const shortcuts: Shortcut[] = [
  {
    keys: 'ctrl+k',
    run: () => useSettingsStore.getState().toggleTheme(),
  },
  {
    keys: 'ctrl+n',
    when: () => useUIStore.getState().screen === 'list',
    run: () => useUIStore.getState().openNewNote(),
  },
  {
    keys: 'ctrl+s',
    when: () => useUIStore.getState().screen === 'editor',
    run: () => {
      // T09 implements save flush
    },
  },
  {
    keys: '.',
    when: (ctx) => !isTextInput(ctx.event.target),
    run: (ctx) => {
      ctx.event.preventDefault();
      useUIStore.getState().focusSearch();
    },
  },
  {
    keys: 'arrowdown',
    when: () => useUIStore.getState().screen === 'list',
    run: (ctx) => {
      ctx.event.preventDefault();
      useUIStore.getState().moveSelection(1);
    },
  },
  {
    keys: 'arrowup',
    when: () => useUIStore.getState().screen === 'list',
    run: (ctx) => {
      ctx.event.preventDefault();
      useUIStore.getState().moveSelection(-1);
    },
  },
  {
    keys: 'enter',
    when: () => useUIStore.getState().screen === 'list',
    run: () => {
      const { results, selectedIndex, openNote } = useUIStore.getState();
      if (results[selectedIndex]) openNote(results[selectedIndex].id);
    },
  },
  {
    keys: 'escape',
    run: (ctx) => {
      const ui = useUIStore.getState();
      if (ui.screen === 'editor') {
        ui.closeEditor();
      } else if (ui.search) {
        ui.setSearch('');
      } else if (ctx.event.target instanceof HTMLElement) {
        ctx.event.target.blur();
      }
    },
  },
];