import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        pearl: "var(--pearl)",
        sky: "var(--sky)",
        powder: "var(--powder)",
        lavender: "var(--lavender)",
        blush: "var(--blush)",
        champagne: "var(--champagne)",
        gold: "var(--gold)",
        "gold-soft": "var(--gold-soft)",
        mint: "var(--mint)",
        "rh-green": "var(--rh-green)",
        "rh-pale": "var(--rh-pale)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        pixel: ["var(--font-pixel)", "monospace"],
      },
      maxWidth: {
        page: "80rem",
      },
    },
  },
  plugins: [],
};
export default config;
