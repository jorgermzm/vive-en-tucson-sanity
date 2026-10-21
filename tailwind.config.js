/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './sanity/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {navy:'#1b140d',green:'#149b62',sand:'#fdfbf7',sun:'#e9ab32'},
      boxShadow: {card:'0 10px 30px rgba(27,20,13,.10)'},
    },
  },
  plugins: [],
}
