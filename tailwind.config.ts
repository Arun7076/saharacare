import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#041C1A",
          900: "#083430",
          800: "#0E4742",
          700: "#13413D",
          600: "#17615A",
          500: "#1F7A71",
        },
        mint: {
          50: "#F4FAF9",
          100: "#EAF6F4",
          200: "#D3ECE8",
          300: "#B8E0DA",
          400: "#8FCBC3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
