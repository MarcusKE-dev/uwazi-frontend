/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'uwazi-navy':  '#0A1628',
        'uwazi-dark':  '#0F1E35',
        'uwazi-mid':   '#162440',
        'uwazi-blue':  '#1B4FD8',
        'uwazi-sky':   '#2563EB',
        'uwazi-light': '#3B82F6',
        'uwazi-pale':  '#DBEAFE',
        'uwazi-muted': '#93C5FD',
      },
    },
  },
  plugins: [],
};
