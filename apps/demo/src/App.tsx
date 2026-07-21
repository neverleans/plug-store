import React from 'react';
import { CatalogApp } from '@neverleans/plug-store-core';
import { defineTheme } from '@neverleans/plug-store-themes';

// Exemplo de tema customizado de marca própria criado pelo desenvolvedor
const clienteTheme = defineTheme({
  id: 'minha-marca',
  name: 'MINHA MARCA STORE',
  tagline: 'Sua Identidade Visual Única',
  colors: {
    primary: '210 100% 50%',
    primaryForeground: '0 0% 100%',
    background: '210 20% 98%',
    card: '0 0% 100%',
    heroGradientFrom: '210 100% 45%',
    heroGradientTo: '230 80% 30%',
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  heroStyle: 'split',
  cardStyle: 'bordered',
  navStyle: 'elegant',
});

export default function App() {
  return (
    <CatalogApp
      customTheme={clienteTheme}
      config={{
        companyName: "Minha Marca Store",
        currency: "BRL",
        tagline: "Powered by @neverleans/plug-store-core",
        whatsappPhone: "5511999999999",
      }}
    />
  );
}
