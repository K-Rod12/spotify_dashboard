/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-grey': '#121212',
        'spotify-green': '#1DB954',
      }
    }
  },
  plugins: [],
}

