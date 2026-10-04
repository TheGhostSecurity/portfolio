/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui','-apple-system','Segoe UI','sans-serif'],
        mono: ['JetBrains Mono','ui-monospace','SFMono-Regular','Menlo','monospace'],
      },
      colors: {
        ink: { 50:'#f7f7f8',100:'#ededf0',200:'#d8d9de',300:'#b4b7c0',400:'#8b8f9c',500:'#6b7080',600:'#545968',700:'#454955',800:'#3a3d47',900:'#1c1e26',950:'#121319' },
        brand:{ 50:'#eef6ff',100:'#d9ebff',200:'#bcdcff',300:'#8ec7ff',400:'#59a7ff',500:'#3386fc',600:'#1d67f1',700:'#1752de',800:'#1945b4',900:'#1a3e8e',950:'#152656' },
        term: { bg:'#0b0e14', panel:'#111623', line:'#1c2130', text:'#c3cad8', dim:'#5d6779', green:'#4ade80', cyan:'#22d3ee', amber:'#fbbf24', red:'#f87171', violet:'#a78bfa' },
      },
      keyframes: {
        'fade-up': { '0%':{opacity:'0',transform:'translateY(14px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
        'caret':   { '0%,49%':{opacity:'1'}, '50%,100%':{opacity:'0'} },
        'marquee': { '0%':{transform:'translateX(0)'}, '100%':{transform:'translateX(-50%)'} },
        'pulse-dot': { '0%,100%':{opacity:'1',transform:'scale(1)'}, '50%':{opacity:'.45',transform:'scale(.82)'} },
        'sheen':   { '0%':{transform:'translateX(-120%)'}, '100%':{transform:'translateX(220%)'} },
      },
      animation: {
        'fade-up':'fade-up .55s cubic-bezier(.2,.8,.2,1) both',
        caret:'caret 1.05s step-end infinite',
        marquee:'marquee 38s linear infinite',
        'pulse-dot':'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};