# Admin Dashboard — CMS Portal

> **Type:** New Feature (Major)  
> **Status:** Phase 2 — Seed Data + Firestore Reads  
> **Date:** February 2026  
> **Author:** Abanoub George  
> **Last Updated:** February 18, 2026

---

## Changelog

| Date         | Phase    | What Changed                                                                                                                                 |
| ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Feb 18, 2026 | Planning | Initial spec written, all packages researched, Firebase config provided                                                                      |
| Feb 18, 2026 | Phase 1  | ✅ COMPLETE — firebase installed, src/firebase.ts, auth store, router guards, AdminLogin, AdminLayout, AdminDashboard shell, firestore.rules |

---

## 1. Understanding Summary

We are building a **private CMS portal** at `/admin` that gives the portfolio owner full control over all visible website content without touching the codebase.

**Key principle:** The public portfolio becomes a **read-only renderer** of data stored in Firestore. The admin dashboard is the **write layer**.

**Current architecture → Target architecture:**

```
BEFORE (static):
  src/data/works.ts        ← hardcoded TypeScript arrays
  src/components/base/**   ← hardcoded content in templates

AFTER (dynamic):
  Firestore /sections      ← source of truth for all content
  Admin Dashboard          ← writes to Firestore
  Public Portfolio         ← reads from Firestore, renders dynamically
```

---

## 2. Proposed Firestore Schema

### Collection: `sections`

One document per portfolio section. Each document is self-contained.

```
sections/
  {sectionId}               ← e.g. "hero", "about", "works"
    id:          string      ← matches document ID
    type:        SectionType ← 'hero' | 'about' | 'services' | 'skills' | 'works' | 'testimonials' | 'contact'
    order:       number      ← integer, 0-based, no duplicates enforced by write rules
    isActive:    boolean     ← false = hidden on public site
    createdAt:   Timestamp
    updatedAt:   Timestamp
    content:     {}          ← structured object, shape varies by type (see below)
```

**Typed content shapes per section:**

```ts
// hero
content: {
  name: string
  title: string           // "Senior Frontend Engineer"
  roles: string[]         // ['Developer', 'Engineer', 'Designer', 'Freelancer']
  bio: string
  photoBase64: string     // compressed Base64 — see Section 3
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
}

// about
content: {
  bio: string[]           // array of paragraphs
  stats: { value: string; label: string }[]
  stack: string[]
  phone: string
  email: string
  github: string
  linkedin: string
}

// services
content: {
  items: {
    icon: string
    title: string
    description: string
    tags: string[]
  }[]
}

// skills
content: {
  categories: {
    title: string
    icon: string
    iconBg: string
    barColor: string
    skills: { label: string; level: number }[]
  }[]
  extras: string[]
}

// works
content: {
  items: {
    id: string
    title: string
    link: string
    tag: string
    imageBase64: string   // compressed Base64
  }[]
}

// testimonials
content: {
  items: {
    id: string
    name: string
    role: string
    company: string
    quote: string
    avatarColor: string   // e.g. 'indigo' | 'teal' | 'purple'
  }[]
}

// contact
content: {
  heading: string
  subheading: string
  email: string
  phone: string
  linkedin: string
}
```

---

### Collection: `settings`

```
settings/
  seo
    title:       string
    description: string
    keywords:    string
    ogImageBase64: string
    updatedAt:   Timestamp

  layout
    sectionOrder: string[]   // ordered array of section IDs — source of truth for order
    updatedAt:   Timestamp
```

> **Why a separate `layout/sectionOrder`?** Drag & drop writes only one document instead of updating `order` on every affected section document. This reduces write operations and guarantees atomicity.

---

### Collection: `blogPosts` (future — schema ready)

```
blogPosts/
  {postId}
    id:            string
    title:         string
    slug:          string      ← URL-safe, unique
    content:       string      ← markdown or HTML string
    coverBase64:   string
    isPublished:   boolean
    publishDate:   Timestamp | null
    createdAt:     Timestamp
    updatedAt:     Timestamp
    tags:          string[]
    excerpt:       string
```

---

