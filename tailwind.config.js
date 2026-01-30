/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                pink: {
                    hot: '#ff006e',
                    deep: '#c9184a',
                },
                purple: {
                    vivid: '#8338ec',
                    dark: '#3c096c',
                },
                blue: {
                    vivid: '#3a86ff',
                    DEFAULT: '#4361ee',
                    light: '#4cc9f0',
                },
                cyan: '#00f5d4',
                bg: {
                    primary: '#050508',
                    secondary: '#0f0f1a',
                    tertiary: '#161625',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255,255,255,0.85)',
                    muted: 'rgba(255,255,255,0.5)',
                }
            },
            borderRadius: {
                '4xl': '32px',
                '5xl': '40px',
            },
            spacing: {
                '18': '72px',
            },
            fontFamily: {
                display: ['System'],
                body: ['System'],
                mono: ['System'],
            }
        },
    },
    plugins: [],
}
