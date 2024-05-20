/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
      },
      screens: {
        tablet: '485px',
        desktop: '868px',
      },
    },
  },
  plugins: [],
}
