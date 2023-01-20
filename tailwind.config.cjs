/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#424874",
        "primary-light": "#42487433",
        "tertiary":'#A6B1E1',
        "secondary":"#EFCB68"
      }
    },
  },
  plugins: [],
}