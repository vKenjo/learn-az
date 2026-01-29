/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                pink: {
                    hot: '#f72585',
                    deep: '#b5179e',
                },
                purple: {
                    vivid: '#7209b7',
                    dark: '#560bad',
                },
                indigo: {
                    deep: '#480ca8',
                    DEFAULT: '#3a0ca3',
                },
                blue: {
                    vivid: '#3f37c9',
                    DEFAULT: '#4361ee',
                    light: '#4895ef',
                },
                cyan: '#4cc9f0',
                bg: {
                    primary: '#0a0a0f',
                    secondary: '#12121a',
                    tertiary: '#1a1a2e',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255,255,255,0.7)',
                    muted: 'rgba(255,255,255,0.4)',
                }
            },
            fontFamily: {
                display: ['Space Grotesk', 'System'],
                body: ['Inter', 'System'],
                mono: ['JetBrains Mono', 'System'],
            }
        },
    },
    plugins: [],
}
