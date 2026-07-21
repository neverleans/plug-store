# Contributing to PlugStore

Thanks for taking the time to contribute! PlugStore is built by and for developers who
ship storefronts, and every theme, bug fix and doc improvement helps.

By participating you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## Ways to contribute

- 🐛 **Report a bug** — open a [bug report](https://github.com/neverleans/plug-store/issues/new?template=bug_report.yml).
- 💡 **Suggest a feature** — open a [feature request](https://github.com/neverleans/plug-store/issues/new?template=feature_request.yml).
- 🎨 **Contribute a theme** — see [Adding a theme](#adding-a-theme) below. This is the
  easiest first contribution and the most valuable to other users.
- 📖 **Improve the docs** — typos, unclear guides and missing examples all count.
- ⭐ **Star the repo and tell people** — genuinely helps the project reach developers.

New here? Look for issues labelled
[`good first issue`](https://github.com/neverleans/plug-store/labels/good%20first%20issue).

---

## Development setup

The repository is a pnpm + Turborepo monorepo. **pnpm is required** — other lockfiles
are gitignored on purpose.

```bash
git clone https://github.com/neverleans/plug-store.git
cd plug-store
pnpm install
pnpm build
pnpm dev
```

`pnpm dev` runs the demo app at `http://localhost:5173`.

### Repository layout

| Path | What it is |
|---|---|
| `packages/core` | `@neverleans/plug-store-core` — components, contexts, hooks, PWA layer |
| `packages/themes` | `@neverleans/plug-store-themes` — the 50 presets and `defineTheme` |
| `packages/create-plug-store` | The `create-plug-store` scaffolding CLI |
| `apps/demo` | The public demo and theme gallery |

### Useful commands

```bash
pnpm build           # build every package through Turborepo
pnpm test            # run the test suites
pnpm test:coverage   # run core tests with a coverage report
pnpm lint            # lint every package
```

---

## Adding a theme

Themes are plain objects, so a new one is a single self-contained addition to
`packages/themes/src/index.ts`.

1. Add your theme using the same shape as the existing entries.
2. Colors are **HSL channel triplets without the `hsl()` wrapper** — `"210 100% 50%"` —
   because they are injected into CSS custom properties.
3. Pick a `heroStyle` and `cardStyle` that already exist rather than adding new ones.
4. Run `pnpm build` and check your theme in the demo app before opening the PR.
5. Include a screenshot in the pull request description. It makes review much faster.

---

## Pull requests

1. Fork the repo and create a branch from `master`.
2. Keep the change focused — one concern per pull request.
3. Make sure `pnpm build`, `pnpm test` and `pnpm lint` all pass.
4. Write a clear description of **what** changed and **why**.
5. Link the issue the PR closes, if there is one.

### Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(themes): add sunset gradient theme for beach shops
fix(checkout): escape special characters in WhatsApp order message
docs(readme): clarify peer dependency requirements
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

---

## Reporting security issues

Please do **not** open a public issue for security vulnerabilities. Follow the process
in [SECURITY.md](./SECURITY.md).

---

## License

By contributing, you agree that your contributions will be licensed under the
[Apache-2.0 License](./LICENSE).
