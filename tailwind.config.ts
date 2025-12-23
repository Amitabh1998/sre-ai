import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3c83f6",
        "background-light": "#f5f7f8",
        "background-dark": "#101723",
        "surface-dark": "#1A2434",
        "severity-p1": "#EF4444",
        "severity-p2": "#F59E0B",
        "severity-p3": "#EAB308",
        success: "#10B981",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
export default config;

