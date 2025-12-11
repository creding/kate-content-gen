/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Fonts are now defined via CSS variables in index.css @theme inline
      // --font-sans, --font-serif, --font-mono
    },
  },
  plugins: [require("tailwindcss-animate")],
};
