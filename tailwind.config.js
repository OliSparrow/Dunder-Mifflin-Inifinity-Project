/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGray: '#f0f0f0', //Background color
        primaryBlue: '#0047AB', //Button and header blue
        textBlack: '#333333',   //Dark text color
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mifflintheme: {
          primary: '#0047AB',
          'base-100': '#EEEEEE',
          'base-content': '#333333',
        },
      },
    ],
  },
};