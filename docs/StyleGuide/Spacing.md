# Spacing

---

## Base Unit

All spacing uses Tailwind's default 4px base unit (`1 unit = 0.25rem = 4px`).

---

## Spacing Scale Reference

| Tailwind | `rem`   | `px` | Common use                         |
| -------- | ------- | ---- | ---------------------------------- |
| `gap-1`  | 0.25rem | 4px  | Icon inner gap                     |
| `gap-2`  | 0.5rem  | 8px  | Tag pills gap, tight row gap       |
| `gap-3`  | 0.75rem | 12px | Section header stack gap           |
| `gap-4`  | 1rem    | 16px | Contact card rows, inline groups   |
| `gap-5`  | 1.25rem | 20px | Stat card grid gap, form field gap |
| `gap-6`  | 1.5rem  | 24px | Works grid gap, default card grid  |
| `gap-8`  | 2rem    | 32px | Two-column layout gap              |
| `gap-10` | 2.5rem  | 40px | Contact section columns gap        |
| `gap-12` | 3rem    | 48px | About section columns gap          |
| `gap-16` | 4rem    | 64px | Wide desktop section column gap    |
| `gap-20` | 5rem    | 80px | Large content blocks               |
| `p-4`    | 1rem    | 16px | Compact card padding               |
| `p-6`    | 1.5rem  | 24px | Standard card padding              |
| `p-7`    | 1.75rem | 28px | AbTextModel, service cards         |
| `p-8`    | 2rem    | 32px | Contact form card                  |
| `px-5`   | 1.25rem | 20px | Container horizontal padding       |
| `py-20`  | 5rem    | 80px | Section vertical padding — mobile  |
| `py-24`  | 6rem    | 96px | Section vertical padding — desktop |

---

## Section Spacing System

All page sections **must** use the `.section-spacing` SCSS utility — never set section padding manually.

```scss
// src/assets/scss/main.scss
.section-spacing {
  padding-top: 5rem; // py-20
  padding-bottom: 5rem;

  @media (min-width: 768px) {
    padding-top: 6rem; // py-24
    padding-bottom: 6rem;
  }
}
```

Section header bottom margin is always `mb-12` (small sections) or `mb-14` (standard).

---

## Container System

Defined in `src/assets/scss/main.scss`. Always combine with `mx-auto px-5`:

```html
<div class="container mx-auto px-5"></div>
```

| Breakpoint       | Max Width |
| ---------------- | --------- |
| Default (mobile) | 100%      |
| `sm` (480px)     | 480px     |
| `md` (768px)     | 768px     |
| `lg` (1024px)    | 1024px    |
| `xl` (1280px)    | 1280px    |

---

## Grid Column Gaps

| Grid type             | Gap       | Tailwind           |
| --------------------- | --------- | ------------------ |
| Works card grid       | 24px      | `gap-6`            |
| Stat cards            | 20px      | `gap-5`            |
| Service cards         | 32px      | `gap-8`            |
| Skills category cards | 24px      | `gap-6`            |
| Contact 2-col         | 40px–64px | `gap-10 lg:gap-16` |
| About 2-col           | 48px–80px | `gap-12 lg:gap-20` |

---

## Component Internal Spacing

| Component                              | Internal padding                       | Rule                                       |
| -------------------------------------- | -------------------------------------- | ------------------------------------------ |
| Standard card (`AbCard`, service card) | `p-6` or `p-7`                         | Use `p-6` for standard, `p-7` for featured |
| Contact form card                      | `p-8`                                  | Larger for forms                           |
| Icon badge (nav, contact)              | `w-8 h-8` or `w-10 h-10`               | 8 = inline, 10 = card-level                |
| Button                                 | `px-5 py-2.5`                          | Standard CTA                               |
| Input / textarea                       | `px-4 py-2.5`                          | All form controls                          |
| Tag pill                               | `px-2 py-0.5` (xs) or `px-3 py-1` (sm) | xs for card tags, sm for stack chips       |

---

## Responsive Layout Rules

| Breakpoint       | Columns                                                      |
| ---------------- | ------------------------------------------------------------ |
| Default (mobile) | `grid-cols-1`                                                |
| `sm` (480px)     | `sm:grid-cols-2`                                             |
| `lg` (1024px)    | `lg:grid-cols-2` (2-col layouts) or `lg:grid-cols-3` (cards) |
| `xl` (1280px)    | `xl:grid-cols-4` (works, skills)                             |
