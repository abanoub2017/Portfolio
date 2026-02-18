# Base Components

> Documented props, emits, and usage for all `Ab*` utility components.  
> Update this file when any utility component is added or modified.

---

## AbCard

**File:** `src/components/utils/AbCard.vue`  
**Purpose:** Portfolio project card — image with hover overlay, title, and category tag.

### Props

| Prop    | Type     | Required | Default     | Description                                                   |
| ------- | -------- | -------- | ----------- | ------------------------------------------------------------- |
| `link`  | `string` | ✅       | —           | Full external URL opened in new tab                           |
| `img`   | `string` | ✅       | —           | Resolved image URL (use `new URL(...)` pattern from `AWorks`) |
| `title` | `string` | ✅       | —           | Project name shown in card footer                             |
| `tag`   | `string` | ❌       | `undefined` | Category pill (e.g. `"E-Commerce"`, `"Healthcare"`)           |

### Emits

None — click analytics (`trackCard`) handled internally.

### Usage

```html
<AbCard
  :link="work.link"
  :img="getImageUrl(work.img)"
  :title="work.content"
  :tag="work.tag"
/>
```

### Notes

- Image uses `loading="lazy"` — correct for below-fold cards
- Image uses `aspect-[16/10]` with `object-cover object-top` to show website headers
- Falls back to "No preview" placeholder on `@error`

---

## AbCardSkeleton

**File:** `src/components/utils/AbCardSkeleton.vue`  
**Purpose:** Animated placeholder shown in the Works grid while the section has not yet entered the viewport.

### Props

None

### Emits

None

### ⚠️ Known Issue

Current implementation uses outdated sizing classes from former layout. Must be updated to match `AbCard`'s `aspect-[16/10]` shape. See `docs/Tasks/KnownIssues.md` item #6.

### Correct implementation

```html
<template>
  <div
    class="rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 flex flex-col"
  >
    <div
      class="aspect-[16/10] bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 animate-pulse"
    />
    <div class="flex items-center justify-between px-4 py-3 gap-3">
      <div
        class="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"
      />
      <div
        class="h-4 w-16 bg-gray-100 dark:bg-slate-700 rounded-full animate-pulse"
      />
    </div>
  </div>
</template>
```

---

## AbAnimatedPlaceholder

**File:** `src/components/utils/AbAnimatedPlaceholder.vue`  
**Purpose:** Generic full-width animated loading bar. Height is set by parent via class.

### Props

None (height controlled externally: `<AbAnimatedPlaceholder class="h-[150px]" />`)

### ⚠️ Known Issue

Missing `to-*` color in gradient — renders as flat gray. Fix: add `to-gray-300 dark:to-slate-600`.

---

## AbTypewriter

**File:** `src/components/utils/AbTypewriter.vue`  
**Purpose:** Animated typewriter cycling through front-end role names in the hero section.

### Props

None (words are inline constants — extend `displayTextArray` to change them)

### Emits

None

### Configuration (in component)

```ts
const displayTextArray = ["Developer", "Engineer", "Designer", "Freelancer"];
const typingSpeed = 100; // ms per character typed
const erasingSpeed = 100; // ms per character erased
const newTextDelay = 2000; // ms pause after word is complete
```

### Notes

- Cursor `|` blink is defined in `src/assets/scss/AbTypeWriter.scss`
- Timer is correctly cleared on `onUnmounted`

---

## AbTextModel

**File:** `src/components/utils/AbTextModel.vue`  
**Purpose:** Hero glassmorphism CTA card — name, bio blurb, and "Hire Me" / "See My Work" buttons.

### Props

None (all content is static — update directly in the component template)

### Emits

None — "Hire Me" click fires `trackHireMe()` GA4 event internally.

### Notes

- Uses glassmorphism: `bg-white/5 backdrop-blur-sm border border-white/10`
- Only works correctly on a dark/gradient background — do not reuse outside hero

---

## AbDarkMode

**File:** `src/components/utils/AbDarkMode.vue`  
**Purpose:** Toggle button for dark/light mode.

### Props

None

### Emits

None — state managed via `@vueuse/core useDark()` + `localStorage`

### Notes

- `useDark()` writes to `localStorage` key `vueuse-color-scheme`
- Toggling adds/removes `class="dark"` on `<html>`
- Sun icon shown in dark mode (click to go light); moon icon shown in light mode

---

## AbHamburger

**File:** `src/components/utils/AbHamburger.vue`  
**Purpose:** Mobile hamburger button + full-screen nav overlay. Hidden at `lg` and above.

### Props

None

### Emits

None

### ⚠️ Known Issues

1. Only 5 links — missing `services` and `testimonials`
2. `<ul role="navigation">` — incorrect; `role="navigation"` belongs on `<nav>`
3. Focus not trapped — keyboard accessibility gap

---

## AbToast

**File:** `src/components/utils/AbToast.vue`  
**Purpose:** Fixed bottom-right notification message after async operations.

### Props

| Prop       | Type                   | Required | Default                       | Description                                     |
| ---------- | ---------------------- | -------- | ----------------------------- | ----------------------------------------------- |
| `message`  | `string`               | ❌       | `'Message sent successfully'` | Notification body text                          |
| `type`     | `'success' \| 'error'` | ❌       | `'success'`                   | Controls icon and icon color                    |
| `duration` | `number`               | ❌       | `4000`                        | Auto-dismiss delay in ms. `0` = no auto-dismiss |

### Emits

| Event        | Payload | Description                                            |
| ------------ | ------- | ------------------------------------------------------ |
| `closeToast` | none    | Fired after `duration` ms or when close button clicked |

### Usage

```html
<AbToast
  v-if="toast.show"
  @closeToast="toast.show = false"
  :message="toast.message"
  :type="toast.type"
/>
```

### Notes

- Renders as `role="status"` + `aria-live="polite"` — screen-reader accessible
- Positioned `fixed bottom-5 right-5 z-50`
- Always use via the `toast` reactive object pattern — never render unconditionally
