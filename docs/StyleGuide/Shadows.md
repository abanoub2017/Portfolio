# Shadows

---

## Design Principle

Shadows are used to convey **elevation**. Cards sit above the page surface; interactive cards lift further on hover. Dark mode uses near-invisible shadow (the dark surface color handles depth instead) — always pair shadows with a `border` in dark mode.

---

## Shadow Tokens

| Token  | Tailwind      | Usage                                  |
| ------ | ------------- | -------------------------------------- |
| None   | `shadow-none` | Flat elements, section backgrounds     |
| Small  | `shadow-sm`   | Default card resting state             |
| Medium | `shadow-md`   | Skeleton cards, AbCard default         |
| Large  | `shadow-lg`   | Toast notification                     |
| XL     | `shadow-xl`   | AbCardSkeleton (legacy), feature cards |
| 2XL    | `shadow-2xl`  | AbCard on hover                        |

---

## Elevation Rules

### Resting state (default)

Cards use `shadow-sm` or `shadow-md` with a `border border-gray-100 dark:border-slate-700`.

```html
class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700
rounded-2xl shadow-sm"
```

### Hover state (interactive cards)

Cards that are links or have hover effects must lift:

```html
class="... shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all
duration-300"
```

### Non-interactive cards

Stat cards, info panels — `shadow-sm` only, no hover effect.

### Overlay elements

Toast, mobile menu, loading screen — no shadow (they use `fixed`/`absolute` positioning and `z-index`).

---

## Dark Mode Shadow Behaviour

In dark mode, Tailwind's shadow colors are very dark and nearly invisible against `slate-800/slate-900` backgrounds. Instead, **borders** carry the elevation signal:

- Light mode: shadow = depth cue
- Dark mode: `border border-slate-700` = depth cue

Always include both. Example:

```html
class="shadow-sm border border-gray-100 dark:border-slate-700 bg-white
dark:bg-slate-800"
```

---

## Glassmorphism (Hero only)

Used exclusively in `AbTextModel.vue` — the hero CTA card:

```html
class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
```

Do **not** use glassmorphism outside the hero section. It requires a dark/gradient background to read correctly.
