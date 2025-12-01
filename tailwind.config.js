/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Defined in app/globals.css using CSS variables
        'brand-brown-light': 'var(--color-brand-brown-light)',
        'brand-brown-dark': 'var(--color-brand-brown-dark)',
        'brand-gold': 'var(--color-brand-gold)',
        'brand-sand': 'var(--color-brand-sand)',
      },
      fontFamily: {
        // Map custom fonts
        heading: ['AgencyRegular', 'sans-serif'], // For titles and headers
        body: ['LatoRegular', 'sans-serif'],     // For body text
      },
      backgroundImage: {
        // Map the hero image
        'hero': "url('/hero.jpg')",
      }
    },
  },
  plugins: [],
}