# Interaction Patterns

---

## Transitions & Animations

All interactive elements must use Tailwind's `transition-*` utilities. Never write custom CSS transitions for hover/focus — only for complex animations (typewriter, loading, progress bars).

### Standard transition

```html
class="transition-all duration-300"
```

Used for: card hover lift, border color change, opacity

### Color-only transition

```html
class="transition-colors"
```

Used for: buttons, icon badges, links

### Opacity transition

```html
class="transition-opacity duration-500"
```

Used for: image fade-in on load, hero image reveal

---

## Hover States

### Cards (interactive)

```html
class="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
```

- Lift: `hover:-translate-y-1` (4px lift)
- Shadow: base `shadow-sm` → hover `shadow-2xl`
- Always `transition-all duration-300`

### Cards (non-interactive / info panels)

No hover effect. Static cards (stat cards, contact info cards) only change border:

```html
class="hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
```

### Buttons

```html
<!-- Primary CTA -->
class="bg-indigo-600 hover:bg-indigo-500 transition-colors"

<!-- Ghost button (dark background) -->
class="border border-white/30 hover:bg-white/10 transition-colors"

<!-- Link icon button (footer, nav) -->
class="hover:text-indigo-400 transition-colors"
```

### Nav links

Active link: `color: indigo-600`, `font-weight: 700`, `border-bottom: 2px solid indigo-600`
Inactive link hover: `transition-colors` to indigo

---

## Focus States

All interactive elements must have a visible focus ring for keyboard accessibility.

```html
class="focus:outline-none focus:ring-2 focus:ring-indigo-500"
```

For form inputs:

```html
class="focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
```

Never use `outline: none` or `focus:outline-none` without replacing with a ring.

---

## Loading States

### Button loading

```html
<button :disabled="loading">
  <svg v-if="loading" class="w-4 h-4 animate-spin" ... />
  {{ loading ? 'Sending…' : 'Send Message' }}
</button>
```

- Disable button: `:disabled="loading"`
- Show spinner: `animate-spin` SVG
- Change label: ternary in text node
- Fade button: `disabled:opacity-50 disabled:cursor-not-allowed`

### Image loading (AbCard, AHero)

```html
<img
  :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
  @load="imageLoaded = true"
  class="transition-opacity duration-500"
/>
<div v-if="!imageLoaded" class="absolute inset-0 bg-gray-200 animate-pulse" />
```

### Section lazy render (Intersection)

```html
<template v-if="!isIntersecting">
  <AbCardSkeleton v-for="n in 8" :key="n" />
</template>
<template v-else>
  <!-- real content -->
</template>
```

---

## Scroll Behaviour

All in-page anchor links use the `v-smooth-scroll` directive (registered globally via `vue3-smooth-scroll`):

```html
<a v-smooth-scroll href="#contact">Contact</a>
```

Config (in `useSmoothScroll.ts`):

- `duration: 400ms`
- `updateHistory: false` (does not push `#hash` to browser history)

---

## Page Transition (Route-level)

In `App.vue`, `RouterView` wraps a `<Transition name="fade">`:

- `fade-enter-active / leave-active`: `transition: opacity 0.5s ease`
- Triggered on route change (currently only one route — placeholder for future multi-page expansion)

---

## Scroll-Triggered Animations

Used in `ASkills.vue` — cards and progress bars animate when the section enters the viewport:

```html
:class="{ 'opacity-0 translate-y-4': !isIntersecting, 'opacity-100
translate-y-0': isIntersecting }" style="transition: opacity 0.5s ease,
transform 0.5s ease"
```

Progress bars:

```html
:style="{ width: isIntersecting ? skill.level + '%' : '0%' }"
class="transition-all duration-700"
```

> **Rule:** Use `transition-all duration-700` for bars, `duration-300` for UI interactions, `duration-500` for image/section reveals.

---

## Toast Notifications

Rendered by `AbToast` when async operations complete:

- Auto-dismiss after `duration` ms (default 4000)
- Manual dismiss via close button
- `role="status"` + `aria-live="polite"` for screen readers
- Always positioned `fixed bottom-5 right-5`
- Use `type="success"` or `type="error"` — never raw color overrides

---

## Typewriter Animation

Defined in `AbTypewriter.vue` + `src/assets/scss/AbTypeWriter.scss`:

- Cycles: `Developer → Engineer → Designer → Freelancer`
- Typing speed: 100ms/char
- Erase speed: 100ms/char
- Pause between words: 2000ms
- Cursor: `|` with CSS `blink` keyframe animation (1s step-end)
