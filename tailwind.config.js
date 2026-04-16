/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── UWAZI brand palette ──────────────────
        'uwazi-navy':   '#0A1628',  // Page background (dark)
        'uwazi-dark':   '#0F1E35',  // Card background (dark)
        'uwazi-mid':    '#1B3A6B',  // Sidebar accent
        'uwazi-blue':   '#1B4FD8',  // Primary brand blue
        'uwazi-accent': '#2563EB',  // Buttons, active items
        'uwazi-light':  '#3B82F6',  // Hover states
        'uwazi-pale':   '#DBEAFE',  // Light backgrounds
        'uwazi-mist':   '#EFF6FF',  // Very light blue tints
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};