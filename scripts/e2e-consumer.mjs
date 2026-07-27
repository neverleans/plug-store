#!/usr/bin/env node
/**
 * End-to-end consumer test: prove the published tarballs actually work.
 *
 *   node scripts/e2e-consumer.mjs            # React 18
 *   node scripts/e2e-consumer.mjs --react 19
 *
 * Everything else in this repo is tested through pnpm workspace symlinks, which
 * resolve imports that a real `npm install` would not. Both packaging bugs that
 * reached users got through exactly that gap:
 *
 *   - themes declared core only as a peerDependency, so CI could not build it;
 *   - the scaffolded app never imported dist/index.css, so a freshly created
 *     store rendered with none of the design tokens.
 *
 * So this test deliberately avoids the workspace: it packs real tarballs,
 * scaffolds a project with the CLI extracted from its own tarball, installs
 * with npm, builds, and then inspects the build output.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const reactArgIndex = process.argv.indexOf('--react');
const REACT_MAJOR = reactArgIndex !== -1 ? process.argv[reactArgIndex + 1] : '18';

if (!['18', '19'].includes(REACT_MAJOR)) {
  console.error(`Unsupported --react ${REACT_MAJOR} (expected 18 or 19)`);
  process.exit(1);
}

/** React versions to force into the scaffolded project, per major. */
const REACT_DEPS = {
  18: { react: '^18.3.1', 'react-dom': '^18.3.1' },
  19: { react: '^19.0.0', 'react-dom': '^19.0.0' },
};
const REACT_TYPES = {
  18: { '@types/react': '^18.3.23', '@types/react-dom': '^18.3.7' },
  19: { '@types/react': '^19.0.0', '@types/react-dom': '^19.0.0' },
};

const step = (msg) => console.log(`\n=== ${msg} ===`);
const ok = (msg) => console.log(`  [ok] ${msg}`);

function run(cmd, args, cwd) {
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    // npm and tar are .cmd/.exe shims on Windows and are not directly executable.
    shell: process.platform === 'win32',
  });
}

function fail(msg) {
  console.error(`\nFAIL: ${msg}`);
  process.exit(1);
}

const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'plugstore-e2e-'));
const tarballDir = path.join(workRoot, 'tarballs');
fs.mkdirSync(tarballDir);

