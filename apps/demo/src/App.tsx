import React from 'react';
import { CatalogApp } from '@neverleans/catalog-core';

export default function App() {
  return (
    <CatalogApp
      defaultTheme="fashion"
      config={{
        companyName: "Catalog Framework Demo Store",
        currency: "USD",
        tagline: "Powered by @neverleans/catalog-core",
      }}
    />
  );
}
