# Component Architecture

---

## Overview

The application is a single-page portfolio with a flat component hierarchy. Maximum depth is 4 levels.

```
App.vue (root shell)
  └── HomeView.vue (single route view — pure composition)
        ├── AHero
        │     ├── AbTypewriter
        │     └── AbTextModel
        ├── AAbout
        ├── AServices
        ├── ASkills
        ├── AWorks
        │     ├── AbCard (×n)
        │     └── AbCardSkeleton (×8, while loading)
        ├── ATestimonials
        └── AContact
              └── AbToast (conditional)

App.vue also renders:
  ├── ANav
  │     ├── AbDarkMode
  │     └── AbHamburger
  └── AFooter
```

---

## Component Responsibilities

### App.vue — Root Shell Only

**Does:**

- Manages loading screen (coordinates `useGlobalLoading` + 400ms minimum timer)
- Provides layout wrapper: `<ANav>` → `<RouterView>` → `<AFooter>`
- Calls `useGlobalHeadMeta` with site-wide SEO data
- Owns global transition CSS (fade, loading-fade)

**Does NOT:**

- Contain section content
- Manage section-specific state
- Import section components directly

---

### HomeView.vue — Pure Composition

**Does:**

- Import and render all section components in order

**Does NOT:**

- Contain any logic, state, or composables
- Pass props between sections (sections are self-contained)

---

### A{Section}.vue — Section Components (base/)

**Each section component:**

- Owns its own data (inline or from `src/data/`)
- Owns its own lazy-load logic (`useIntersectionObserver`)
- Has a root `<section id="{name}">` element (required for scroll nav)
- Uses `.section-spacing`, `.section-header`, `.section-label`, `.section-title` from SCSS
- Handles its own loading/skeleton state internally

**Rules:**

- No props — sections are data-driven internally
- No emits — sections communicate outward only via composables (analytics, loading)
- One `<h2>` per section — use `.section-title`

---

### Ab{Atom}.vue — Utility Components (utils/)

**Each utility component:**

- Is truly reusable — no hardcoded content
- Accepts props for all variable content
- Declares emits for all user interactions that the parent should handle
- Has no knowledge of the sections that use it

**Rules:**

- Always use `defineProps<T>()` with explicit TypeScript type
- Always use `defineEmits<{ (e: '...'): void }>()` for custom events
- Export `withDefaults` when props have defaults
- Must be documented in `docs/Components/BaseComponents.md`

---

## Data Flow Patterns

### Static section data

Data is defined as typed constants inside the component `<script setup>` or as a named export in `src/data/`.

```ts
// For simple, section-specific data: inline in component
const services: Service[] = [ ... ]

// For data that may grow or be shared: src/data/{name}.ts
export const workList: WorkItem[] = [ ... ]
```

### Async data (currently: contact form)

Managed with local `ref`s and `reactive` — no Pinia needed for single-use form state.

```ts
const loading = ref(false);
const toast = reactive<Toast>({ show: false, message: "", type: "success" });
```

### Cross-component coordination

Only `useGlobalLoading` crosses component boundaries — it uses a module-scope singleton ref to coordinate the loading screen between `AHero` and `App.vue`.

### Analytics

`useAnalytics()` is stateless — call it in any component that fires events. It wraps `vue-gtag`'s `event()` function.

---

## Adding a New Section — Step by Step

1. Create `src/components/base/A{Name}.vue`
2. Add `<section id="{name}">` as root element
3. Add to `src/views/HomeView.vue` in correct order
4. Add `{ id: '{name}', label: '{Label}' }` to `navItems` in `ANav.vue`
5. Add anchor `<a href="#{name}">` to `AbHamburger.vue`
6. If data is complex: create `src/data/{name}.ts` with typed interface + array
7. If section needs scroll detection: use `useIntersectionObserver`
8. Document section in `docs/DesignSystem/Components.md`

---

## Composable Usage Map

| Composable                       | Used In                                 |
| -------------------------------- | --------------------------------------- |
| `useGlobalLoading`               | `AHero.vue` (write), `App.vue` (read)   |
| `useIntersectionObserver`        | `AWorks`, `AContact`, `ASkills`         |
| `useAnalytics`                   | `AbCard`, `AbTextModel`, `AContact`     |
| `useSmoothScroll`                | `main.ts` (installs directive globally) |
| `useGlobalHeadMeta`              | `App.vue`                               |
| `useMainHeadMeta`                | `main.ts`                               |
| `useDark` / `useToggle` (vueuse) | `AbDarkMode`                            |
| `onClickOutside` (vueuse)        | `AbHamburger`                           |

---

## State Ownership

| State                     | Owner             | Mechanism                                          |
| ------------------------- | ----------------- | -------------------------------------------------- |
| Dark mode preference      | `AbDarkMode`      | `@vueuse/core useDark()` → localStorage            |
| Loading screen visibility | `App.vue`         | `isLoading` ref + `useGlobalLoading` computed      |
| Hero image ready          | `AHero.vue`       | `markHeroImageReady()` → module singleton          |
| Active nav section        | `ANav.vue`        | local `activeSection` ref + IntersectionObserver   |
| Mobile menu open          | `AbHamburger.vue` | local `openMenu` ref                               |
| Contact form state        | `AContact.vue`    | local `ref`s + `reactive`                          |
| Section visible           | Per-section       | `useIntersectionObserver` → local `isIntersecting` |
