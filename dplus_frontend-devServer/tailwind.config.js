/** @type {import('tailwindcss').Config} */
export default {
  content:["./src/**/*.{js,jsx}"],
  darkMode: 'media',

  
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      
      fontFamily: {
        sans: ['"Slabo 27px"', 'sans-serif'],
        display: ['"Dancing Script"', 'cursive'],
      },
      colors:{
        "primaryLine":"var(--mainprimary)",
        "secLine":"var(--mainsec)",
        "topbarLine":"var(--topbar)",
        
        // "topbarLine":"#6102af",
      },
      backgroundImage: {
        'login': "url('/login_background.jpg')",
        "primaryLine":"var(--mainprimary)",
        // "topbarLine":"var(--topbar)",
        
      },
      backgroundColor:{
        'pbutton':"var(--mainsec)"
      },
      borderColor:{
        'pbutton':"var(--mainsec)",
        "primaryLine":"var(--mainprimary)",
      },
      stroke:{
        'scolor':"var(--mainsec)",
        
        "pcolor":"var(--mainprimary)",
      }
    },
  },
  plugins: [],
}