### Firestore Security Rules (skeleton)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public: read-only for sections and settings
    match /sections/{sectionId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'YOUR_ADMIN_UID';
    }

    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'YOUR_ADMIN_UID';
    }

    // Blog posts: published only visible to public
    match /blogPosts/{postId} {
      allow read: if resource.data.isPublished == true
                  || (request.auth != null && request.auth.uid == 'YOUR_ADMIN_UID');
      allow write: if request.auth != null && request.auth.uid == 'YOUR_ADMIN_UID';
    }
  }
}
```

---

## 3. Base64 Storage — Risks & Mitigation

### Risks

| Risk                             | Detail                                                                                                               |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Firestore 1MB document limit** | Base64 increases binary size by ~33%. A 600KB image becomes ~800KB Base64 — nearly the entire document budget.       |
| **Multiple images per document** | `works` section has 11 project screenshots. Even at 50KB each, that's 550KB+ in one document.                        |
| **Read cost**                    | Every public page load fetches the entire section document including all Base64 strings — even if only text changed. |
| **Slow initial load**            | Large Base64 strings are transferred over the network and decoded by the browser on every visit.                     |
| **No CDN caching**               | Unlike Firebase Storage URLs, Base64 stored in Firestore cannot be cached at a CDN edge.                             |

### Mitigation Strategy

**Rule: All images must be compressed to ≤ 100KB before Base64 encoding.**

Use [`browser-image-compression`](https://github.com/Donaldcwl/browser-image-compression) in the admin upload handler:

```ts
import imageCompression from "browser-image-compression";

async function compressToBase64(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.08, // 80KB target
    maxWidthOrHeight: 800, // portfolio thumbnails don't need more
    useWebWorker: true,
  });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(compressed);
  });
}
```

**For the `works` section (many images):** Split each project into its own sub-document:

```
sections/works/items/{projectId}    ← sub-collection
  id, title, link, tag, imageBase64
```

This prevents the parent `works` document from exceeding 1MB and allows paginated reads.

---

## 4. Performance Optimizations

| Strategy                           | Implementation                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Lazy load section data**         | Public site fetches section data only when the section enters the viewport (integrate with `useIntersectionObserver`) |
| **Cache Firestore reads**          | Use `onSnapshot` with Firestore's offline persistence enabled — repeat visits use local cache                         |
| **Separate data from images**      | Store text content and image Base64 in different documents or sub-collections                                         |
| **Skeleton screens already exist** | `AbCardSkeleton` and `AbAnimatedPlaceholder` — extend this pattern to all dynamically loaded sections                 |
| **Pinia as cache layer**           | Fetch each section once, store in Pinia. Subsequent renders read from store.                                          |
| **`enableIndexedDbPersistence`**   | Enable Firestore offline cache in `main.ts` — zero-cost repeat reads                                                  |

---

## 5. State Management — Drag & Drop

### Recommended Library

Use [`vuedraggable` (vue.draggable.next)](https://github.com/SortableJS/vue.draggable.next) — Vue 3 wrapper for Sortable.js.

```bash
npm install vuedraggable@next
```

### Pattern

```ts
// src/stores/sections.ts  (Pinia)
import { defineStore } from "pinia";
import { ref } from "vue";
import { db } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export const useSectionsStore = defineStore("sections", () => {
  const sectionOrder = ref<string[]>([]);

  async function saveOrder(newOrder: string[]): Promise<void> {
    sectionOrder.value = newOrder;
    await updateDoc(doc(db, "settings", "layout"), {
      sectionOrder: newOrder,
      updatedAt: serverTimestamp(),
    });
  }

  return { sectionOrder, saveOrder };
});
```

```ts
// AdminDashboard.vue — drag & drop with @formkit/drag-and-drop
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { useSectionsStore } from "@/stores/sections";

const store = useSectionsStore();

const [listRef, orderedSections] = useDragAndDrop(store.sections, {
  onDragend: async () => {
    await store.saveOrder(orderedSections.value.map((s) => s.id));
  },
});
```

```html
<!-- No external component import needed — just bind ref to native <ul> -->
<ul ref="listRef">
  <AdminSectionRow
    v-for="section in orderedSections"
    :key="section.id"
    :section="section"
  />
</ul>
```

```html
<!-- Admin drag & drop list -->
<ul ref="listRef">
  <li v-for="section in sections" :key="section.id">
    <span class="drag-handle cursor-grab">⠿</span>
    {{ section.type }}
  </li>
