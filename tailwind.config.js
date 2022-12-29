/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        eth: "url('/eth.jpeg')",
      },
    },
    fontFamily: {
      rubik: ["Rubik Vinyl", "cursive"],
      kanit: ["Kanit", "sans-serif"],
    },
  },
  plugins: [],
};
