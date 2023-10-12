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
    screens: {
      sm: "340px",
      // => @media (min-width: 340px) { ... }

      md: "680px",
      // => @media (min-width: 680px) { ... }

      lg: "724px",
      // => @media (min-width: 724px) { ... }

      xl: "1080px",
      // => @media (min-width: 1080px) { ... }

      "2xl": "1236px",
      // => @media (min-width: 1236px) { ... }
    },
    extend: {
      colors: {
        textPrimary: "#000000",
        textSecondary: "#FFFFFF",
        textAccent: "#FFFF00",
        accent: "#EEFFEE",
        secondary: "#EE9999",
        primary: "#99EE99",
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
        "fade-out": "fade-out 0.7s linear",
        "fade-in": "fade-in 0.7s linear",
      },
    },
  },
  plugins: [],
};
