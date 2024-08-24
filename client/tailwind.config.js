/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-grey': '#121212',
        'spotify-grey-hover': '#202020',
        'spotify-green': '#1DB954',
        'spotify-green-dark': '#1AA34A',
        'spotify-green-light': '#1ED760',
        'spotify-green-darker': '#168D40',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
        loadingShimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
        textShine: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '60%': { backgroundPosition: '300% 50%' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'loading-shimmer': 'loadingShimmer 2s infinite linear',
        textShine: 'textShine 10s ease-in-out infinite',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      translate: ['group-hover'],
      opacity: ['group-hover'],
    },
  },
  plugins: [],
}
