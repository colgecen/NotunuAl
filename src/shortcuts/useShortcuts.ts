import { useEffect } from 'react';
import { shortcuts, type ShortcutContext } from './registry';
import type { Shortcut } from './registry';

function keyMatch(event: KeyboardEvent, keys: string): boolean {
  const parts = keys.toLowerCase().split('+');
  const ctrl = parts.includes('ctrl');
  const shift = parts.includes('shift');
  const alt = parts.includes('alt');
  const meta = parts.includes('meta');
  const key = parts.filter((p) => !['ctrl', 'shift', 'alt', 'meta'].includes(p)).join('+');
  const eventKey = event.key.toLowerCase();
  return (
    event.ctrlKey === ctrl &&
    event.metaKey === meta &&
    event.shiftKey === shift &&
    event.altKey === alt &&
    eventKey === key
  );
}

export function useShortcuts() {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const ctx: ShortcutContext = { event };
      for (const shortcut of shortcuts as Shortcut[]) {
        if (keyMatch(event, shortcut.keys) && (!shortcut.when || shortcut.when(ctx))) {
          shortcut.run(ctx);
          return;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}