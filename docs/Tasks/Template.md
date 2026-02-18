# Task Template

> **Read this before starting any new task.** Copy this template to `docs/Tasks/FeatureSpecific/{FeatureName}.md` and fill it in.

---

## Pre-Task Checklist

Before writing a single line of code:

- [ ] Read the relevant section in `docs/DesignSystem/Components.md`
- [ ] Check color tokens in `docs/StyleGuide/Colors.md`
- [ ] Check spacing rules in `docs/StyleGuide/Spacing.md`
- [ ] Verify naming convention in `docs/Architecture/NamingConventions.md`
- [ ] Check if a reusable component already exists in `docs/Components/BaseComponents.md`
- [ ] Confirm the folder where the new file belongs: `docs/Architecture/FolderStructure.md`
- [ ] If adding an external API: follow `docs/Architecture/APIIntegrationGuide.md`

---

## Task Definition

```
Feature Name:
Type: [ ] New Section  [ ] New Component  [ ] Enhancement  [ ] Bug Fix  [ ] Refactor
Status: [ ] Not Started  [ ] In Progress  [ ] Done
Date:
```

### What is the task?

_Short plain-English description._

### What is the expected output?

_What will the user see or experience after this task is done?_

### What files will be touched?

_List every file you expect to create or modify._

---

## Design Decisions

### Background color

- [ ] Uses `.section-spacing` and `.section-header`
- [ ] Background: `bg-white dark:bg-slate-900` or `bg-gray-50 dark:bg-slate-900`
- [ ] Follows alternating section background sequence (see `docs/DesignSystem/Layouts.md`)

### Typography

- [ ] Section uses `<h2>` with `.section-title` (not `h1`, not custom font sizes)
- [ ] Section label uses `.section-label`
- [ ] Body copy uses `text-gray-600 dark:text-gray-400 leading-relaxed`

### Components used

_List all A* and Ab* components involved. Add new ones if needed — document them._

### State management

- [ ] No global state needed → use local `ref` / `reactive`
- [ ] Cross-component coordination needed → create or extend a composable
- [ ] Feature-level state (persisted or complex) → create a Pinia store in `src/stores/`

### Analytics

- [ ] No new events needed
- [ ] New GA4 event needed → add to `src/composables/useAnalytics.ts`

---

## Implementation Steps

1.
2.
3.
4.
5.

---

## Post-Task Checklist

- [ ] All Tailwind dark mode variants are present (`dark:bg-*`, `dark:text-*`, `dark:border-*`)
- [ ] All external links have `rel="noopener noreferrer"`
- [ ] All images have `alt` attributes
- [ ] All interactive elements have `focus:outline-none focus:ring-2 focus:ring-indigo-500`
- [ ] New `A*` section has `id="{name}"` on root element and is added to nav
- [ ] New `Ab*` component is documented in `docs/Components/BaseComponents.md`
- [ ] New data file in `src/data/` has an exported TypeScript interface
- [ ] New env var is added to `.env.example` and `src/env.d.ts`
- [ ] `vue-tsc --noEmit` passes with no errors: `npm run type-check`
- [ ] Visual check in both light and dark mode
- [ ] Visual check on mobile (< 480px) and desktop (> 1280px)
- [ ] This task doc is updated with final status

---

## Notes / Known Issues

_Any decisions made, trade-offs, or follow-up items._
