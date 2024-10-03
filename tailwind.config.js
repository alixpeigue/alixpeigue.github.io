/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: 'var(--primary)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      background: 'var(--background)',
    },
  },
  plugins: [],
}

