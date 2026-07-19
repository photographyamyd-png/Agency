import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-source-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          foreground: "var(--surface-foreground)",
          raised: "var(--surface-raised)",
        },
        border: {
          DEFAULT: "var(--border)",
          bright: "var(--border-bright)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          muted: "var(--accent-muted)",
          bright: "var(--accent-bright)",
        },
        success: {
          DEFAULT: "var(--success)",
          muted: "var(--success-muted)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          muted: "var(--danger-muted)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          muted: "var(--warning-muted)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        ring: "var(--ring)",
        band: {
          a: "var(--band-a)",
          b: "var(--band-b)",
          accent: "var(--band-accent)",
        },
        mkt: {
          ink: "var(--mkt-ink)",
          paper: "var(--mkt-paper)",
          stone: "var(--mkt-stone)",
          accent: {
            DEFAULT: "var(--mkt-accent)",
            bright: "var(--mkt-accent-bright)",
            soft: "var(--mkt-accent-soft)",
          },
          text: "var(--mkt-text)",
          muted: "var(--mkt-muted)",
          border: "var(--mkt-border)",
          orange: {
            DEFAULT: "var(--mkt-orange)",
            bright: "var(--mkt-orange-bright)",
            deep: "var(--mkt-orange-deep)",
            muted: "var(--mkt-orange-muted)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "accent-glow": "0 0 24px var(--accent-glow)",
        "mkt-float": "0 24px 48px -12px rgba(12, 14, 18, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
