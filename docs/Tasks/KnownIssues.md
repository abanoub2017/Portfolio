# Known Issues & Quick Fixes

> Auto-generated from Phase 4 code quality review (February 2026).  
> This file tracks all identified issues. Move items to `FeatureSpecific/` as you work on them.

---

## 🔴 Critical

### 1. Web3Forms access key is placeholder

**File:** `src/components/base/AContact.vue` line ~155  
**Problem:** `access_key: 'YOUR_WEB3FORMS_ACCESS_KEY'` — contact form submissions will fail.  
**Fix:**

1. Get key from https://web3forms.com
2. Add `VITE_WEB3FORMS_KEY=your-key` to `.env`
3. Add `VITE_WEB3FORMS_KEY=` to `.env.example`
4. Add to `src/env.d.ts`: `readonly VITE_WEB3FORMS_KEY: string`
5. Replace `access_key: 'YOUR_WEB3FORMS_ACCESS_KEY'` with `access_key: import.meta.env.VITE_WEB3FORMS_KEY`

---

### 2. Cypress e2e test will always fail

**File:** `cypress/e2e/example.cy.js`  
**Problem:** Checks for `cy.contains('h1', 'You did it!')` — this element does not exist.  
**Fix:** Replace with a real spec, e.g.:

```js
describe("Portfolio", () => {
  it("loads the homepage", () => {
    cy.visit("/");
    cy.contains("h1", "Hi, I'm Abanoub").should("be.visible");
  });
  it("nav links scroll to sections", () => {
    cy.visit("/");
    cy.get('a[href="#contact"]').first().click();
    cy.get("#contact").should("be.visible");
  });
});
```

---

### 3. vitest.config.js imports non-existent file

**File:** `vitest.config.js` line 4  
**Problem:** `import viteConfig from "./vite.config.mjs"` — file is `vite.config.ts`, not `.mjs`.  
**Fix:** Change to `import viteConfig from "./vite.config.ts"`

---

## 🟠 High Priority

### 4. Mobile menu missing sections

**File:** `src/components/utils/AbHamburger.vue`  
**Problem:** Menu has 5 links but nav has 7. `services` and `testimonials` are missing.  
**Fix:** Add the two missing `<li>` items to the mobile menu `<ul>`.

---

### 5. OG image path is broken

**File:** `src/composables/useHead/useGlobalHeadMeta.ts` line 4  
**Problem:** `OG_IMAGE = 'https://abanoubgeorge.net/img/profile.png'` — file is not in `public/img/`.  
**Fix:** Either copy `profile.png` to `public/img/profile.png` or change the path to an existing public asset.

---

### 6. AbCardSkeleton layout mismatch

**File:** `src/components/utils/AbCardSkeleton.vue`  
**Problem:** Uses `w-5/12 md:w-1/5 mb-12 shadow-xl rounded-lg` — pre-dates the current `aspect-[16/10]` card grid.  
**Fix:** Rebuild skeleton to match `AbCard`'s new grid shape.

---

### 7. Missing ESLint + Prettier

**Problem:** No linting configured — no formatting enforcement, no Vue-specific rules.  
**Fix:** Add `eslint` + `eslint-plugin-vue` + `@vue/eslint-config-typescript` + `prettier`:

```bash
npm install -D eslint eslint-plugin-vue @vue/eslint-config-typescript @typescript-eslint/eslint-plugin prettier eslint-config-prettier
```

Example `.eslintrc.cjs`:

```js
module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript",
    "prettier",
  ],
  rules: {
    "vue/component-api-style": ["error", ["script-setup"]],
    "vue/define-props-declaration": ["error", "type-based"],
  },
};
```

---

### 8. No .env file / GA4 silent fail

**Problem:** If `VITE_GA_MEASUREMENT_ID` is not set, GA4 is initialized with `undefined` and all events silently fail.  
**Fix:** Create `.env` and `.env.example`. Optionally add a guard in `main.ts`:

```ts
if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
  console.warn("[Analytics] VITE_GA_MEASUREMENT_ID is not set.");
}
```

---

## 🟡 Medium Priority

### 9. profile.png in loading screen + nav while hero uses man2.png

**Files:** `src/App.vue`, `src/components/base/ANav.vue`  
**Problem:** Inconsistent logo assets. Loading screen and nav use `profile.png`; hero uses `man2.png`.  
**Fix:** Decide on one logo asset and use it consistently in all three places.

---

### 10. useServerHead/useServerSeoMeta called in a CSR app

**File:** `src/composables/useHead/useGlobalHeadMeta.ts`  
**Problem:** `useServerHead` and `useServerSeoMeta` are SSR-only calls — they are no-ops in a Vite SPA.  
**Fix:** Remove them or wrap with `if (import.meta.server)` guard (not applicable in pure Vite — just remove).

---

### 11. AbAnimatedPlaceholder gradient broken

**File:** `src/components/utils/AbAnimatedPlaceholder.vue`  
**Problem:** `bg-gradient-to-r from-gray-100` — no `to-*` color, gradient renders as solid `gray-100`.  
**Fix:** `class="bg-gradient-to-r from-gray-100 to-gray-300 dark:from-slate-700 dark:to-slate-600 animate-pulse"`

---

### 12. ASkills progress bars re-animate on every scroll re-entry

**File:** `src/components/base/ASkills.vue`  
**Problem:** `useIntersectionObserver` doesn't disconnect after first true intersection — bars reset and re-animate whenever user scrolls out and back in.  
**Fix:** Disconnect the observer after first `isIntersecting = true` in `useIntersectionObserver`, or add a `once: true` option.

---

### 13. Mobile menu focus not trapped

**File:** `src/components/utils/AbHamburger.vue`  
**Problem:** When menu opens, focus stays behind the overlay — keyboard users can tab to invisible elements.  
**Fix:** Move focus to first menu link on open, trap Tab key within overlay, restore focus on close.

---

### 14. index.html meta description is stale

**File:** `index.html`  
**Problem:** Static `<meta name="description">` is old boilerplate — overridden at runtime but visible to crawlers before JS runs.  
**Fix:** Update to match the string used in `useGlobalHeadMeta`.

---

### 15. Missing Google Fonts preconnect

**File:** `index.html`  
**Problem:** No `<link rel="preconnect">` before the Google Fonts link — adds render-blocking latency.  
**Fix:** Add before the font link:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

---

## 🟢 Low Priority

### 16. HomeView.vue manual imports are redundant

**File:** `src/views/HomeView.vue`  
**Problem:** `unplugin-vue-components` auto-imports all components — manual imports are harmless but redundant.  
**Fix:** Remove all explicit imports from `HomeView.vue`.

---

### 17. Empty variables.scss

**File:** `src/assets/scss/variables.scss`  
**Problem:** File contains only a commented-out variable — effectively dead.  
**Fix:** Either delete the file or populate it with SCSS design tokens matching the Tailwind config values.

---

### 18. stale `media: "class"` in tailwind.config.js

**File:** `tailwind.config.js`  
**Problem:** `media` is not a valid Tailwind v3 top-level key — leftover from v2 migration. No-op.  
**Fix:** Remove the `media: "class"` line.

---

### 19. stores/ is empty but Pinia is registered

**Files:** `src/stores/`, `src/main.ts`  
**Problem:** Pinia is fully set up but unused.  
**Note:** This is fine until a feature needs shared state. No action needed unless adding stores.
