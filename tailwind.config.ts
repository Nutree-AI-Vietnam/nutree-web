import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary
        primary: {
          forest: '#1A4739',
          teal: '#29B6A1',
          emerald: '#2D8B70',
        },
        // Aurora Effects
        aurora: {
          green: 'rgba(45, 139, 112, 0.35)',
          teal: 'rgba(41, 182, 161, 0.28)',
          mint: 'rgba(167, 243, 208, 0.2)',
        },
        // Energy Colors (Fitness Vibe)
        energy: {
          lime: '#A3E635',
          'lime-soft': 'rgba(163, 230, 53, 0.15)',
          orange: '#FB923C',
          'orange-soft': 'rgba(251, 146, 60, 0.1)',
        },
        // Semantic
        background: '#FAFCFB',
        foreground: '#0F1F1A',
        muted: '#6B7B75',
        border: '#D4E5DE',
        // Nutrition
        nutrition: {
          protein: '#E91E63',
          carbs: '#FFC107',
          fat: '#9C27B0',
          calories: '#FF5722',
        },
        // Glass effects
        glass: {
          white: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(255, 255, 255, 0.3)',
        },
      },
      fontFamily: {
        display: ['var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
        body: ['var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #1A4739 0%, #29B6A1 100%)',
        'gradient-energy': 'linear-gradient(135deg, #1A4739 0%, #29B6A1 50%, #A3E635 100%)',
        'gradient-aurora': 'radial-gradient(ellipse at top left, rgba(45, 139, 112, 0.35) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(41, 182, 161, 0.28) 0%, transparent 50%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(163, 230, 53, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(41, 182, 161, 0.18) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(45, 139, 112, 0.12) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(26, 71, 57, 0.08) 0px, transparent 50%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(26, 71, 57, 0.1)',
        'glass-lg': '0 16px 48px rgba(26, 71, 57, 0.12)',
        'glow': '0 0 40px rgba(41, 182, 161, 0.3)',
        'glow-lg': '0 0 60px rgba(41, 182, 161, 0.4)',
      },
      animation: {
        'aurora-shift': 'aurora-shift 8s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'slide-up-delay': 'slide-up 0.6s ease-out 0.2s forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'confetti': 'confetti 0.8s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        'aurora-shift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(2%, 2%) scale(1.02)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'confetti': {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
        'counter': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
