module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'transparent': 'transparent',
          'black': 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
        },
        backgroundImage: {
          'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
          'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
          'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
          'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
        },
        sideBarImage: {
          'sidebar-img': "url('./src/images/light-wool.png')",
        },
      },
    },
    plugins: [],
  }
  