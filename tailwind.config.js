/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue':   '#1D4ED8',
        'brand-yellow': '#FCD34D',
        'brand-coral':  '#F97316',
        'brand-green':  '#16A34A',
        'brand-navy':   '#0F172A',
        'brand-cream':  '#FFFBF0',
        'brand-red':    '#DC2626',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
