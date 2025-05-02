/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a9f7',
          500: '#0c8ee7',
          600: '#005293', // Huvudfärg
          700: '#0050a5',
          800: '#003c7e',
          900: '#003366',
        },
        secondary: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#4a4a4a', // Sekundär färg
          700: '#3d3d3d',
          800: '#292929',
          900: '#1a1a1a',
        },
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        DEFAULT: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
      },
    },
  },
  plugins: [],
}
