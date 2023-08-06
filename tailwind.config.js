/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        textPrimary: "#000000",
        textSecondary: "#FFFFFF",
        textAccent: "#FFFF00",
        primary: "#EEFFEE",
        secondary: "#EE9999",
        accent: "#99EE99",
        secondaryAccent: "#EEFFEE",
        offWhite: "rgba(0,0,0,0.3)",
      },

      keyframes: {
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },

        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "fade-out": "fade-out 2s linear",
        "fade-in": "fade-in 2s linear",
      },
    },
  },
  plugins: [],
};
