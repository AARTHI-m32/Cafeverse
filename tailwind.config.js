/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          light: '#f5f0e6',
          DEFAULT: '#8b5a2b',
          dark: '#3b2f2f',
          accent: '#c88c51'
        }
      }
    },
  },
  plugins: [],
}
