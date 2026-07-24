# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Interactive theme gallery in the demo app: every one of the 50 themes opens as a full,
  browsable storefront (cart, search, wishlist, checkout), plus a GitHub Pages deploy
  workflow (`deploy-demo.yml`).
- A real, spec-compliant static Pix "Copia e Cola" BR Code generator (`buildPixPayload`,
  EMV/Banco Central format with the mandated CRC-16 checksum) — scans in any Brazilian
  banking app.
- `pixKey` and `pixMerchantCity` on `SiteConfig`/`CatalogConfig`, with inputs in the admin
  panel and conditional prompts in `create-plug-store` for BRL stores.
- The turnkey `CheckoutPage` now renders a payment-method picker (Pix, WhatsApp, demo
  card) instead of only a fake credit-card form; Pix renders inline as a QR code plus a
  copy-to-clipboard code.
- Per-theme hero description and eyebrow label for all 50 themes (`localizeHeroSubtitle`
  in `i18n/dynamic.ts`), in Portuguese and English.
- `basename` prop on `<CatalogApp />` for storefronts served from a sub-directory (GitHub
  Pages project sites, or any deployment not at the domain root).
- Contributor documentation: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` and `SECURITY.md`.
- GitHub issue forms for bug reports and feature requests, plus a pull request template.
- `FUNDING.yml`, enabling the GitHub Sponsors button on the repository.
- Per-package `README.md` and `LICENSE` files so the npm package pages are populated.
- npm publishing metadata — `repository`, `homepage`, `bugs`, `keywords` and
  `publishConfig` — on all three publishable packages.
- `release.yml` workflow that publishes to npm with provenance on `v*` tags, with a
  dry-run mode for rehearsals.
- Self-contained `vitest.config.ts` in `packages/core`, enabling jsdom, the
  `@testing-library/jest-dom` matchers and a `test:coverage` script.

### Fixed

- 35 of the 50 themes silently rendered as the `fashion` theme: the theme registry was
  duplicated between `packages/core` and `packages/themes` and only 15 were kept in sync.
  `packages/core` is now the single source of truth; `packages/themes` re-exports it.
- `<CatalogApp />` accepted `customTheme`, `defaultLanguage` and `dataProvider` as props
  but never forwarded any of them to `CatalogProvider`, so a `defineTheme` brand passed to
  `<CatalogApp />` (as the README documented) silently did nothing.
- A visitor's *first-ever* theme was permanently written to `localStorage` and treated as
  sticky forever after — so changing `defaultTheme` in code had no visible effect for
  anyone who had loaded the app before. The stored value is now tied to the configured
  default and only wins while that default is unchanged.
- `PublicCatalogPage` called `useState`/`useMemo` after an early `return`, crashing with
  "Rendered fewer hooks than expected" when navigating from an invalid catalog slug to a
  valid one.
- Checkout double-counted shipping: the page recomputed its own shipping threshold on top
  of a cart total that already included shipping, so the order summary never added up.
- `formatMoney` treated every stored price as USD and multiplied it by a fixed exchange
  rate (BRL × 5.2), so a real BRL store's prices displayed inflated by that rate. Amounts
  are now formatted in the store's own currency via `Intl.NumberFormat`, with no
  conversion.
- Hero description and eyebrow copy were hardcoded per hero *layout*, not per theme, so
  any theme sharing a layout with another rendered the wrong niche's words (a coffee shop
  opened with "Tecnologia de ponta").
- `pixGateway` produced a fabricated string that no banking app could read; it now emits
  the real BR Code above and fails loudly instead of silently if no Pix key is configured.

### Changed

- CI now lints and runs the test matrix across Node 18, 20 and 22, and installs with a
  frozen lockfile.
- `components.json` moved to `packages/core`, where the shadcn/ui components actually
  live, and repointed at the shared Tailwind config.
- The root Tailwind `content` globs now target the packages instead of a directory that
  no longer exists.

### Removed

- The unused Vite application scaffold at the repository root — `index.html`,
  `vite.config.ts` (which still imported `lovable-tagger` and a Supabase MCP plugin),
  `vitest.config.ts`, the three root `tsconfig` files, the empty `src/` directory and a
  `public/` folder duplicated in `apps/demo`.
- The committed `.env` file, which held leftover Supabase scaffold variables that no
  code in the monorepo referenced.
- Competing `bun.lock`, `bun.lockb` and `package-lock.json` lockfiles. The monorepo
  standardises on pnpm and the others are now gitignored.

## [0.1.0]

### Added

- Initial release of the PlugStore monorepo: `@neverleans/plug-store-core`,
  `@neverleans/plug-store-themes` and the `create-plug-store` CLI.
- 50 built-in industry themes and the `defineTheme` customizer.
- Headless data providers, turnkey checkout (WhatsApp, Pix, Stripe, Mercado Pago),
  PWA offline support, built-in SEO and zero-config analytics.
