import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your primary brand colors
        brand: {
          DEFAULT: '#0F172A', // Your main brand color
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Your secondary brand color
        accent: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        // Social media platform colors
        social: {
          facebook: '#1877F2',
          twitter: '#1DA1F2',
          instagram: '#E4405F',
          linkedin: '#0A66C2',
          youtube: '#FF0000',
          tiktok: '#000000',
          whatsapp: '#25D366',
          telegram: '#0088cc',
          discord: '#5865F2',
          github: '#181717',
        },
        // Status colors
        status: {
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
      },
      // Add custom gradient combinations if needed
      gradientColorStops: theme => ({
        'brand-gradient': {
          from: theme('colors.brand.500'),
          via: theme('colors.brand.700'),
          to: theme('colors.brand.900'),
        },
        'accent-gradient': {
          from: theme('colors.accent.400'),
          via: theme('colors.accent.600'),
          to: theme('colors.accent.800'),
        },
      }),
    },
  },
  plugins: [],
} satisfies Config;
