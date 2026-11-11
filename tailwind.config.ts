import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-tint": "var(--surface-tint)",
        ink: {
          DEFAULT: "var(--ink)",
          body: "var(--ink-body)",
          muted: "var(--ink-muted)",
        },
        border: "var(--border)",
        brand: {
          DEFAULT: "var(--brand)",
          hover: "var(--brand-hover)",
          deep: "var(--brand-deep)",
        },
        accent: "var(--accent)",
        "footer-text": "var(--footer-text)",
        focus: "var(--focus)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "r-sm": "var(--r-sm)",
        "r-md": "var(--r-md)",
        "r-lg": "var(--r-lg)",
        "r-xl": "var(--r-xl)",
        "r-pill": "var(--r-pill)",
      },
      boxShadow: {
        overlay: "0 12px 32px rgba(27, 21, 48, 0.18)",
      },
      maxWidth: {
        container: "1380px",
        prose: "760px",
      },
    },
  },
  plugins: [],
};

export default config;
