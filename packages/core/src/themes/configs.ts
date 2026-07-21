import { ThemeConfig } from '@/types';

export const themeConfigs: Record<string, ThemeConfig> = {
  fashion: {
    id: 'fashion',
    name: 'LUXE',
    tagline: 'Elevate Your Style',
    colors: {
      primary: '45 100% 51%',        // Gold
      primaryForeground: '0 0% 0%',
      secondary: '0 0% 7%',           // Near black
      secondaryForeground: '0 0% 95%',
      accent: '45 80% 60%',
      accentForeground: '0 0% 0%',
      background: '0 0% 100%',
      foreground: '0 0% 7%',
      card: '0 0% 98%',
      cardForeground: '0 0% 7%',
      muted: '0 0% 95%',
      mutedForeground: '0 0% 40%',
      border: '0 0% 90%',
      heroGradientFrom: '0 0% 5%',
      heroGradientTo: '45 30% 15%',
    },
    fonts: { heading: '"Playfair Display", serif', body: '"Inter", sans-serif' },
    heroStyle: 'fullwidth',
    cardStyle: 'minimal',
    navStyle: 'elegant',
  },
  electronics: {
    id: 'electronics',
    name: 'TechVault',
    tagline: 'Future-Ready Tech',
    colors: {
      primary: '217 91% 60%',         // Electric blue
      primaryForeground: '0 0% 100%',
      secondary: '220 20% 14%',
      secondaryForeground: '210 40% 98%',
      accent: '170 80% 50%',          // Cyan accent
      accentForeground: '0 0% 0%',
      background: '222 30% 8%',
      foreground: '210 40% 96%',
      card: '220 25% 12%',
      cardForeground: '210 40% 96%',
      muted: '220 20% 16%',
      mutedForeground: '215 15% 55%',
      border: '220 20% 18%',
      heroGradientFrom: '222 40% 6%',
      heroGradientTo: '217 60% 20%',
    },
    fonts: { heading: '"Space Grotesk", sans-serif', body: '"Inter", sans-serif' },
    heroStyle: 'split',
    cardStyle: 'elevated',
    navStyle: 'bold',
  },
  food: {
    id: 'food',
    name: 'FreshMarket',
    tagline: 'Farm to Table Goodness',
    colors: {
      primary: '142 64% 38%',         // Forest green
      primaryForeground: '0 0% 100%',
      secondary: '30 80% 55%',        // Warm orange
      secondaryForeground: '0 0% 100%',
      accent: '42 90% 55%',           // Yellow
      accentForeground: '0 0% 10%',
      background: '40 30% 97%',
      foreground: '20 20% 15%',
      card: '40 25% 95%',
      cardForeground: '20 20% 15%',
      muted: '40 20% 92%',
      mutedForeground: '20 10% 45%',
      border: '40 15% 88%',
      heroGradientFrom: '142 40% 25%',
      heroGradientTo: '80 40% 35%',
    },
    fonts: { heading: '"Merriweather", serif', body: '"Source Sans 3", sans-serif' },
    heroStyle: 'centered',
    cardStyle: 'rounded',
    navStyle: 'standard',
  },
  furniture: {
    id: 'furniture',
    name: 'Artisan Home',
    tagline: 'Crafted for Living',
    colors: {
      primary: '28 60% 40%',          // Warm brown
      primaryForeground: '0 0% 100%',
      secondary: '35 30% 75%',        // Beige
      secondaryForeground: '28 40% 20%',
      accent: '160 30% 45%',          // Sage
      accentForeground: '0 0% 100%',
      background: '35 20% 96%',
      foreground: '28 30% 15%',
      card: '35 15% 93%',
      cardForeground: '28 30% 15%',
      muted: '35 10% 90%',
      mutedForeground: '28 10% 45%',
      border: '35 10% 85%',
      heroGradientFrom: '28 40% 18%',
      heroGradientTo: '35 25% 30%',
    },
    fonts: { heading: '"DM Serif Display", serif', body: '"DM Sans", sans-serif' },
    heroStyle: 'overlay',
    cardStyle: 'bordered',
    navStyle: 'minimal',
  },
  beauty: {
    id: 'beauty',
    name: 'Bloom',
    tagline: 'Radiate Confidence',
    colors: {
      primary: '330 60% 55%',         // Rose pink
      primaryForeground: '0 0% 100%',
      secondary: '270 40% 70%',       // Lavender
      secondaryForeground: '0 0% 100%',
      accent: '350 80% 65%',          // Hot pink
      accentForeground: '0 0% 100%',
      background: '320 20% 98%',
      foreground: '300 15% 15%',
      card: '320 15% 96%',
      cardForeground: '300 15% 15%',
      muted: '320 10% 93%',
      mutedForeground: '300 8% 45%',
      border: '320 10% 90%',
      heroGradientFrom: '330 40% 30%',
      heroGradientTo: '270 30% 40%',
    },
    fonts: { heading: '"Cormorant Garamond", serif', body: '"Nunito Sans", sans-serif' },
    heroStyle: 'minimal',
    cardStyle: 'rounded',
    navStyle: 'centered',
  },
  sports: {
    id: 'sports',
    name: 'VELOCITY',
    tagline: 'Push Your Limits',
    colors: {
      primary: '14 100% 55%',          // Energetic orange-red
      primaryForeground: '0 0% 100%',
      secondary: '60 100% 50%',        // Highlighter yellow
      secondaryForeground: '0 0% 0%',
      accent: '210 100% 55%',          // Electric blue
      accentForeground: '0 0% 100%',
      background: '0 0% 98%',
      foreground: '0 0% 8%',
      card: '0 0% 100%',
      cardForeground: '0 0% 8%',
      muted: '0 0% 94%',
      mutedForeground: '0 0% 35%',
      border: '0 0% 88%',
      heroGradientFrom: '14 90% 45%',
      heroGradientTo: '24 100% 55%',
    },
    fonts: { heading: '"Bebas Neue", "Oswald", sans-serif', body: '"Inter", sans-serif' },
    heroStyle: 'energetic',
    cardStyle: 'tilted',
    navStyle: 'bold',
  },
  books: {
    id: 'books',
    name: 'Folio & Quill',
    tagline: 'Stories That Stay With You',
    colors: {
      primary: '15 35% 25%',           // Dark espresso
      primaryForeground: '40 30% 95%',
      secondary: '40 50% 88%',         // Warm cream
      secondaryForeground: '15 40% 18%',
      accent: '0 60% 40%',             // Library red
      accentForeground: '40 30% 95%',
      background: '40 35% 94%',        // Aged paper
      foreground: '20 25% 15%',
      card: '40 40% 92%',
      cardForeground: '20 25% 15%',
      muted: '40 25% 88%',
      mutedForeground: '20 15% 40%',
      border: '40 20% 80%',
      heroGradientFrom: '15 35% 18%',
      heroGradientTo: '40 30% 35%',
    },
    fonts: { heading: '"Libre Caslon Text", "EB Garamond", serif', body: '"Lora", Georgia, serif' },
    heroStyle: 'editorial',
    cardStyle: 'paper',
    navStyle: 'elegant',
  },
  pets: {
    id: 'pets',
    name: 'Pawsome',
    tagline: 'Love, Wagged & Purred',
    colors: {
      primary: '195 75% 55%',          // Sky blue
      primaryForeground: '0 0% 100%',
      secondary: '40 100% 65%',        // Sunshine yellow
      secondaryForeground: '20 30% 15%',
      accent: '340 80% 70%',           // Bubblegum pink
      accentForeground: '0 0% 100%',
      background: '195 60% 97%',
      foreground: '215 35% 18%',
      card: '0 0% 100%',
      cardForeground: '215 35% 18%',
      muted: '195 40% 92%',
      mutedForeground: '215 15% 45%',
      border: '195 30% 87%',
      heroGradientFrom: '195 75% 55%',
      heroGradientTo: '340 80% 70%',
    },
    fonts: { heading: '"Fredoka", "Quicksand", sans-serif', body: '"Quicksand", sans-serif' },
    heroStyle: 'playful',
    cardStyle: 'soft',
    navStyle: 'standard',
  },
  automotive: {
    id: 'automotive',
    name: 'APEX MOTORS',
    tagline: 'Engineered for Speed',
    colors: {
      primary: '0 85% 50%',            // Racing red
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 95%',           // Chrome white
      secondaryForeground: '0 0% 8%',
      accent: '50 100% 50%',           // Caution yellow
      accentForeground: '0 0% 8%',
      background: '0 0% 6%',           // Carbon black
      foreground: '0 0% 95%',
      card: '0 0% 10%',
      cardForeground: '0 0% 95%',
      muted: '0 0% 14%',
      mutedForeground: '0 0% 60%',
      border: '0 0% 18%',
      heroGradientFrom: '0 0% 4%',
      heroGradientTo: '0 70% 25%',
    },
    fonts: { heading: '"Rajdhani", "Orbitron", sans-serif', body: '"Roboto Condensed", sans-serif' },
    heroStyle: 'industrial',
    cardStyle: 'metal',
    navStyle: 'bold',
  },
  art: {
    id: 'art',
    name: 'Atelier',
    tagline: 'Where Vision Becomes Form',
    colors: {
      primary: '0 0% 8%',              // Pure ink
      primaryForeground: '40 20% 96%',
      secondary: '40 25% 92%',         // Gallery cream
      secondaryForeground: '0 0% 8%',
      accent: '20 70% 50%',            // Burnt sienna
      accentForeground: '40 20% 96%',
      background: '40 20% 96%',        // Warm white
      foreground: '0 0% 8%',
      card: '0 0% 100%',
      cardForeground: '0 0% 8%',
      muted: '40 15% 90%',
      mutedForeground: '0 0% 40%',
      border: '0 0% 85%',
      heroGradientFrom: '40 25% 92%',
      heroGradientTo: '20 30% 80%',
    },
    fonts: { heading: '"Italiana", "Cormorant", serif', body: '"Inter", sans-serif' },
    heroStyle: 'gallery',
    cardStyle: 'frame',
    navStyle: 'minimal',
  },
  jewelry: {
    id: 'jewelry',
    name: 'Maison Solenne',
    tagline: 'Quietly Brilliant',
    colors: {
      primary: '345 55% 62%',           // Soft rose pink (Marie Forleo CTA)
      primaryForeground: '0 0% 100%',
      secondary: '30 25% 92%',          // Champagne cream
      secondaryForeground: '20 25% 18%',
      accent: '40 45% 70%',             // Warm gold
      accentForeground: '20 25% 15%',
      background: '30 30% 97%',         // Warm ivory
      foreground: '20 25% 15%',
      card: '0 0% 100%',
      cardForeground: '20 25% 15%',
      muted: '30 20% 94%',
      mutedForeground: '20 12% 42%',
      border: '30 20% 88%',
      heroGradientFrom: '30 30% 97%',
      heroGradientTo: '345 35% 92%',
    },
    fonts: { heading: '"Cormorant Garamond", "Playfair Display", serif', body: '"Inter", sans-serif' },
    heroStyle: 'split',
    cardStyle: 'minimal',
    navStyle: 'elegant',
    heroImage: '/hero-jewelry-bg.jpg',
  },
  homeware: {
    id: 'homeware',
    name: 'Maison & Table',
    tagline: 'Everyday, Elevated',
    colors: {
      primary: '15 35% 55%',            // Warm terracotta
      primaryForeground: '0 0% 100%',
      secondary: '35 30% 90%',          // Sand
      secondaryForeground: '20 30% 18%',
      accent: '120 15% 55%',            // Soft sage
      accentForeground: '0 0% 100%',
      background: '35 25% 96%',         // Off-white linen
      foreground: '20 25% 16%',
      card: '0 0% 100%',
      cardForeground: '20 25% 16%',
      muted: '35 18% 92%',
      mutedForeground: '20 12% 42%',
      border: '35 18% 86%',
      heroGradientFrom: '35 25% 96%',
      heroGradientTo: '15 30% 88%',
    },
    fonts: { heading: '"DM Serif Display", serif', body: '"DM Sans", sans-serif' },
    heroStyle: 'split',
    cardStyle: 'rounded',
    navStyle: 'minimal',
    heroImage: '/hero-homeware-bg.jpg',
  },
  market: {
    id: 'market',
    name: 'Maison Marché',
    tagline: 'Honest Food, Beautifully Sourced',
    colors: {
      primary: '20 60% 45%',            // Warm clay
      primaryForeground: '40 30% 96%',
      secondary: '40 40% 88%',          // Cream
      secondaryForeground: '20 30% 16%',
      accent: '90 30% 45%',             // Olive
      accentForeground: '40 30% 96%',
      background: '40 35% 95%',         // Paper white
      foreground: '20 25% 14%',
      card: '0 0% 100%',
      cardForeground: '20 25% 14%',
      muted: '40 20% 91%',
      mutedForeground: '20 12% 40%',
      border: '40 18% 85%',
      heroGradientFrom: '40 35% 95%',
      heroGradientTo: '20 35% 85%',
    },
    fonts: { heading: '"Fraunces", "Playfair Display", serif', body: '"Inter", sans-serif' },
    heroStyle: 'split',
    cardStyle: 'bordered',
    navStyle: 'elegant',
    heroImage: '/hero-market-bg.jpg',
  },
  wellness: {
    id: 'wellness',
    name: 'Maison Calme',
    tagline: 'Slow Beauty, Daily Ritual',
    colors: {
      primary: '155 25% 45%',           // Forest sage
      primaryForeground: '40 30% 96%',
      secondary: '40 25% 92%',          // Warm cream
      secondaryForeground: '160 25% 14%',
      accent: '25 50% 78%',             // Peach blush
      accentForeground: '20 30% 18%',
      background: '50 30% 97%',         // Soft ivory
      foreground: '160 20% 14%',
      card: '0 0% 100%',
      cardForeground: '160 20% 14%',
      muted: '50 18% 93%',
      mutedForeground: '160 10% 40%',
      border: '50 18% 87%',
      heroGradientFrom: '50 30% 97%',
      heroGradientTo: '155 25% 88%',
    },
    fonts: { heading: '"Cormorant Garamond", serif', body: '"Nunito Sans", sans-serif' },
    heroStyle: 'centered',
    cardStyle: 'soft',
    navStyle: 'centered',
    heroImage: '/hero-wellness-bg.jpg',
  },
  stationery: {
    id: 'stationery',
    name: 'Papier & Encre',
    tagline: 'For the Slow Correspondent',
    colors: {
      primary: '20 30% 30%',            // Espresso ink
      primaryForeground: '40 30% 96%',
      secondary: '40 35% 90%',          // Cotton paper
      secondaryForeground: '20 30% 16%',
      accent: '15 50% 55%',             // Sealing-wax red
      accentForeground: '40 30% 96%',
      background: '40 30% 96%',         // Warm paper
      foreground: '20 25% 14%',
      card: '0 0% 100%',
      cardForeground: '20 25% 14%',
      muted: '40 20% 92%',
      mutedForeground: '20 12% 40%',
      border: '40 18% 86%',
      heroGradientFrom: '40 30% 96%',
      heroGradientTo: '40 35% 86%',
    },
    fonts: { heading: '"Libre Caslon Text", "EB Garamond", serif', body: '"Lora", Georgia, serif' },
    heroStyle: 'editorial',
    cardStyle: 'paper',
    navStyle: 'elegant',
    heroImage: '/hero-stationery-bg.jpg',
  },
};
