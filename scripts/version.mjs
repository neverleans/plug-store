#!/usr/bin/env node
/**
 * Bump every publishable package to the same version in one shot.
 *
 *   node scripts/version.mjs 0.1.2
 *
 * The three packages are versioned in lockstep on purpose. They were not, once:
 * core shipped 0.1.0, 0.1.1 and 0.1.2 while themes never left 0.1.0, because
 * release.yml had no job for it. The CLI pins both library packages at its own
 * version, so that gap made `npm create plug-store` fail with E404 on install.
 * One tag, one version, three packages — and a verify job that asks the registry.
 *
 * Ranges that consumers resolve are written as literals, never `workspace:`.
 * An earlier version of this script left the peer as `workspace:^` on the theory
 * that pnpm rewrites it at publish time. It does — but release.yml publishes with
 * npm, which does not, and npm refuses to even pack a manifest containing it.
 * `workspace:*` survives only in devDependencies, which no consumer resolves.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Packages that get published, in dependency order. */
const PACKAGES = [
  'packages/core',
  'packages/themes',
  'packages/create-plug-store',
];

/** Peer/dependency ranges that must track the new version. */
const INTERNAL_DEPS = [
  '@neverleans-labs/plug-store-core',
  '@neverleans-labs/plug-store-themes',
];

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error('Usage: node scripts/version.mjs <version>   e.g. 0.1.2');
  process.exit(1);
}

for (const pkgDir of PACKAGES) {
  const manifestPath = path.join(ROOT, pkgDir, 'package.json');
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);

  manifest.version = version;

  // dependencies and peerDependencies are what a consumer's installer resolves,
  // so they always become a literal range — including when they were written as
  // `workspace:`. devDependencies are left alone: `workspace:*` is how pnpm links
  // the sibling build during development and no consumer ever looks at them.
  for (const field of ['dependencies', 'peerDependencies']) {
    const deps = manifest[field];
    if (!deps) continue;
    for (const name of INTERNAL_DEPS) {
      if (deps[name]) {
        deps[name] = `^${version}`;
      }
    }
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`  ✓ ${manifest.name} → ${version}`);
}

console.log(`\nAll packages set to ${version}.`);
console.log('Next: pnpm install --lockfile-only && git commit && git tag v' + version);
