/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'banner': "url('/images/updated-banner.webp')"
      }
    }
  },
  plugins: []
};