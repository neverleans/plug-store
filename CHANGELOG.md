# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Fixed

- Theme count stated consistently as 50 across the README and package descriptions
  (the packages table and npm description still said 15).

## [0.1.0]

### Added

- Initial release of the PlugStore monorepo: `@neverleans/plug-store-core`,
  `@neverleans/plug-store-themes` and the `create-plug-store` CLI.
- 50 built-in industry themes and the `defineTheme` customizer.
- Headless data providers, turnkey checkout (WhatsApp, Pix, Stripe, Mercado Pago),
  PWA offline support, built-in SEO and zero-config analytics.
