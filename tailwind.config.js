/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta AHK Colombia
        brand: {
          50:  '#eef3fb',
          100: '#d5e0f0',
          300: '#7a9bd0',
          400: '#4d7bc0',
          500: '#2E5DA8',  // azul medio AHK (navbar)
          600: '#1F3A6E',  // azul institucional principal
          700: '#152849',  // azul oscuro
          900: '#0c1830',
        },
        accent: {
          400: '#F5C547',
          500: '#F5B400',  // dorado AHK (botones tipo "Ver más")
          600: '#D49A00',
        },
        ink: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          500: '#64748b',
          300: '#cbd5e1',
          100: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
