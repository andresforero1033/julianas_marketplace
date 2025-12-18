/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E91E63',
        secondary: '#F8BBD0',
        accent: '#C9A24D',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        text: '#333333',
        muted: '#757575',
        light: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};

