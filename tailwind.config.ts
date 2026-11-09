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
        hover: 'var(--hover)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        accentfg: 'var(--accent-fg)',
        danger: 'var(--danger)',
      },
      boxShadow: {
        panel: 'var(--shadow)',
        float: 'var(--shadow-lg)',
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
