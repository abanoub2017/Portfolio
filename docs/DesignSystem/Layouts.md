# Layouts

---

## Page Layout Shell

Defined in `App.vue`:

```
Fixed loading overlay (z-50)
  ↓ dismisses after hero image loads + 400ms minimum
<main>
  <ANav />          ← sticky top nav
  <RouterView />    ← HomeView
  <AFooter />
</main>
```

`<main>` uses `invisible` class while loading to keep elements in DOM (for image preloading) without showing them.

---

## Section Layout Template

Every page section must follow this exact structure:

```html
<section id="{sectionId}" class="{bgColor} section-spacing" ref="target">
  <div class="container mx-auto px-5">
    <!-- Section Header -->
    <div class="section-header mb-14">
      <span class="section-label">{LABEL TEXT}</span>
      <h2 class="section-title">{Section Title}</h2>
      <p class="section-subtitle">{Optional subtitle paragraph}</p>
    </div>

    <!-- Section Content -->
    ...
  </div>
</section>
```

**Rules:**

- Always `section` element (not `div`) with an `id` for anchor navigation
- `ref="target"` only if using `useIntersectionObserver`
- Background class on `section`, not on `container`
- `px-5` on the inner container for consistent edge gutters

---

## Section Background Sequence

Sections alternate backgrounds to create visual separation:

| Section         | Light BG                                             | Dark BG             |
| --------------- | ---------------------------------------------------- | ------------------- |
| `#home` (AHero) | `from-slate-900 to-slate-800` (dark gradient always) | same                |
| `#about`        | `bg-white`                                           | `dark:bg-slate-900` |
| `#services`     | `bg-gray-50`                                         | `dark:bg-slate-900` |
| `#skills`       | `bg-gray-50`                                         | `dark:bg-slate-900` |
| `#works`        | `bg-white`                                           | `dark:bg-slate-900` |
| `#testimonials` | `bg-white`                                           | `dark:bg-slate-900` |
| `#contact`      | `bg-gray-50`                                         | `dark:bg-slate-900` |
| Footer          | `bg-slate-900` (always dark)                         | same                |

---

## Two-Column Layout (Desktop)

Used in `AAbout`, `AContact`:

```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
  <!-- LEFT -->
  <div>...</div>
  <!-- RIGHT -->
  <div>...</div>
</div>
```

- Single column on mobile, 2-column at `lg` (1024px)
- `items-start` — columns align to top, not stretched
- Gap widens at desktop: `gap-12 lg:gap-20` or `gap-10 lg:gap-16`

---

## Card Grid Layouts

### Works grid (dense, many items)

```html
<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
></div>
```

### Service cards (wider)

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"></div>
```

### Skill categories

```html
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"></div>
```

### Testimonials

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-8"></div>
```

### Stat cards (within AAbout)

```html
<div class="grid grid-cols-2 gap-5"></div>
```

---

## Nav Layout

```html
<nav class="nav">
  <div class="nav__container">
    ← flex row, space-between Logo + brand name
    <ul>
      nav links (hidden on mobile)
    </ul>
    Dark mode toggle + Hamburger (mobile only: hamburger)
  </div>
</nav>
```

Nav is `position: sticky` at top, with appropriate z-index to sit above page content but below loading overlay.

---

## Responsive Breakpoints

Configured in `tailwind.config.js`:

| Name | Min Width | Notes                                              |
| ---- | --------- | -------------------------------------------------- |
| `sm` | 480px     | 2-column grids start here                          |
| `md` | 768px     | Desktop nav could also be triggered here           |
| `lg` | 1024px    | 2-column layouts, 3-column grids, hamburger hidden |
| `xl` | 1280px    | 4-column grids                                     |

> Note: Tailwind default `2xl` (1536px) is **not configured** — do not use `2xl:` classes without adding it to `tailwind.config.js` first.

---

## Z-Index Scale

| Layer                  | z-index       | Tailwind                         |
| ---------------------- | ------------- | -------------------------------- |
| Hero decorative circle | below content | negative / `pointer-events-none` |
| Page content           | 0             | default                          |
| Mobile menu overlay    | 40            | `z-40`                           |
| Sticky nav             | 50            | `z-50`                           |
| Loading overlay        | 50            | `z-50`                           |
| Toast notification     | 60            | `z-[60]` (if needed above nav)   |
