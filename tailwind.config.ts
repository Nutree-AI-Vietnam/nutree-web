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
        muted: '#3F4A45',
        border: '#D4E5DE',
      },
      fontFamily: {
        display: ['var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
        body: ['var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #1A4739 0%, #29B6A1 100%)',
        'gradient-energy': 'linear-gradient(135deg, #1A4739 0%, #29B6A1 50%, #A3E635 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(163, 230, 53, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(41, 182, 161, 0.18) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(45, 139, 112, 0.12) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(26, 71, 57, 0.08) 0px, transparent 50%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(26, 71, 57, 0.1)',
        'glass-lg': '0 16px 48px rgba(26, 71, 57, 0.12)',
        'glow': '0 0 40px rgba(41, 182, 161, 0.3)',
        'glow-lg': '0 0 60px rgba(41, 182, 161, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
