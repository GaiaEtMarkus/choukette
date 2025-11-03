/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette inspirée du logo Choukette 🥖
        primary: {
          50: '#fef9f1',
          100: '#fef2e3',
          200: '#fce3c1',
          300: '#f9d195',
          400: '#f5b866',
          500: '#f2a444', // Orange doré principal du logo
          600: '#e6912d',
          700: '#c07725',
          800: '#985f24',
          900: '#7b4e23',
        },
        secondary: {
          50: '#f9f6f3',
          100: '#f3ebe4',
          200: '#e6d5c4',
          300: '#d4b899',
          400: '#bc956b',
          500: '#a67c55', // Brun chaleureux
          600: '#8b6647',
          700: '#6f523b',
          800: '#5a4332',
          900: '#4a382b',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#fecaaa',
          300: '#fda574',
          400: '#fb7a3c',
          500: '#f97316', // Orange vif pour les accents
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Couleur crème du fond du logo
        cream: {
          50: '#fefcf8',
          100: '#fdf8f0',
          200: '#faeee0', // Couleur de fond du logo
          300: '#f6e2ca',
          400: '#f0d2a8',
          500: '#e8c088',
          600: '#dba968',
          700: '#c8944d',
          800: '#a07840',
          900: '#826237',
        },
        // Brun chocolat des contours
        chocolate: {
          50: '#f7f3f0',
          100: '#ede4dd',
          200: '#dcc7b8',
          300: '#c4a48d',
          400: '#a67c63',
          500: '#8b5a3c', // Couleur des contours du logo
          600: '#724732',
          700: '#5d392a',
          800: '#4e3025',
          900: '#422a21',
        },
        neutral: {
          50: '#faf9f7',
          100: '#f3f1ee',
          200: '#e8e4df',
          300: '#d6d0c8',
          400: '#b8b0a5',
          500: '#9a8f81',
          600: '#7c7165',
          700: '#645a52',
          800: '#524943',
          900: '#433d37',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 