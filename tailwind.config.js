import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
                display: ['Outfit', ...defaultTheme.fontFamily.sans],
                mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                brand: {
                    50:  '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                surface: {
                    DEFAULT: '#ffffff',
                    dark: '#0D1117',
                },
                page: {
                    DEFAULT: '#F8F9FB',
                    dark: '#0A0E1A',
                },
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulse_glow: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.4)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(16,185,129,0)' },
                },
            },
            animation: {
                'fade-up': 'fadeUp 0.35s ease both',
                'fade-in': 'fadeIn 0.25s ease both',
                'scale-in': 'scaleIn 0.2s ease both',
                'slide-down': 'slideDown 0.2s ease both',
                'glow': 'pulse_glow 2s infinite',
            },
        },
    },

    plugins: [forms],
};
