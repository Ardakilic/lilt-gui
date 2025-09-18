/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        lilt: {
          primary: '#3b82f6',
          secondary: '#6366f1',
          accent: '#10b981',
          muted: '#6b7280',
        },
      },
    },
  },
  plugins: [],
};
