# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **"Built for Brazil"** documentation page, in both locales. The docs demonstrated the
  Brazilian side of the framework page by page without ever stating it as the thing that
  makes it different — including the CRC-16 variant and the ASCII folding rule, the two
  places a Pix payload silently stops scanning. The page also lists what is *not* built
  (payment confirmation, NFe, real shipping quotes, marketplace sync, WhatsApp Business
  API, CPF/CNPJ validation) so nobody discovers those by hitting them in production.
- **"How this is maintained"** documentation page, in both locales. The `e2e-consumer`
  gate is the strongest evidence the project produces and it only existed inside a YAML
  file. The page spells out what each check catches, names the two packaging bugs and the
  version-drift release that reached users, lists what is *not* covered, and gives the
  command to run the same gate locally.
- Both pages surfaced from the homepage, the sidebar, the footer and the README, and
  picked up automatically by `llms.txt` (26 pages indexed per locale, was 24).

## [0.1.2] - 2026-07-27

### Added

- **Documentation site** at <https://neverleans.github.io/plug-store/>, built with
  Docusaurus: getting started, ten guides, four recipes, a full API and type reference,
  a live theme gallery reading the published registry, and an interactive Pix payload
  inspector that runs the real generator. The demo moved to `/demo/`. Available in
  English and Portuguese, including the two interactive components.
- **`useProducts`, `useCategories`, `useProduct`, `useProductReviews`** — read hooks over
  the active data provider, with caching, loading and error state.
- `queryClient` prop on `CatalogProvider`, for apps that already use react-query and want
  one shared cache.
- `--lang` flag on `create-plug-store` (`pt` or `en`, defaulting to the machine locale).
- `e2e-consumer` CI job: packs real tarballs, scaffolds a project with the CLI, installs
  with npm and builds it, on Linux and Windows against React 18 and 19.

### Fixed

- **`dataProvider` had no effect on what the storefront displayed.** Every page imported
  the bundled demo dataset directly, so a store wired to a real backend still rendered
  demo products; the provider was only consulted when saving an order. All pages, the
  header search and the footer categories now read through the provider.
- **Projects created by the CLI rendered without any design tokens.** The generated app
  never imported `@neverleans-labs/plug-store-core/dist/index.css`, which Vite library
  mode emits as a standalone file that `dist/index.js` does not reference.
- **Projects created by the CLI failed `npm run build`.** The generated `App.tsx`
  imported React while the template enables `jsx: react-jsx` and `noUnusedLocals`,
  producing TS6133 on a freshly scaffolded project.
- `CatalogProvider` shared a module-level react-query client, so two independently
  mounted stores leaked cached catalog data to each other.
- **`@neverleans-labs/plug-store-themes` was never published by the release workflow.**
  It had no job in `release.yml`, so it stayed on `0.1.0` through three core releases
  while the run still reported success — nothing asked the registry what it had. Since
  the CLI pins both library packages at its own version, that gap made `npm create
  plug-store` fail with `E404` on install. There is now a `publish-themes` job, publishes
  are idempotent so a tag can be re-run to fill in what is missing, and a
  `verify-release` job asserts all three report the tagged version and that the range the
  CLI writes actually resolves.
- `plug-store-themes` declared its peer on core as `workspace:^`. pnpm rewrites that at
  publish time; npm — which is what the workflow uses — neither rewrites it nor will pack
  a manifest containing it. Consumer-facing ranges are literal now, maintained by
  `scripts/version.mjs`.
- The CI matrix failed on Node 18 from the moment the documentation site landed, because
  the root build pulled in Docusaurus, which requires Node 20. The packages still build
  and test on Node 18 — the CLI promises that — and only the site is skipped there.
- The CLI greeted in English and then asked every question in Portuguese.
- `dummyDataProvider.createOrder` built its order around a `ShippingInfo` shape that no
  longer exists. TypeScript never flagged it because the value sat in the right operand
  of a `||` whose left operand can never be falsy, so the branch was both unreachable and
  unchecked.
- `@neverleans-labs/plug-store-core` documented a React 18 peer requirement that had
  already been widened to `^18 || ^19`.

### Changed

- README trimmed to a quick start that points at the documentation site; the package
  version table is now npm badges rather than hardcoded numbers. Each package README now
  links to the documentation pages that cover it.
- The React 19 install warning is gone — every release is verified against React 18 and
  19 by the `e2e-consumer` job, and neither needs `--legacy-peer-deps`.

## Earlier unreleased work

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
