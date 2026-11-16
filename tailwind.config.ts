import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        chrome: 'var(--chrome)',
        control: 'var(--control)',
        elevated: 'var(--elevated)',
        hover: 'var(--hover)',
        selection: 'var(--selection)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        accentfg: 'var(--accent-fg)',
        danger: 'var(--danger)',
        dangerfg: 'var(--danger-fg)',
      },
      boxShadow: {
        panel: 'var(--shadow)',
        float: 'var(--shadow-lg)',
      },
      borderRadius: {
        card: '12px',
        window: '14px',
      },
    },
  },
  plugins: [],
} satisfies Config;
