---
id: pwa
title: PWA e offline
sidebar_label: PWA e offline
sidebar_position: 8
description: Registro do service worker, a faixa de offline, e como disparar o convite nativo de instalação a partir da sua própria interface.
---

# PWA e offline

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Uma loja instalável que continua funcionando quando a conexão cai.

</div>

## `usePWA`

```tsx
import { usePWA } from '@neverleans-labs/plug-store-core';

function BotaoInstalar() {
  const { isOffline, isInstalled, installPrompt, promptInstall } = usePWA();

  if (isOffline) return <span>Você está offline — navegando no catálogo em cache.</span>;
  if (isInstalled || !installPrompt) return null;

  return <button onClick={promptInstall}>Instalar esta loja</button>;
}
```

| Membro | Tipo | Observações |
|---|---|---|
| `isOffline` | `boolean` | Acompanha os eventos `online`/`offline` |
| `isInstalled` | `boolean` | Marcado quando o evento `appinstalled` dispara |
| `installPrompt` | `PWAInstallPromptEvent \| null` | `null` até o navegador oferecer |
| `promptInstall` | `() => Promise<boolean>` | Resolve `true` se o visitante aceitou |

`installPrompt` é `null` no Safari do iOS e até as heurísticas de instalação do
Chrome serem satisfeitas. Renderize o botão condicionalmente, como acima, em vez
de mostrar um controle que não faz nada.

## Service worker

Por padrão o hook registra `/sw.js` ao montar. Desligue quando seu app cuidar
disso:

```tsx
usePWA({ autoRegisterSW: false });
```

Falhas de registro são engolidas de propósito — uma loja servida de um diretório
sem `sw.js` não deve estourar no console a cada carregamento.

### Colocar o `sw.js` no seu build

O código do service worker fica no pacote core, mas precisa ser servido da raiz
estática, porque o escopo de um worker é limitado ao próprio diretório. Copie
para `public/` como parte do seu build, ou escreva o seu com
`workbox`/`vite-plugin-pwa` se quiser pré-cache dos seus próprios assets.

O cache é network-first: conteúdo fresco quando há rede, a última resposta em
cache quando não há.

## A faixa de offline

`PWAOfflineBanner` já é renderizado dentro do `Header`, então uma loja com
`<CatalogApp />` mostra o aviso automaticamente. Renderize você mesmo se
construiu o seu header:

```tsx
import { PWAOfflineBanner } from '@neverleans-labs/plug-store-core';
```

## Manifest

O PlugStore não gera o `manifest.webmanifest`. Adicione um na sua pasta
`public/` e referencie no `index.html` — o convite de instalação não aparece sem
ele.

```json title="public/manifest.webmanifest"
{
  "name": "Bloom Cosméticos",
  "short_name": "Bloom",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#d92f6a",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```html title="index.html"
<link rel="manifest" href="/manifest.webmanifest" />
```

## Próximos passos

- [Publicar a loja](../getting-started/deploy.md)
- [SEO e analytics](./seo-analytics.md)