</ul>
```

```ts
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const [listRef, sections] = useDragAndDrop(initialSections, {
  onDragend: async () => {
    await sectionsStore.saveOrder(sections.value.map((s) => s.id));
  },
});
```

### Public site reads order

```ts
// In HomeView.vue — render sections sorted by sectionOrder from settings/layout, filtered to active only
const orderedSections = computed(() =>
  [...sections.value]
    .filter((s) => s.isActive)
    .sort(
      (a, b) =>
        sectionOrder.value.indexOf(a.id) - sectionOrder.value.indexOf(b.id),
    ),
);
```

---

## 6. Clarification Questions (answered upfront)

| #   | Question                                                        | Decision                                                                                                         |
| --- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Single admin UID or email/password auth?                        | **Email/password Firebase Auth** — hardcode the admin UID in Firestore rules                                     |
| 2   | Should disabled sections hide completely or show a placeholder? | **Hide completely** — `isActive: false` sections are not rendered at all on the public site                      |
| 3   | Real-time sync (`onSnapshot`) or manual refresh?                | **Real-time** — use `onSnapshot` so the public site updates immediately after admin saves                        |
| 4   | Rich text editor for bio/descriptions?                          | **Phase 2+** — Start with `<textarea>` (plain text + newlines), add a rich text editor (Tiptap) in a later phase |
| 5   | `/admin` route — same Vue app or separate app?                  | **Same Vue app** — add `/admin` as a new route with a navigation guard. Simpler deployment.                      |
| 6   | Seed strategy — how to migrate current static data?             | **One-time seed script** — run it once to push current data to Firestore, then source of truth is Firestore      |

---

## 7. Implementation Phases

---

### Phase 1 — Firebase Foundation _(~1 day)_

**Goal:** Firebase connected, admin can log in, Firestore rules in place.

**Steps:**

- [x] `npm install firebase`
- [x] Create `src/firebase.ts` — initialize app, auth, firestore
- [x] Add env vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc. to `.env` and `.env.example`
- [x] Add all Firebase vars to `src/env.d.ts`
- [x] Create `src/stores/auth.ts` (Pinia) — `user`, `signIn()`, `signOut()`, `isAdmin` computed
- [x] Create `src/router/index.ts` guard — redirect `/admin/**` to `/admin/login` if not authenticated
- [x] Create `src/views/admin/AdminLogin.vue` — email/password form using `signInWithEmailAndPassword`
- [x] Create `src/views/admin/AdminLayout.vue` — shell with sidebar + outlet
- [x] Add routes to `src/router/index.ts`:
  ```
  /admin/login  → AdminLogin
  /admin        → AdminLayout (auth-guarded)
    /admin      → AdminDashboard (index child)
  ```
- [x] Write `firestore.rules` file (admin-only write, public read)
- [x] **TODO YOU:** Copy rules from `firestore.rules` → paste into Firebase console → Firestore → Rules → Publish. Replace `REPLACE_WITH_YOUR_ADMIN_UID` with your real UID first.
- [ ] **TODO YOU:** Verify login works at `http://localhost:5173/admin/login`

---

### Phase 2 — Seed Data + Public Site Reads Firestore _(~1–2 days)_

**Goal:** Public portfolio renders from Firestore instead of static files. Current content is preserved.

**Steps:**

- [ ] Create `src/stores/sections.ts` (Pinia) — `sections`, `sectionOrder`, `fetchAll()`, `fetchOne(id)`
- [ ] Enable Firestore offline persistence in `src/firebase.ts`
- [ ] Create `scripts/seed.ts` — one-time script that pushes current static content into Firestore
  - Reads from `src/data/works.ts` + inline data from each component
  - Writes all 7 section documents to `sections/` collection
  - Writes `settings/layout` with initial `sectionOrder`
- [ ] Run seed: `npx tsx scripts/seed.ts`
- [ ] Update `HomeView.vue`:
  - Fetch `settings/layout` for `sectionOrder`
  - Fetch all `sections` with `onSnapshot`
  - Render sections dynamically, sorted by `sectionOrder`, filtered by `isActive: true`
- [ ] Replace hardcoded data in each section component with props from Firestore
- [ ] Update `useGlobalLoading` to wait for Firestore data instead of hero image only
- [ ] Verify: public site looks identical to before, but data comes from Firestore

---

### Phase 3 — Admin Dashboard Shell + Section List _(~1 day)_

**Goal:** Admin can see all sections, toggle visibility, see current order.

**Steps:**

- [ ] Create `src/views/admin/AdminDashboard.vue`
  - List of all sections from Firestore (sorted by `sectionOrder`)
  - Each row: section type, order badge, isActive toggle, "Edit" button
- [ ] Create `src/composables/admin/useAdminSections.ts` — CRUD methods: `updateSection()`, `toggleActive()`
- [ ] isActive toggle: optimistic UI update + Firestore write
- [ ] Create `src/components/admin/` folder for admin-specific components
- [ ] Create `src/components/admin/AdminSectionRow.vue` — single row component
- [ ] Verify: toggling a section hides/shows it on the public site in real time

---

### Phase 4 — Drag & Drop Ordering _(~1 day)_

**Goal:** Admin can reorder sections visually and persist the order.

**Steps:**

- [ ] `npm install @formkit/drag-and-drop` ← NOT vuedraggable (abandoned)
- [ ] Add `useDragAndDrop` composable to `AdminDashboard.vue` — bind `listRef` to `<ul>`
- [ ] `onDragend` callback fires `sectionsStore.saveOrder(newOrder)` → writes to `settings/layout`
- [ ] Add drag handle icon (`.cursor-grab`) to `AdminSectionRow.vue`
- [ ] Public `HomeView.vue` already reads `sectionOrder` — verify reorder reflects immediately
- [ ] Add optimistic UI: reorder is instant in UI, Firestore write is async
- [ ] Verify: drag, release, refresh public site — new order persists

---

### Phase 5 — Content Editors Per Section _(~2–3 days)_

**Goal:** Admin can edit text content of each section and save to Firestore.

**Steps (per section type):**

- [ ] Create `src/views/admin/editors/` folder
- [ ] Create `AdminAboutEditor.vue` — edit bio paragraphs, stats, stack chips
- [ ] Create `AdminServicesEditor.vue` — add/remove/edit service cards
- [ ] Create `AdminSkillsEditor.vue` — edit skill levels via sliders
- [ ] Create `AdminWorksEditor.vue` — add/remove/reorder projects
- [ ] Create `AdminTestimonialsEditor.vue` — add/remove/edit testimonials
- [ ] Create `AdminContactEditor.vue` — edit contact details
- [ ] Create `AdminHeroEditor.vue` — edit name, title, roles, bio
- [ ] Route: `/admin/section/:id` → resolves to correct editor component
- [ ] All editors: "Save" button → `updateDoc(doc(db, 'sections', id), { content: ..., updatedAt: now })`
- [ ] Add unsaved changes warning (browser `beforeunload` + Vue router guard)

---

### Phase 6 — Image Upload with Base64 Compression _(~1 day)_

**Goal:** Admin can upload images; they are compressed and stored as Base64 in Firestore.

**Steps:**

- [ ] `npm install browser-image-compression`
- [ ] Create `src/composables/admin/useImageUpload.ts`
  - Accepts `File` input
  - Compresses to ≤ 80KB, max 800px
  - Returns Base64 string
  - Exposes `isCompressing`, `error`
- [ ] Create `src/components/admin/AdminImageUpload.vue`
  - File `<input>` + drag-drop zone
  - Preview of compressed result + file size display
  - "Too large" warning if compressed size > 900KB
- [ ] Add to: `AdminHeroEditor` (profile photo), `AdminWorksEditor` (project screenshots)
- [ ] For `works` images: store each project in `sections/works/items/{id}` sub-collection
- [ ] Verify: upload 1MB image → compressed to < 80KB → visible on public site

---

### Phase 7 — Polish & Security Hardening _(~0.5 day)_

**Goal:** Production-ready admin.

**Steps:**

- [ ] Firestore rules: replace `YOUR_ADMIN_UID` with real UID
- [ ] Add `signOut` button to admin layout
- [ ] Handle Firestore errors gracefully — show error toast in admin
- [ ] Add loading skeletons to admin editor views
- [ ] Rate limiting: add client-side save debounce (500ms) to prevent spam writes
- [ ] Add `CHANGELOG` entry for this feature
- [ ] Update `docs/Architecture/FolderStructure.md` with new admin folders

---

### Phase 8 — Blog Module _(future, not now)_

Schema is already designed in Section 2. When ready:

- [ ] Create `src/views/admin/AdminBlogList.vue`
- [ ] Create `src/views/admin/AdminBlogEditor.vue` with Tiptap rich text editor
- [ ] Add public `/blog` and `/blog/:slug` routes
- [ ] Firestore `blogPosts` collection already waiting

---

## 8. New Folder Structure (After Implementation)

```
src/
├── firebase.ts                        ← Firebase app, auth, db exports
├── stores/
│   ├── auth.ts                        ← user, signIn, signOut, isAdmin
│   ├── sections.ts                    ← sections[], sectionOrder, fetchAll, saveOrder
│   └── settings.ts                    ← global SEO settings
├── composables/
│   └── admin/
│       ├── useAdminSections.ts        ← updateSection, toggleActive, deleteSection
│       └── useImageUpload.ts          ← compress + base64 encode
├── components/
│   ├── base/                          ← unchanged (now data-driven via props)
│   ├── utils/                         ← unchanged
│   └── admin/
│       ├── AdminSectionRow.vue
│       ├── AdminImageUpload.vue
│       └── AdminNav.vue
├── views/
│   ├── HomeView.vue                   ← reads Firestore via sectionsStore
│   └── admin/
│       ├── AdminLogin.vue
│       ├── AdminLayout.vue
│       ├── AdminDashboard.vue
│       └── editors/
│           ├── AdminHeroEditor.vue
│           ├── AdminAboutEditor.vue
│           ├── AdminServicesEditor.vue
│           ├── AdminSkillsEditor.vue
│           ├── AdminWorksEditor.vue
│           ├── AdminTestimonialsEditor.vue
│           └── AdminContactEditor.vue
├── router/
│   └── index.ts                       ← add /admin routes + auth guard
└── scripts/
    └── seed.ts                        ← one-time Firestore seed script
```

---

## 9. Package Research & Decisions

### 9.1 Firebase SDK

**Decision: Use `firebase` v10+ (Modular Tree-Shakeable API)**

Firebase has two API styles:

- **Namespaced (v8):** `firebase.firestore().collection(...)` — legacy, larger bundle
- **Modular (v9+):** `import { collection, getDocs } from 'firebase/firestore'` — tree-shakeable, recommended

> ✅ Always use modular API. Only import what you need — critical for bundle size.

**Firebase config (store raw values in `.env`, never commit):**

```ts
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

**Key facts from Firebase docs:**

- `onSnapshot` fires immediately from local IndexedDB cache → fast perceived load
- Always call the returned `unsubscribe()` in `onUnmounted()` — memory leak if you don't
- Avoid monotonically increasing document IDs (hotspots) — use semantic IDs like `'hero'`, `'about'`
- Index-exempt large Base64 string fields — they'll never be queried, and indexing them wastes write quota

---

### 9.2 Drag & Drop Library

**Research result:**

| Package                  | Downloads/wk | Last Release | Vue 3 | Verdict                                            |
| ------------------------ | ------------ | ------------ | ----- | -------------------------------------------------- |
| `vuedraggable@next`      | ~1M          | **Nov 2020** | ✅    | ❌ **Abandoned** — 181 open issues, no maintenance |
| `@formkit/drag-and-drop` | 93k          | **Apr 2025** | ✅    | ✅ **Use this**                                    |

**Decision: `@formkit/drag-and-drop`**

- Actively maintained (Apr 2025), framework-agnostic, TypeScript-first, only **4kb gzipped**
- Composable API matches `<script setup>` perfectly
- `vuedraggable@next` works but is abandoned — avoid for new projects

**Usage:**

```ts
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";

const [listRef, sections] = useDragAndDrop(initialSections, {
  onDragend: async () => {
    await saveOrder(sections.value.map((s) => s.id));
  },
});
```

```html
<ul ref="listRef">
  <li v-for="section in sections" :key="section.id">
    <span class="handle">⠿</span> {{ section.type }}
  </li>
</ul>
```

---

### 9.3 Image Compression

**Decision: `browser-image-compression` (confirmed correct)**

- 1.6k stars, used by 20k+ projects, v2.0.2 released 2023 (stable, not abandoned)
- TypeScript types included, works with Vite/Rollup out of the box
- `useWebWorker: true` → non-blocking compression in background thread
- Built-in `imageCompression.getDataUrlFromFile()` → returns Base64 directly, no manual `FileReader`
- `signal: AbortController.signal` → cancellable upload

**Correct usage:**

```ts
import imageCompression from "browser-image-compression";

async function compressToBase64(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.08, // 80KB hard limit before Base64 overhead
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: "image/webp", // webp saves ~30% over jpeg at same quality
    initialQuality: 0.8,
  });
  return imageCompression.getDataUrlFromFile(compressed); // built-in — no FileReader needed
}
```

---

### 9.4 Firebase Auth — Correct Vue 3 Pattern

```ts
// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isReady = ref(false); // ← true once Firebase has restored session

  // Single source of truth — must run once at app startup
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    isReady.value = true;
  });

  const isAdmin = computed(() => user.value !== null);

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    // user.value is set automatically by onAuthStateChanged above
  }

  async function signOut() {
    await fbSignOut(auth);
  }

  return { user, isAdmin, isReady, signIn, signOut };
});
```

> ⚠️ **Edge Case — Router Guard Race Condition:** The guard runs before `onAuthStateChanged`
> fires on page refresh. Without the `isReady` wait, every refresh redirects to `/admin/login`.

```ts
// src/router/index.ts — race-condition-safe guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isReady) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => authStore.isReady,
        (ready) => {
          if (ready) {
            stop();
            resolve();
          }
        },
        { immediate: true },
      );
    });
  }

  if (to.meta.requiresAuth && !authStore.isAdmin) {
    return "/admin/login";
  }
  if (to.path === "/admin/login" && authStore.isAdmin) {
    return "/admin"; // already logged in → redirect away from login page
  }
});
```

---

### 9.5 Firestore Real-Time Listener — Correct Cleanup Pattern

```ts
// src/composables/useSections.ts
import { ref, onUnmounted } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import type { Section } from "@/types";

export function useSections() {
  const sections = ref<Section[]>([]);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const unsubscribe = onSnapshot(
    collection(db, "sections"),
    (snapshot) => {
      sections.value = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Section[];
      isLoading.value = false;
    },
    (err) => {
      error.value = err;
      isLoading.value = false;
    },
  );

  // ✅ Critical: detach listener to stop paying for reads and prevent leaks
  onUnmounted(() => unsubscribe());

  return { sections, isLoading, error };
}
```

---

## 10. New Dependencies

| Package                     | Install Command                         | Purpose                                       | Phase   |
| --------------------------- | --------------------------------------- | --------------------------------------------- | ------- |
| `firebase`                  | `npm install firebase`                  | Firestore + Auth SDK                          | Phase 1 |
| `@formkit/drag-and-drop`    | `npm install @formkit/drag-and-drop`    | Drag & drop (replaces abandoned vuedraggable) | Phase 4 |
| `browser-image-compression` | `npm install browser-image-compression` | Client-side image compression before Base64   | Phase 6 |
| `@tiptap/vue-3` (future)    | `npm install @tiptap/vue-3`             | Rich text editor for blog                     | Phase 8 |

> ❌ **Do NOT install `vuedraggable@next`** — abandoned since 2020.

---

## 11. Pre-Phase-1 Checklist

- [x] Firebase project created (`portfolio-e2de2`)
- [x] Firebase config object received from Firebase console
- [ ] Confirm Firestore is in **Native mode** (not Datastore mode) in console
- [ ] Confirm **Email/Password** auth provider is enabled in Firebase console → Authentication → Sign-in method
- [ ] Create admin user in Firebase Auth console (Authentication → Users → Add user) → copy the **UID**
- [ ] Add raw Firebase config values to `.env` (gitignored) using keys below
- [ ] Add key names (no values) to `.env.example`
- [ ] Add Firebase env var types to `src/env.d.ts`

**`.env` values to add:**

```
VITE_FIREBASE_API_KEY=REDACTED_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=portfolio-e2de2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=portfolio-e2de2
VITE_FIREBASE_STORAGE_BUCKET=portfolio-e2de2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=528879312235
VITE_FIREBASE_APP_ID=REDACTED_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=G-0JZ047YX05
```

> ⚠️ Note: `measurementId` in Firebase config is **different** from your GA4 `VITE_GA_MEASUREMENT_ID`. They are separate tracking IDs — keep both.
