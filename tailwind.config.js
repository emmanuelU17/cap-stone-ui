/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        '--input-border': 'var(--input-border)',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        15: '15',
      },
      display: ['group-hover'],
    },
  },
  plugins: [],
};
