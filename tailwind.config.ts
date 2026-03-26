import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A7C59",
          dark: "#3A6147",
        },
        accent: "#E8B86D",
        background: "#FAFAF7",
        surface: "#FFFFFF",
        border: "#E8E5DC",
        text: {
          primary: "#1C1C1A",
          secondary: "#6B6B66",
        },
        danger: "#C94040",
        success: "#4A7C59",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
      },
    },
  },
  plugins: [],
};
export default config;
