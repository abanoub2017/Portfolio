# Reusable Component Rules

> Follow these rules every time you create a new `Ab*` utility component.

---

## What Makes a Component "Reusable"?

A utility (`Ab*`) component must satisfy all of the following:

1. **No hardcoded content** — all variable text, URLs, and data come from props
2. **No section-specific logic** — it should not import `useGlobalLoading`, know about `#contact`, etc.
3. **Fully typed props** — uses `defineProps<T>()` with an explicit TypeScript interface
4. **Declares all outputs** — uses `defineEmits<...>()` for every user interaction the parent needs to handle
5. **Self-contained styling** — all visual state is expressed via Tailwind classes or scoped SCSS
6. **Documented** — added to `docs/Components/BaseComponents.md` before merging

---

## Component Skeleton Template

```vue
<template>
  <!-- Root element with required a11y attributes -->
  <div
    class="[layout classes] [color classes] [interaction classes]"
    :class="[conditional class bindings]"
    @click="handleClick"
  >
    <!-- Content slots or static layout -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  propName: string;
  optionalProp?: string;
}

const props = withDefaults(defineProps<Props>(), {
  optionalProp: "default value",
});

// ── Emits ──────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: "actionName", payload: string): void;
  (e: "closeToast"): void;
}>();

// ── State ──────────────────────────────────────────────────────────────────
const localState = ref(false);

// ── Methods ────────────────────────────────────────────────────────────────
function handleClick(): void {
  emit("actionName", props.propName);
}
</script>

<style lang="scss" scoped>
// Only add component-specific styles not achievable with Tailwind
</style>
```

---

## Props Rules

### Always use generic `defineProps<T>()`

```ts
// ✅ Correct
interface Props {
  link: string;
  tag?: string;
}
const props = defineProps<Props>();

// ❌ Wrong — runtime declaration loses TypeScript benefits
const props = defineProps({
  link: String,
  tag: String,
});
```

### Use `withDefaults` for optional props

```ts
const props = withDefaults(defineProps<Props>(), {
  tag: undefined,
  duration: 4000,
});
```

### Prop naming

- `camelCase` in `defineProps`
- Consumed from parent with `kebab-case` attribute: `:my-prop="value"`
- Vue handles the conversion automatically

---

## Emits Rules

### Always declare emits

```ts
const emit = defineEmits<{
  (e: "closeToast"): void;
  (e: "cardClick", link: string): void;
}>();
```

### Emit naming

- `camelCase` event names
- Parent listens with `@camelCase` → `@closeToast`, `@cardClick`

### Never mutate parent data directly

Always emit an event and let the parent update its own state:

```ts
// ✅ Correct
emit("closeToast");

// ❌ Wrong — do not mutate props
props.show = false;
```

---

## Accessibility Rules for New Components

Every interactive component must have:

```html
<!-- Buttons -->
<button
  :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  class="focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
  <!-- Links -->
  <a
    href="..."
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="title + ' — opens in new tab'"
  >
    <!-- Loading states -->
    <div role="status" aria-live="polite">
      <!-- Decorative icons -->
      <svg aria-hidden="true"></svg></div
  ></a>
</button>
```

---

## Styling Rules for New Components

1. Use **Tailwind utilities first** — only add scoped SCSS when Tailwind cannot achieve the effect
2. Always include **dark mode variants**: `bg-white dark:bg-slate-800`
3. All color references must use tokens from `docs/StyleGuide/Colors.md` — never arbitrary hex values in Tailwind classes
4. Hover/focus/transition must follow `docs/DesignSystem/InteractionPatterns.md`
5. Use `rounded-2xl` for cards, `rounded-xl` for inputs/buttons, `rounded-full` for pills
6. Do not use `!important` — restructure the class order instead

---

## Checklist Before Marking a Component Done

- [ ] `defineProps<T>()` with explicit interface
- [ ] `defineEmits<...>()` declared (even if empty)
- [ ] All interactive elements have `aria-label` or associated `<label>`
- [ ] All `target="_blank"` links have `rel="noopener noreferrer"`
- [ ] Dark mode variants present on all color classes
- [ ] Hover state follows interaction patterns guide
- [ ] Focus ring present on all focusable elements
- [ ] `<style>` block is empty if Tailwind handles everything (don't leave dead SCSS)
- [ ] Added to `docs/Components/BaseComponents.md`
- [ ] `vue-tsc --noEmit` passes: `npm run type-check`
