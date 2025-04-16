module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
        // sm: '640px',  // Default Tailwind
        // md: '768px',  // Default Tailwind
        // lg: '1024px', // Default Tailwind
        // xl: '1280px', // Default Tailwind
        // '2xl': '1536px', // Default Tailwind
      },
      spacing: {
        '18': '4.5rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
    },
  },
  plugins: [],
}