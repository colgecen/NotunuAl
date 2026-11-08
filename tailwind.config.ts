import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        paper: 'var(--paper)',
      },
    },
  },
  plugins: [],
} satisfies Config;