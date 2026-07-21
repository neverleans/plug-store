import React from 'react';
import { CatalogApp } from '@neverleans/plug-store-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="fashion"
      config={{
        companyName: "PlugStore Demo Store",
        currency: "BRL",
        tagline: "Powered by @neverleans/plug-store-core",
        whatsappPhone: "5511999999999",
      }}
    />
  );
}
