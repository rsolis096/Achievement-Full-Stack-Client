// tailwind.config.js
import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundColor: "#181a1b",
        foregroundColor: "#252626",
        navbarColor: "#414749",
      },
      height: {
        '11/12': '94%',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}