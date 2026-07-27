---
id: tailwind
title: Tailwind setup
sidebar_label: Tailwind setup
sidebar_position: 3
description: The Tailwind configuration PlugStore requires, why the content array must include the compiled package, and how to fix a store that renders unstyled.
---

# Tailwind setup

<div className="ps-outcome">
<div className="ps-outcome-title">By the end of this page</div>

A correctly configured Tailwind build — and the ability to diagnose the two
ways a PlugStore install renders wrong.

</div>

The CLI writes all of this for you. This page is for adding PlugStore to an
existing project, or for debugging.

## `tailwind.config.js`

```js title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Required: the library's own class names live in its compiled output.
    './node_modules/@neverleans-labs/plug-store-core/dist/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
```

## `postcss.config.js`

```js title="postcss.config.js"
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

## `src/index.css`

```css title="src/index.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Import order in your entry point

```tsx title="src/main.tsx"
import '@neverleans-labs/plug-store-core/dist/index.css';  // tokens
import './index.css';                                      // your Tailwind build
```

## Why the `content` entry matters

Tailwind only emits a utility class it has seen in a scanned file. PlugStore's
components are compiled JavaScript in `node_modules`, so unless that path is
scanned, every class the library uses is purged and the store renders as
unstyled HTML.

## Why the CSS import matters

The core package is built in Vite library mode. That emits `dist/index.css` as a
standalone file, and `dist/index.js` does **not** import it. The package sets
`sideEffects` for that file, but `sideEffects` only tells a bundler not to
tree-shake CSS that something already imported — it never creates the import.

So the stylesheet has to be imported explicitly. Without it the components mount,
Tailwind's utilities are present, but every `hsl(var(--primary))` resolves
against a variable that was never defined.

## Diagnosing

| Symptom | Cause |
|---|---|
| Layout is right, everything is black and white or transparent | The library CSS was not imported |
| No layout at all, plain stacked HTML | `content` is missing the `node_modules` path |
| Works in dev, broken in the production build | Almost always `content` — dev serves unpurged CSS |
| Dark mode toggle does nothing | `darkMode: 'class'` missing |

A quick check in the browser console:

```js
getComputedStyle(document.documentElement).getPropertyValue('--primary');
// empty string → the library stylesheet is not loaded
```

## Tailwind v4

PlugStore targets Tailwind **3.x**. v4 replaces `tailwind.config.js` with
CSS-first configuration and is not supported yet.

## Next

- [Deploy](./deploy.md)
- [Themes and tokens](../guides/themes.md)
