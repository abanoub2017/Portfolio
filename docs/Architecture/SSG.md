# Static Site Generation (SSG) Guide

> **Package:** [`vite-ssg`](https://github.com/antfu-collective/vite-ssg) v28+  
> **Head management:** [`@unhead/vue`](https://unhead.unjs.io/) v2 (bundled by vite-ssg)  
> **Deployed to:** GitHub Pages (static files only — no Node.js server)

---

## Why SSG?

The portfolio is a public-facing site. Search engines and social-media bots
(Twitter/X, LinkedIn, WhatsApp, Telegram) **do not execute JavaScript**. Without
SSG, they see an empty `<div id="app">` and generate no preview card.

With SSG, at build time `vite-ssg` renders each public route to a real `.html`
file containing the full DOM, all `<meta>` tags (OG, Twitter Card, JSON-LD), and
inlined critical CSS. Bots see the real page. Users still get the full Vue SPA
experience after hydration.

---

## How It Works

```
npm run build
│
├─ 1. vite build          → client bundle (dist/assets/*)
├─ 2. vite build --ssr    → server bundle (.vite-ssg-temp/)
├─ 3. vite-ssg render     → renders each route to .html
│     ├─ /  → dist/index.html (30 KiB, pre-rendered)
│     └─ /admin/* → SKIPPED (client SPA only)
└─ 4. cleanup             → .vite-ssg-temp/ deleted
```

### Key concept: `includedRoutes`

In `vite.config.ts`:

```ts
ssgOptions: {
  includedRoutes(paths) {
    return paths.filter((p) => !p.startsWith('/admin'))
  },
}
```

This ensures **only public routes** are pre-rendered. All `/admin/*` routes stay
as a client-side SPA — they don't need SEO and they use Firebase Auth which
requires a browser.

---

## Architecture Decisions

### 1. `main.ts` uses `ViteSSG()` instead of `createApp()`

```ts
export const createApp = ViteSSG(
  App,
  { routes, base },
  ({ app, router, isClient }) => {
    // shared: Pinia
    // client-only: gtag, smooth-scroll, auth guards
  },
);
```

`ViteSSG` creates both the Vue app and the router internally. It passes an
`isClient` flag so you can guard browser-only code.

### 2. Router exports raw `routes`, not a router instance

```ts
// src/router/index.ts
export const routes: RouteRecordRaw[] = [...]
export function installRouterGuards(router: Router) { ... }
```

`ViteSSG` needs the raw route array to create its own router. The auth guard
function is exported separately and installed only on the client.

### 3. Firebase uses lazy Proxy singletons

```ts
export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    if (!_db) _db = initializeFirestore(getApp(), { ... })
    return Reflect.get(_db, prop, receiver)
  },
})
```

Firebase SDK requires `window`, `indexedDB`, and other browser APIs. It **cannot**
be initialised during the SSG build (Node.js). The Proxy pattern defers
initialisation until the first property access, which only happens at runtime in
the browser (inside `onMounted`, event handlers, etc.).

**Call sites are unchanged** — `import { db } from '@/firebase'` still works
everywhere. The Proxy is transparent.

### 4. `v-smooth-scroll` directive gets an SSR no-op

```ts
if (!isClient) {
  app.directive("smooth-scroll", {});
}
```

`vue3-smooth-scroll` has no SSR support. Registering an empty directive prevents
Vue's server renderer from crashing on `ssrGetDirectiveProps`.

### 5. `@unhead/vue` replaces `unhead`

Old (v1):

```ts
import { useHead, useServerHead, useSeoMeta, useServerSeoMeta } from "unhead";
```

New (v2, via vite-ssg):

```ts
import { useHead, useSeoMeta } from "@unhead/vue";
```

`useServerHead` / `useServerSeoMeta` are no longer needed — `vite-ssg` handles
the SSR context automatically. `useHead` and `useSeoMeta` render to the HTML
during SSG and become reactive on the client after hydration.

---

## Checklist for Future Features

When adding a **new public route** (e.g., `/blog`, `/blog/:slug`):

1. **Add the route** to `src/router/index.ts` → `routes` array
2. **vite-ssg auto-discovers it** (as long as it's not filtered by `includedRoutes`)
3. **Call `useHead()` / `useSeoMeta()`** in the page component for per-page SEO
4. **If the route is dynamic** (e.g., `/blog/:slug`), provide a custom `includedRoutes` that enumerates all slugs:
   ```ts
   // vite.config.ts
   ssgOptions: {
     async includedRoutes(paths, routes) {
       const slugs = await fetchBlogSlugs() // fetch from Firestore or API
       const blogPaths = slugs.map(s => `/blog/${s}`)
       return [...paths.filter(p => !p.startsWith('/admin')), ...blogPaths]
     },
   }
   ```
5. **Wrap browser-only code** in `onMounted` or `if (import.meta.env.SSR === false)`
6. **Never call Firebase at the module top level** — always inside `onMounted`, `watch`, or event handlers
7. **Test SSG** by running `npm run build` — if it crashes, the error will name the offending component

### When adding a new **admin-only** route:

No SSG concerns — admin routes are filtered out. Just add to the router and it stays SPA.

---

## Testing SSG Locally

```bash
# Build with SSG
npm run build

# Preview the static output
npx vite preview --port 4173

# Verify pre-rendered HTML (simulates a bot)
curl -s http://localhost:4173/ | grep '<title>'
curl -s http://localhost:4173/ | grep 'og:title'
curl -s http://localhost:4173/ | grep 'twitter:card'

# View full page source
open http://localhost:4173/   # then Right-click → View Page Source
```

The `dist/index.html` should contain real HTML content (sections, text, meta
tags), not just `<div id="app"></div>`.

---

## GitHub Pages Deployment

The workflow (`.github/workflows/deploy.yml`) runs:

```yaml
- run: npm run build # vite-ssg generates pre-rendered HTML
- run: cp dist/index.html dist/404.html # fallback for SPA routes (/admin/*)
- uses: peaceiris/actions-gh-pages@v4 # deploys dist/ to gh-pages branch
```

The `404.html` copy is still needed because `/admin/*` routes are not
pre-rendered — GitHub Pages would return a real 404 without it.

---

## Packages

| Package       | Role                                               | Dev?                      |
| ------------- | -------------------------------------------------- | ------------------------- |
| `vite-ssg`    | SSG build orchestrator                             | Yes                       |
| `@unhead/vue` | `useHead()`, `useSeoMeta()` — head/meta management | Yes (bundled by vite-ssg) |

Removed: `unhead` v1, `@unhead/addons` (replaced by `@unhead/vue` v2).
