/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        amber: {
          400: '#FBBF24',
          600: '#D97706',
        },
        indigo: {
          800: '#3730A3',
          900: '#1A365D',
          950: '#0F172A',
        },
      },
    },
  },
  plugins: [],
};