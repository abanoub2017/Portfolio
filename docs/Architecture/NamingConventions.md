# Naming Conventions

---

## Files & Folders

| Type                  | Convention                          | Example                                  |
| --------------------- | ----------------------------------- | ---------------------------------------- |
| Vue section component | `PascalCase`, `A` prefix            | `AHero.vue`, `AContact.vue`              |
| Vue utility component | `PascalCase`, `Ab` prefix           | `AbCard.vue`, `AbToast.vue`              |
| Vue view              | `PascalCase`, `View` suffix         | `HomeView.vue`                           |
| TypeScript composable | `camelCase`, `use` prefix           | `useAnalytics.ts`, `useGlobalLoading.ts` |
| TypeScript data file  | `camelCase`, noun                   | `works.ts`, `testimonials.ts`            |
| Pinia store           | `camelCase`, noun                   | `ui.ts`, `blog.ts`                       |
| SCSS file             | `PascalCase` for component-specific | `AbTypeWriter.scss`                      |
| SCSS file             | `camelCase` for global              | `main.scss`, `variables.scss`            |
| Folder                | `camelCase`                         | `base/`, `utils/`, `useHead/`            |
| Docs file             | `PascalCase`                        | `Colors.md`, `FolderStructure.md`        |

---

## Component Naming

### `A` prefix — Page Sections

Components in `src/components/base/` that map to a visible section of the page.

- One per section
- Named after the section: `AAbout`, `AServices`, `ASkills`, `AWorks`
- Never reused in multiple places

### `Ab` prefix — Utility Atoms

Components in `src/components/utils/` that are reusable across sections.

- Composable, prop-driven
- No hardcoded content
- Can be used by any section

---

## TypeScript Naming

| Type                | Convention                   | Example                                                        |
| ------------------- | ---------------------------- | -------------------------------------------------------------- |
| Interface           | `PascalCase`                 | `WorkItem`, `Service`, `NavItem`, `Toast`                      |
| Type alias          | `PascalCase`                 | `ToastType`                                                    |
| Enum                | `PascalCase`                 | `LoadingState`                                                 |
| `ref` variable      | `camelCase`                  | `const isLoading = ref(false)`                                 |
| `reactive` variable | noun, `camelCase`            | `const toast = reactive<Toast>(...)`                           |
| Composable return   | destructured camelCase       | `const { target, isIntersecting } = useIntersectionObserver()` |
| Prop                | `camelCase` in `defineProps` | `link`, `imgSrc`, `isLoading`                                  |
| Emit event name     | `camelCase` string           | `'closeToast'`, `'cardClick'`                                  |
| Pinia store         | `use{Feature}Store`          | `useUiStore`, `useBlogStore`                                   |

---

## Template / HTML Naming

| Type                       | Convention                 | Example                                          |
| -------------------------- | -------------------------- | ------------------------------------------------ |
| `id` attributes            | `kebab-case`               | `id="contact-form"`                              |
| Section `id` (nav anchor)  | single word lowercase      | `id="about"`, `id="works"`                       |
| SCSS class (BEM structure) | `block__element--modifier` | `nav__container`, `nav__main-menu__link--active` |
| Tailwind utility           | as-is                      | `bg-indigo-600`, `dark:bg-slate-900`             |
| `ref` template attribute   | `camelCase`                | `ref="target"`, `ref="hamburgerRef"`             |

---

## CSS / SCSS Naming (BEM)

BEM is used only for structural SCSS classes (nav, layout). Tailwind handles everything else.

```
.block {}              // component root: .nav, .card
.block__element {}     // child:           .nav__container, .nav__main-menu
.block--modifier {}    // state/variant:   .nav__main-menu__link--active
```

Global utility classes (non-BEM) use plain descriptive names:

```
.section-spacing
.section-header
.section-label
.section-title
.section-subtitle
.container
.typed-cursor
```

---

## Event & Method Naming

| Type                | Convention                      | Example                                     |
| ------------------- | ------------------------------- | ------------------------------------------- |
| DOM event handler   | `on{Event}` or `handle{Action}` | `onHeroImageLoad`, `handleSubmit`           |
| Toggle methods      | `toggle{State}`                 | `toggleMenu()`, `toggleDark()`              |
| Close methods       | `close{Target}`                 | `closeMenu()`                               |
| Mark/set methods    | `mark{State}` / `set{State}`    | `markHeroImageReady()`, `setLoadingState()` |
| Analytics methods   | `track{Action}`                 | `trackCardClick()`, `trackContactSubmit()`  |
| Async form handlers | `send{Resource}`                | `sendEmail()`                               |

---

## File Naming Anti-Patterns

❌ `mycomponent.vue` — not PascalCase  
❌ `Component.vue` — no prefix  
❌ `ContactSection.vue` — wrong prefix (should be `AContact.vue`)  
❌ `card.vue` — not PascalCase, no prefix  
❌ `usecontactform.ts` — not camelCase  
❌ `ContactStore.ts` — stores should be `contact.ts` (used via `useContactStore` from Pinia)
