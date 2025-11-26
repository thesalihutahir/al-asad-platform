/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'asad-gold': '#d17600',
        'asad-dark-brown': '#432e16',
        'asad-brown': '#655037',
        'asad-white': '#ffffff'
      },
      borderRadius: {
        'asad': '14px'
      },
      fontFamily: {
        'heading': ['Agency', 'system-ui', 'sans-serif'],
        'body': ['Lato', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}
