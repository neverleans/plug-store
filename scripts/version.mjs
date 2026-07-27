#!/usr/bin/env node
/**
 * Bump every publishable package to the same version in one shot.
 *
 *   node scripts/version.mjs 0.1.2
 *
 * The three packages are versioned in lockstep on purpose. They were not, once:
 * core shipped 0.1.1 while themes stayed behind on 0.1.0, so `npm i` could
 * resolve a themes/core pair that was never built or tested together. pnpm
 * rewrites the `workspace:^` peer at publish time, so keeping the versions
 * identical is what makes that rewritten range point somewhere real — and it
 * lets a single tag describe the whole release.
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

  // Bump internal ranges wherever they appear, but never touch `workspace:*`
  // devDependencies — those are how pnpm links the local build during dev.
  for (const field of ['dependencies', 'peerDependencies']) {
    const deps = manifest[field];
    if (!deps) continue;
    for (const name of INTERNAL_DEPS) {
      if (deps[name] && !deps[name].startsWith('workspace:')) {
        deps[name] = `^${version}`;
      }
    }
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`  ✓ ${manifest.name} → ${version}`);
}

console.log(`\nAll packages set to ${version}.`);
console.log('Next: pnpm install --lockfile-only && git commit && git tag v' + version);
