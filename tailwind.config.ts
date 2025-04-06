import { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rover-dark-blue': '#0D1117',
        'rover-secondary': '#161B22',
        'rover-grey': '#C9D1D9',
        'rover-turquoise': '#1affa2',
        'rover-blue-accent': '#1F6FEB',
        'rover-blue-active': '#55B2FF'
      },
      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

