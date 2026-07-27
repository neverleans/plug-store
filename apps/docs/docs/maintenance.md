---
id: maintenance
title: How this is maintained
sidebar_label: How this is maintained
sidebar_position: 4
description: What "maintained" means here, as checks you can run yourself — including the gate that installs the packages the way you will, outside the workspace.
---

# How this is maintained

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

You will know exactly what is verified before a release reaches you, what is
not, and how to run the same checks on your own machine.

</div>

Every project says it is maintained. The word is worth nothing on its own, so
this page spells out what it means here in terms you can check — and names the
places where the guarantee runs out.

## Everything ships on one version number

The three packages are always released together at the same version, and
`scripts/version.mjs` rewrites the cross-package ranges into literal semver so
nothing internal leaks into a published manifest.

This rule exists because it was broken. `plug-store-themes` sat at `0.1.0`
through three releases of `plug-store-core` while the release workflow reported
**success** every time — because no step ever asked the registry what was
actually published. The CLI, meanwhile, had started writing `themes ^0.1.2` into
every scaffolded project, so `npm install` failed with a 404 for anyone who ran
`npm create plug-store` in that window.

The fix is not vigilance, it is a job. `verify-release` runs after publishing and
fails the release unless:

- all three packages report the tagged version to `npm view`, and
- `npm view <pkg>@^<cli-version>` resolves — that is, the exact range the CLI
  writes into your `package.json` can be installed.

## The gate that matters: a real consumer build

Everything inside this repo is tested through pnpm workspace symlinks, which
resolve imports a real `npm install` never would. That gap is not theoretical —
it is where both bugs that reached users came from:

| Bug | Why the normal test suite could not see it |
|---|---|
| `themes` declared `core` only as a peer dependency | The symlink resolved it anyway |
| The scaffolded app never imported `dist/index.css` | Nothing rendered the scaffolded app |

So one job leaves the workspace entirely and behaves like you:

1. `pnpm pack` all three packages into real tarballs.
2. Install the **CLI from its own tarball** — which proves the `files` field
   ships everything it needs at runtime, not just what happens to be on disk.
3. Run that CLI to scaffold a project in a temp directory, non-interactively.
4. `npm install`, then `npm run build`.
5. Inspect what came out.

Step 5 is the part that catches regressions, and it asserts things a green build
does not imply:

| Assertion | The bug it catches |
|---|---|
| `dist/index.html` exists | The build silently produced nothing |
| The CSS bundle contains `--primary:` | `core/dist/index.css` never made it in — the storefront renders unstyled |
| The CSS bundle is over 10 kB | The Tailwind `content` glob misses the compiled library, so every utility class was purged |
| The JS bundle contains `TechVault` | The theme registry was tree-shaken or never bundled |

It runs on four combinations, because packaging bugs are rarely portable:
**Ubuntu and Windows, each against React 18 and React 19.** Path separators and
peer-dependency resolution are exactly the kind of thing that works on one and
not the other.

**You can run it yourself.** It is not CI-only magic — clone the repo, `pnpm install`,
`pnpm build`, then:

```bash
pnpm e2e
```

Or pick the React major to test against:

```bash
node scripts/e2e-consumer.mjs --react 19
```

## What runs on every commit

| Check | Detail |
|---|---|
| Lint | Whole workspace |
| Build | Node 18, 20 and 22 — the packages must keep building on 18 because the CLI's README promises it |
| Tests | 34 tests across 7 files |
| Docs build | A broken link **fails the build**, so no page here can point at nothing |
| Consumer build | The four combinations above |

Be honest about the test count: 34 is small, and it is not spread evenly. Eleven
of them cover the Pix payload and seven cover data-provider wiring, because
those are the two places where a silent failure costs real money. Component
rendering is thinly covered.

## What is *not* covered

- **Registry resolution.** The consumer gate rewrites dependencies to local
  `file:` tarballs, so it never asks npm to resolve a published range. That is
  precisely why the `themes` 404 got through. `verify-release` closes the
  concrete case; the gate itself is still blind to it.
- **Visual regression.** Nothing compares rendered output between releases. A
  theme can change appearance without any check noticing.
- **Browsers.** Builds are verified, browsers are not. There is no Playwright or
  cross-browser matrix.
- **The REST provider against a live endpoint.** The data-provider tests use a
  stub provider and the bundled demo data — they prove the *wiring* (that your
  provider is really called, and that a missing `getReviews` degrades instead of
  crashing), not that any particular backend answers correctly.

## Why this page exists

Maintenance is the actual product of a framework. Components are the part that
gets easy to generate; keeping something working across React majors, operating
systems, package-manager quirks and a registry that will happily serve a broken
combination is the part that does not.

A paid layer for maintained Brazilian integrations is being explored — see
[Built for Brazil](./brazil.md) for the list of things not built yet. If that
ever exists, it will be judged on exactly this: whether the maintenance is real.
So the free version of it is documented here first, with the failures included,
so you can form an opinion before anyone asks you for money.

## Next

- [Built for Brazil](./brazil.md) — what the framework knows, and where it stops.
- [Contributing](https://github.com/neverleans/plug-store/blob/master/CONTRIBUTING.md) — how to run all of the above locally.
- [Changelog](https://github.com/neverleans/plug-store/blob/master/CHANGELOG.md) — every release, including the broken ones.
