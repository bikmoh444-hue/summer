import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5A623",
        coral: "#FF6B6B",
        ocean: "#1a3a4a",
        "ocean-light": "#2a5a6a",
        ink: "#14323f",
        sun: "#ffd166",
        foam: "#eefcff"
      },
      boxShadow: {
        soft: "0 16px 48px rgba(20, 50, 63, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
