/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1e4d8b',
                    light: '#e6f0ff',
                    'dark-light': 'rgba(30,77,139,.15)',
                },
                secondary: {
                    DEFAULT: '#5cb85c',
                    light: '#e8f5e8',
                    'dark-light': 'rgba(92,184,92,.15)',
                },
                success: {
                    DEFAULT: '#5cb85c',
                    light: '#e8f5e8',
                    'dark-light': 'rgba(92,184,92,.15)',
                },
                danger: {
                    DEFAULT: '#d9534f',
                    light: '#fdf2f2',
                    'dark-light': 'rgba(217,83,79,.15)',
                },
                warning: {
                    DEFAULT: '#f0ad4e',
                    light: '#fffbf0',
                    'dark-light': 'rgba(240,173,78,.15)',
                },
                info: {
                    DEFAULT: '#1e4d8b',
                    light: '#e6f0ff',
                    'dark-light': 'rgba(30,77,139,.15)',
                },
                dark: {
                    DEFAULT: '#2c3e50',
                    light: '#ecf0f1',
                    'dark-light': 'rgba(44,62,80,.15)',
                },
                black: {
                    DEFAULT: '#1a1a1a',
                    light: '#f8f9fa',
                    'dark-light': 'rgba(26,26,26,.15)',
                },
                white: {
                    DEFAULT: '#ffffff',
                    light: '#f8f9fa',
                    dark: '#6c757d',
                },

                brand: {
                    blue: '#1e4d8b',
                    'blue-light': '#3d6ba8',
                    'blue-dark': '#152f5a',
                    green: '#5cb85c',
                    'green-light': '#7bc97b',
                    'green-dark': '#449d44',
                },
            },
            fontFamily: {
                nunito: ['Nunito', 'sans-serif'],
            },
            spacing: {
                4.5: '18px',
            },
            boxShadow: {
                '3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
                'brand': '0 4px 14px 0 rgba(30,77,139,.15)',
                'brand-green': '0 4px 14px 0 rgba(92,184,92,.15)',
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-invert-headings': theme('colors.white.dark'),
                        '--tw-prose-invert-links': theme('colors.white.dark'),
                        h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
                        h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
                        h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
                        h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
                        h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
                        h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
                        p: { marginBottom: '0.5rem' },
                        li: { margin: 0 },
                        img: { margin: 0 },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
    ],
};
