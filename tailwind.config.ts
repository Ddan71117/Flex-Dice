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
      },
      keyframes: {
        pulseNotify: {
          '0%': { transform: 'scale(1)' },          
          '10%': { transform: 'scale(1.1)' },       
          '20%': { transform: 'scale(1)' },         
          '30%': { transform: 'scale(1.1)' },       
          '40%': { transform: 'scale(1)' },         
          '80%': { transform: 'scale(1)' },        
          '100%': { transform: 'scale(1)' },        
        },
      },
      animation: {
        pulseNotify: 'pulseNotify 4s ease-in-out infinite', 
      },
    },
  },
  plugins: [],
} satisfies Config;
