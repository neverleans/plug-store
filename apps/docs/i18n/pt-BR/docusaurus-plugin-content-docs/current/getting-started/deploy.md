---
id: deploy
title: Publicar
sidebar_label: Publicar
sidebar_position: 4
description: Publicando um build do PlugStore na Vercel, Netlify, GitHub Pages ou qualquer host estático — incluindo o rewrite de SPA e hospedagem em subdiretório.
---

# Publicar

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Sua loja no ar em uma URL, com links profundos que sobrevivem a um refresh.

</div>

Um projeto PlugStore é um build estático do Vite. `npm run build` gera `dist/`,
e qualquer host estático consegue servir.

## A única coisa que todo host precisa

O PlugStore usa roteamento no cliente. Quem abre `/products/abc123` direto pede
ao host um arquivo que não existe. Todo destino de deploy precisa de um rewrite
que sirva `index.html` para caminhos desconhecidos — senão links profundos,
refresh e URLs compartilhadas dão 404.

## Vercel

O build não precisa de configuração; adicione o rewrite:

```json title="vercel.json"
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Netlify

```toml title="netlify.toml"
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## GitHub Pages

O Pages não tem regra de rewrite nenhuma. A saída é servir a mesma casca como
`404.html`, o que devolve o controle ao roteador:

```yaml title=".github/workflows/deploy.yml"
- name: Build
  run: npm run build
  env:
    VITE_BASE: /${{ github.event.repository.name }}/

- name: SPA fallback
  run: cp dist/index.html dist/404.html

- name: Desligar o Jekyll
  run: touch dist/.nojekyll
```

## Servir de um subdiretório

Um site de projeto no Pages fica em `https://usuario.github.io/repo/`, não na
raiz do domínio. Duas coisas precisam concordar:

**1. O `base` do Vite** — para as URLs dos assets ficarem corretas:

```ts title="vite.config.ts"
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  // …
});
```

**2. O `basename` do roteador** — para as rotas resolverem:

```tsx
<CatalogApp basename="/repo" />
```

Sem o `basename`, toda rota é comparada contra `/` e o app renderiza a página de
404 mesmo com os arquivos carregando normalmente.

## Qualquer host estático

```bash
npm run build
# suba dist/ — mais um rewrite para index.html
```

Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Apache:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Antes de ir ao ar

- Rode `npm run build` local — o build de produção faz purge do CSS de forma
  diferente do dev, e um caminho faltando em `content` no Tailwind só aparece
  aqui. Veja [Configurar o Tailwind](./tailwind.md).
- Use `<CatalogApp disableAdmin />` a menos que você queira uma tela de
  configuração sem autenticação na sua loja pública. Veja
  [Painel admin](../guides/admin.md).
- Confirme que o código Pix escaneia em um app de banco de verdade, se você
  aceita Pix. Veja [Pix](../guides/pix.md).
- Adicione um `manifest.webmanifest` se quiser o convite de instalação. Veja
  [PWA](../guides/pwa.md).

## Próximos passos

- [SEO e analytics](../guides/seo-analytics.md)
- [Conectar um backend de verdade](../guides/data.md)
