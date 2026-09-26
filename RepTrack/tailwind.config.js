/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'primary': '#9d2f2f',
                'background-light': '#f8f6f6',
                'background-dark': '#140c0c',
                'card-dark': '#1f1414',
                'input-dark': '#2a1b1b'
            },
            fontFamily: {
                display: ['Lexend', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '1rem',
                lg: '2rem',
                xl: '3rem',
            },
        },
    },
    plugins: [],
}
