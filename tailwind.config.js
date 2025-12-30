/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}", // 添加 app 目录
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: "#000000",
        white: "#FFFFFF",
        gray: {
          100: "#DCDCDC",
          200: "#D9D9D9",
          300: "#7F7F7F",
        },
        blue: {
          50: "#F6FAFE",
          100: "#EDF5FC",
          150: "#E3F0FB",
          200: "#DAEBF9",
          300: "#C8E2F7",
          400: "#B5D8F4",
          500: "#A3CEF1",
          600: "#85B0D4",
          700: "#6793B6",
          800: "#4A7599",
          850: "#3B668A",
          900: "#2C587B",
          950: "#1D496D",
          1000: "#0E3A5E",
        },
        accent: "#AB8BFF",
      },
    },
  },
  plugins: [],
};
