# Typography

---

## Font Family

| Role      | Font         | Source                        |
| --------- | ------------ | ----------------------------- |
| Body & UI | **Nunito**   | Google Fonts (`display=swap`) |
| Fallback  | `sans-serif` | System                        |

Loaded in `index.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap"
  rel="stylesheet"
/>
```

> **TODO (performance):** Add `<link rel="preconnect" href="https://fonts.googleapis.com">` before the font link to eliminate render-blocking latency.

Configured in `tailwind.config.js`:

```js
fontFamily: {
  nunito: ['Nunito', 'sans-serif'],
}
```

---

## Type Scale

All sizes use Tailwind's default scale. Reference:

| Name | Size | `rem`    | Tailwind Class | Usage                                  |
| ---- | ---- | -------- | -------------- | -------------------------------------- |
| xs   | 12px | 0.75rem  | `text-xs`      | Labels, tags, captions, section-label  |
| sm   | 14px | 0.875rem | `text-sm`      | Body secondary, card text, form inputs |
| base | 16px | 1rem     | `text-base`    | Body primary                           |
| lg   | 18px | 1.125rem | `text-lg`      | Card titles, sub-headings              |
| xl   | 20px | 1.25rem  | `text-xl`      | Feature headings                       |
| 2xl  | 24px | 1.5rem   | `text-2xl`     | Nav brand, secondary headings          |
| 3xl  | 30px | 1.875rem | `text-3xl`     | Section titles (`.section-title`)      |
| 4xl  | 36px | 2.25rem  | `text-4xl`     | Hero sub-text                          |
| 5xl  | 48px | 3rem     | `text-5xl`     | Hero typewriter                        |

---

## Font Weights

| Weight    | Value | Tailwind         | Usage                                |
| --------- | ----- | ---------------- | ------------------------------------ |
| Light     | 300   | `font-light`     | Decorative, cursor glyph             |
| Regular   | 400   | `font-normal`    | Body copy                            |
| Medium    | 500   | `font-medium`    | Sub-labels, nav links                |
| Semibold  | 600   | `font-semibold`  | Card titles, button labels, headings |
| Bold      | 700   | `font-bold`      | Section titles, nav brand            |
| Extrabold | 800   | `font-extrabold` | Stat values                          |

---

## Line Heights

| Context             | Tailwind          | Value |
| ------------------- | ----------------- | ----- |
| Tight (headings)    | `leading-tight`   | 1.25  |
| Snug (sub-headings) | `leading-snug`    | 1.375 |
| Normal (body)       | `leading-normal`  | 1.5   |
| Relaxed (body copy) | `leading-relaxed` | 1.625 |
| Loose (descriptive) | `leading-loose`   | 2     |

> Body copy in sections uses `leading-relaxed`. Hero text uses `leading-tight`.

---

## Letter Spacing

| Usage                       | Tailwind          | Value   |
| --------------------------- | ----------------- | ------- |
| Section labels (`ALL CAPS`) | `tracking-widest` | 0.1em   |
| Tag pills, form labels      | `tracking-wide`   | 0.025em |
| Normal text                 | default           | 0       |

---

## Heading Hierarchy Rules

Each page section must have exactly one `<h2>`. The hero `<h1>` is in `AbTextModel.vue`.

| Tag           | Component              | Tailwind Classes                                                               |
| ------------- | ---------------------- | ------------------------------------------------------------------------------ |
| `<h1>`        | `AbTextModel.vue` only | `text-3xl lg:text-4xl font-bold text-white leading-tight`                      |
| `<h2>`        | One per section        | `.section-title` (SCSS) → `text-3xl font-bold text-gray-900 dark:text-white`   |
| `<h3>`        | Card / item titles     | `font-semibold text-lg text-gray-900 dark:text-white`                          |
| `<p>` body    | Section descriptions   | `text-gray-600 dark:text-gray-400 leading-relaxed`                             |
| `<p>` caption | Labels, meta text      | `text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide` |

---

## SCSS Section Header Utilities

Defined in `src/assets/scss/main.scss`:

```scss
.section-label    // xs, bold, uppercase, tracking-widest, indigo-600
.section-title    // 3xl, bold, gray-900 / white dark
.section-subtitle // muted, leading-relaxed, max-w-2xl
```

Always use these classes for section headers — never recreate them inline.
