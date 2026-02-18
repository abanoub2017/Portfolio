# Colors

> All colors are defined via Tailwind CSS utility classes. Dark mode is toggled by adding `class="dark"` to `<html>` via `@vueuse/core useDark()`.

---

## Design Principle

- **One primary accent**: Indigo. Never mix accent colors.
- **Backgrounds are layered**: `slate-900` (page) → `slate-800` (surface/card) → `slate-700` (input/subtle)
- **Never use bare `bg-black` or `text-black`** — always use the scale tokens below
- **Opacity variants** (`/40`, `/60`) only for decorative overlays, never for text or borders

---

## Color Tokens

### Primary (Accent)

| Role                | Light Mode | Dark Mode               | Tailwind Class                |
| ------------------- | ---------- | ----------------------- | ----------------------------- |
| Primary action      | `#4f46e5`  | `#6366f1`               | `indigo-600` / `indigo-500`   |
| Primary hover       | `#4338ca`  | `#4f46e5`               | `indigo-700` / `indigo-600`   |
| Primary subtle bg   | `#eef2ff`  | `#1e1b4b` (30% opacity) | `indigo-50` / `indigo-900/30` |
| Primary subtle text | `#4f46e5`  | `#a5b4fc`               | `indigo-600` / `indigo-300`   |
| Primary focus ring  | `#6366f1`  | `#6366f1`               | `ring-indigo-500`             |

### Background

| Role             | Light Mode            | Dark Mode               | Tailwind Class                    |
| ---------------- | --------------------- | ----------------------- | --------------------------------- |
| Page background  | `#ffffff` / `#f9fafb` | `#0f172a`               | `white` / `gray-50` · `slate-900` |
| Card / Surface   | `#ffffff`             | `#1e293b`               | `white` · `slate-800`             |
| Subtle surface   | `#f9fafb`             | `#1e293b` (80% opacity) | `gray-50` · `slate-800/80`        |
| Input background | `#f9fafb`             | `#334155`               | `gray-50` · `slate-700`           |
| Hero background  | `#0f172a → #1e293b`   | same                    | `from-slate-900 to-slate-800`     |

> **Rule:** Alternating section backgrounds must follow `white` → `gray-50` → `white` in light mode, and all use `slate-900` in dark mode to ensure consistency.

### Text

| Role            | Light Mode | Dark Mode | Tailwind Class          |
| --------------- | ---------- | --------- | ----------------------- |
| Primary text    | `#111827`  | `#f9fafb` | `gray-900` · `white`    |
| Secondary text  | `#374151`  | `#e5e7eb` | `gray-700` · `gray-200` |
| Muted text      | `#6b7280`  | `#9ca3af` | `gray-500` · `gray-400` |
| Placeholder     | `#9ca3af`  | `#6b7280` | `gray-400` · `gray-500` |
| Label / caption | `#6b7280`  | `#9ca3af` | `gray-500` · `gray-400` |

### Border

| Role           | Light Mode | Dark Mode | Tailwind Class              |
| -------------- | ---------- | --------- | --------------------------- |
| Default border | `#f3f4f6`  | `#334155` | `gray-100` · `slate-700`    |
| Input border   | `#e5e7eb`  | `#475569` | `gray-200` · `slate-600`    |
| Hover border   | `#a5b4fc`  | `#4f46e5` | `indigo-300` · `indigo-600` |
| Divider        | `#e5e7eb`  | `#1e293b` | `gray-200` · `slate-800`    |

### Status Colors

| Status  | Color     | Tailwind      |
| ------- | --------- | ------------- |
| Success | `#10b981` | `emerald-500` |
| Error   | `#ef4444` | `red-500`     |
| Warning | `#f59e0b` | `amber-500`   |
| Info    | `#3b82f6` | `blue-500`    |

---

## Category Accent Colors (Skills, Services)

Each category has a designated accent. Never introduce new accent colors — extend this table instead.

| Category           | Icon BG Light | Icon BG Dark   | Bar/Text      | Tailwind        |
| ------------------ | ------------- | -------------- | ------------- | --------------- |
| Primary / Frontend | indigo        | indigo-900/30  | `indigo-500`  | `bg-indigo-50`  |
| Frontend Core      | orange        | orange-900/30  | `orange-400`  | `bg-orange-50`  |
| DevOps / Tooling   | teal          | teal-900/30    | `teal-500`    | `bg-teal-50`    |
| Design / UX        | purple        | purple-900/30  | `purple-500`  | `bg-purple-50`  |
| Healthcare         | blue          | blue-900/30    | `blue-500`    | `bg-blue-50`    |
| E-Commerce         | emerald       | emerald-900/30 | `emerald-500` | `bg-emerald-50` |

---

## Usage Rules

1. **CTA buttons**: always `bg-indigo-600 hover:bg-indigo-500 text-white`
2. **Ghost buttons**: always `border border-white/30 text-white hover:bg-white/10`
3. **Tags / pills**: `bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300`
4. **Section label** (small uppercase above heading): always `text-indigo-600` (`section-label` SCSS class)
5. **Never use `text-white` on a light background** — use `text-gray-900` or `text-indigo-900`
6. **Section backgrounds** must be declared with both light and dark variants: `bg-white dark:bg-slate-900`
