/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container:{
      padding:{
        md:"10rem",
      }          // for defalut so that it can be apply to all things 
    },
  },
  plugins: [],
}

