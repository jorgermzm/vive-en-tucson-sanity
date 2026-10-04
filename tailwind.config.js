/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './sanity/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {navy:'#0d2344',green:'#149b62',sand:'#f7f3ed',sun:'#ffd553'},
      boxShadow: {card:'0 10px 30px rgba(13,35,68,.10)'},
    },
  },
  plugins: [],
}
