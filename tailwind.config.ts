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
                gold: {
                    light: '#FDE047', // Yellow 300 base
                    DEFAULT: '#FFD700', // Classic Gold
                    dark: '#B8860B',  // Dark Goldenrod
                    rich: '#D4AF37',  // Metallic Gold
                },
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #D4AF37 100%)',
                'gold-vertical': 'linear-gradient(to bottom, #FFD700, #B8860B)',
            },
            boxShadow: {
                'gold-glow': '0 0 15px rgba(255, 215, 0, 0.6)',
                'gold-sm': '0 0 5px rgba(255, 215, 0, 0.4)',
            },
            animation: {
                'shine': 'shine 2s infinite',
            },
            keyframes: {
                shine: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