try {
  // -- 1. Pack every publishable package -------------------------------------
  step('Packing tarballs');
  const packed = {};
  for (const dir of ['packages/core', 'packages/themes', 'packages/create-plug-store']) {
    const pkgDir = path.join(ROOT, dir);
    const name = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')).name;

    // pnpm, not npm: `pnpm publish` is what actually ships these packages, and
    // only pnpm rewrites the `workspace:^` peer range into a real semver range.
    // Packing with npm leaves "workspace:^" in the tarball, which then fails to
    // install with EUNSUPPORTEDPROTOCOL — a false failure that says nothing
    // about the release.
    const out = execFileSync('pnpm', ['pack', '--pack-destination', tarballDir], {
      cwd: pkgDir,
      encoding: 'utf8',
      shell: process.platform === 'win32',
    });
    // pnpm prints the absolute tarball path as the last non-empty line.
    const tarball = out.trim().split(/\r?\n/).filter(Boolean).pop();
    if (!tarball || !fs.existsSync(tarball)) fail(`could not locate the tarball for ${name} (pnpm said: ${out.trim()})`);
    packed[name] = tarball;
    ok(`${name} -> ${path.basename(tarball)}`);
  }

  // -- 2. Scaffold using the CLI *from its tarball* ---------------------------
  // Installing the tarball rather than running packages/create-plug-store/bin
  // directly is the point: it proves the `files` field ships everything the CLI
  // needs at runtime, including its own package.json (which it reads to pin
  // versions). npm does the extraction so this works the same on every platform
  // — invoking `tar` here does not, since the GNU tar on a Windows dev box reads
  // `C:\...` as a remote host.
  step('Installing the CLI from its tarball');
  const cliDir = path.join(workRoot, 'cli');
  fs.mkdirSync(cliDir);
  fs.writeFileSync(
    path.join(cliDir, 'package.json'),
    `${JSON.stringify({ name: 'cli-host', private: true, version: '0.0.0' }, null, 2)}\n`,
  );
  run('npm', ['install', packed['create-plug-store'], '--no-audit', '--no-fund'], cliDir);

  const cliEntry = path.join(cliDir, 'node_modules', 'create-plug-store', 'bin', 'index.js');
  if (!fs.existsSync(cliEntry)) fail(`CLI tarball is missing bin/index.js (looked in ${cliEntry})`);
  ok('bin/index.js present in the tarball');

  step('Scaffolding a project');
  const appsDir = path.join(workRoot, 'apps');
  fs.mkdirSync(appsDir);
  run(
    'node',
    [cliEntry, 'consumer-app', '--yes', '--lang', 'en', '--theme', 'electronics',
      '--currency', 'BRL', '--pix-key', 'e2e@example.com', '--pix-city', 'Sao Paulo'],
    appsDir,
  );

  const appDir = path.join(appsDir, 'consumer-app');
  if (!fs.existsSync(appDir)) fail('CLI did not create the project directory');

  // -- 3. Point the project at the tarballs and the React major under test ----
  step(`Rewiring dependencies (React ${REACT_MAJOR}, local tarballs)`);
  const manifestPath = path.join(appDir, 'package.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const [name, tarball] of Object.entries(packed)) {
    if (manifest.dependencies?.[name]) {
      // file: specifiers must be POSIX-ish for npm on Windows too.
      manifest.dependencies[name] = `file:${tarball.replace(/\\/g, '/')}`;
    }
  }
  Object.assign(manifest.dependencies, REACT_DEPS[REACT_MAJOR]);
  Object.assign(manifest.devDependencies, REACT_TYPES[REACT_MAJOR]);

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  ok('core and themes resolved from file: tarballs');

  // -- 4. Install and build exactly like a user would -------------------------
  step('npm install');
  run('npm', ['install', '--no-audit', '--no-fund'], appDir);

  step('npm run build');
  run('npm', ['run', 'build'], appDir);

  // -- 5. Inspect what actually came out --------------------------------------
  step('Verifying the build output');
  const distDir = path.join(appDir, 'dist');
  if (!fs.existsSync(path.join(distDir, 'index.html'))) fail('dist/index.html was not produced');
  ok('dist/index.html exists');

  const assets = path.join(distDir, 'assets');
  const files = fs.existsSync(assets) ? fs.readdirSync(assets) : [];
  const cssFile = files.find((f) => f.endsWith('.css'));
  const jsFiles = files.filter((f) => f.endsWith('.js'));

  if (!cssFile) fail('no CSS bundle in dist/assets - the library stylesheet was never imported');
  const css = fs.readFileSync(path.join(assets, cssFile), 'utf8');

  // The design tokens live only in core's dist/index.css. Their absence is the
  // exact signature of the "storefront renders unstyled" bug.
  if (!css.includes('--primary:')) {
    fail('built CSS has no --primary token: @neverleans-labs/plug-store-core/dist/index.css did not make it into the bundle');
  }
  ok(`design tokens present in ${cssFile}`);

  // A Tailwind config whose `content` misses the compiled library purges every
  // utility the components use, leaving a stylesheet a couple of kB long.
  if (css.length < 10000) {
    fail(`built CSS is only ${css.length} bytes - Tailwind almost certainly purged the library's classes`);
  }
  ok(`stylesheet is ${(css.length / 1024).toFixed(0)} kB (library classes survived purge)`);

  const js = jsFiles.map((f) => fs.readFileSync(path.join(assets, f), 'utf8')).join('');
  // "TechVault" is the electronics theme's brand name and exists only inside the
  // theme registry, so finding it proves the theme data was really bundled.
  if (!js.includes('TechVault')) {
    fail('theme registry is missing from the JS bundle');
  }
  ok('theme registry bundled');

  console.log(`\nConsumer build passed on React ${REACT_MAJOR}\n`);
} finally {
  // Best-effort: on Windows an antivirus scan can briefly hold a file open.
  try {
    fs.rmSync(workRoot, { recursive: true, force: true });
  } catch {
    console.warn(`(could not remove ${workRoot})`);
  }
}
