/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Fonts are now defined via CSS variables in index.css @theme inline
      // --font-sans, --font-serif, --font-mono
    },
  },
  plugins: [require("tailwindcss-animate")],
};
