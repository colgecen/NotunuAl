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
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/** Enter kısayolu, odaklı bir düğme/menü öğesinin kendi tıklamasıyla çakışmasın. */
function isInteractiveControl(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.closest('button, a[href], select, [role="menuitem"], [role="button"]') !== null
  );
}

export const shortcuts: Shortcut[] = [
  {
    keys: 'ctrl+k',
    run: (ctx) => {
      ctx.event.preventDefault();
      useSettingsStore.getState().toggleTheme();
    },
  },
  {
    keys: 'ctrl+n',
    run: (ctx) => {
      ctx.event.preventDefault();
      useUIStore.getState().newNote();
    },
  },
  {
    keys: 'ctrl+s',
    when: () => useUIStore.getState().screen === 'editor',
    run: (ctx) => {
      ctx.event.preventDefault();
      void useUIStore.getState().save();
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
    when: (ctx) =>
      useUIStore.getState().screen === 'list' &&
      !isInteractiveControl(ctx.event.target) &&
      !document.querySelector('[role="alertdialog"]'),
    run: () => {
      const { results, selectedIndex, openNote } = useUIStore.getState();
      if (results[selectedIndex]) openNote(results[selectedIndex].id);
    },
  },
  {
    keys: 'escape',
    run: (ctx) => {
      const ui = useUIStore.getState();
      // Açık onay penceresi ve menü kendi Esc davranışını yönetir.
      if (document.querySelector('[role="alertdialog"], [role="menu"]')) return;
      if (ui.screen === 'editor') {
        ctx.event.preventDefault();
        void ui.saveAndClose();
      } else if (ui.search) {
        ui.setSearch('');
      } else if (ctx.event.target instanceof HTMLElement) {
        ctx.event.target.blur();
      }
    },
  },
];