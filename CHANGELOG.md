# Changelog

All notable changes to this project are documented here.  
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — Admin CMS Dashboard

### Added — Phase 1: Firebase Foundation

- `src/firebase.ts` — Firebase app, Firestore (persistentLocalCache), Auth exports
- `src/stores/auth.ts` — Pinia auth store: `user`, `isAdmin`, `isReady`, `signIn()`, `signOut()`
- `src/views/admin/AdminLogin.vue` — email/password login form
- `src/views/admin/AdminLayout.vue` — collapsible sidebar shell with sign-out button
- `firestore.rules` — admin-only write, public read for sections + settings
- Router guards at `/admin/**` — redirect to login when unauthenticated; race-condition-safe via `isReady` watch

### Added — Phase 2: Services Layer + Firestore Seed

- `src/types/sections.ts` — `SectionType` union + all typed content interfaces
- `src/services/auth.service.ts` — Firebase Auth service wrapper
- `src/services/sections.service.ts` — Firestore CRUD: fetch, subscribe, upsert, patch, reorder
- `src/stores/sections.ts` — Pinia sections store with public/admin listeners, `byType<T>()`
- `scripts/seed.ts` — one-time seed script (tsx + dotenv); seeded `about`, `services`, `skills`, `works`
- Public site (`HomeView.vue`, base components) now reads live from Firestore via `sectionsStore`

### Added — Phase 3: Admin Dashboard Shell

- `src/views/admin/AdminDashboard.vue` — real-time section list with loading/error/empty states
- `src/components/admin/AdminSectionRow.vue` — row with type badge, order indicator, visibility toggle, edit button
- Optimistic toggle UI: `isActive` flips instantly, Firestore write is async

### Added — Phase 4: Drag & Drop Reorder

- Installed `@formkit/drag-and-drop` (replaces abandoned `vuedraggable@next`)
- `useDragAndDrop` wired in `AdminDashboard.vue` with `.drag-handle` anchor
- `onDragend` persists new order to Firestore via `store.reorder()`

### Added — Phase 5: Content Editors

- `src/views/admin/AdminSectionEdit.vue` — dynamic editor router (`editorMap` by section type)
- `src/views/admin/editors/AdminAboutEditor.vue` — bio paragraphs, stats, stack chips, contact fields
- `src/views/admin/editors/AdminServicesEditor.vue` — add/remove service cards with tag chips
- `src/views/admin/editors/AdminSkillsEditor.vue` — skill categories, level sliders, extras chips
- `src/views/admin/editors/AdminWorksEditor.vue` — project cards with image upload
- `src/views/admin/editors/AdminContactEditor.vue` — email, phone, github, linkedin fields
- All editors: save button with spinner → green checkmark feedback

### Added — Phase 6: Image Upload

- Installed `browser-image-compression`
- `src/composables/admin/useImageUpload.ts` — compresses to ≤80KB WebP (800px max) via Web Worker
- `src/components/admin/AdminImageUpload.vue` — drag-drop zone + click-to-browse, live preview, compressed size badge, replace/remove overlay

### Added — Phase 7: Polish & Security Hardening

- `src/composables/admin/useAdminToast.ts` — module-level singleton toast queue
- `src/components/admin/AdminToast.vue` — bottom-right toast stack (Teleport to body), animated, success/error/info
- Toast wired into all 5 editors — Firestore write errors surface as red toasts
- `scheduleSave()` 500ms debounce added to all editors
- `src/firebase.ts` — migrated from deprecated `enableIndexedDbPersistence()` to `initializeFirestore` + `persistentLocalCache({ tabManager: persistentMultipleTabManager() })`
- `src/main.ts` — `vue-gtag` plugin now guarded: skipped if `VITE_GA_MEASUREMENT_ID` is unset (fixes Vue plugin warning in dev)
- `AdminSectionEdit.vue` — starts its own `startAdminListener()` if store is empty (fixes blank editor on direct URL / refresh)
- All editors — `watch(source, ..., { immediate: true, once: true })` replaces bare watch to prevent Firestore snapshots from overwriting in-progress form edits
- `AdminSectionEdit.vue` — loading skeleton only shown when `isLoading && !section`; editor component stays mounted to protect `once` watcher state

### Fixed

- Firestore `failed-precondition` error on public site: compound `where + orderBy` query replaced with client-side filter in `subscribeActiveSections` — no composite index required
- Form reset on save: Firestore snapshot after write was triggering watch and wiping the user's edits — fixed with `{ once: true }` watcher
- `ReferenceError: Cannot access 'stopSourceWatch' before initialization` — temporal dead zone bug from calling `stopSourceWatch()` inside `{ immediate: true }` callback; replaced with Vue 3.4 `{ once: true }` option
- White body padding on admin routes — `padding-top: 72px` scoped to `.portfolio-body` class, not applied to admin layout
