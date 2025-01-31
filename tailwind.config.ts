import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'gray-700': '#2d3748',
        'gray-600': '#4a5568',
        'gray-900': '#1a202c',
      },
      animation: {
        gradient: 'gradient 30s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      backgroundImage: {
        'gray-gradient': 'linear-gradient(-45deg, #2d3748, #2d3748, #4a5568, #1a202c)',
      },  
    },
  },
  plugins: [],
} satisfies Config;
