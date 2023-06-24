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
        'text': '#000000',
        'textSecondary': '#FFFFFF',
        'textAccent': '#FFFF00',
        'primary': '#EEFFEE',
        'secondary': '#EE9999',
        'accent': '#99EE99',
        'secondaryAccent': '#EEFFEE',
      },
    },
  },
  plugins: [],
}

