module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4f46e5', dark: '#4338ca', light: '#818cf8' },
        secondary: { DEFAULT: '#10b981', dark: '#059669', light: '#34d399' },
        accent: { DEFAULT: '#f59e0b', dark: '#d97706', light: '#fbbf24' },
        surface: {
          50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8',
          400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46',
          800: '#27272a', 900: '#18181b', 950: '#09090b'
        },
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.08)',
        'soft': '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
        'neu-dark': '0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)'
      },
    },
  },
  plugins: [],
}