# Blog V2 — Remaining Work & Enhancement Roadmap

> This document tracks everything still missing from the Blog Module spec plus
> useful enhancements identified during V1 development.
> Work through items in **priority order** (🔴 → 🟡 → 🟢 → ✨).
> Mark each item `✅` when shipped.

---

## Status Key

| Symbol | Meaning     |
| ------ | ----------- |
| ☐      | Not started |
| 🔄     | In progress |
| ✅     | Done        |

---

## 🔴 HIGH PRIORITY — Security & Correctness

### 1. Firestore Security Rules

**Status:** ✅ Done  
**File to edit:** Firebase Console → Firestore → Rules  
**Spec ref:** `Blog.md §13`

Without these rules any anonymous user can write to `blogPosts`.

**Rules to deploy:**

```firestore
match /blogPosts/{postId} {
  // Public can read published posts only
  allow read: if resource.data.isPublished == true;
  // Only authenticated admin can write
  allow write: if request.auth != null;

  match /content/{contentId} {
    allow read: if get(/databases/$(database)/documents/blogPosts/$(postId)).data.isPublished == true;
    allow write: if request.auth != null;
  }
}
```

**Steps:**

1. Open Firebase Console → Firestore Database → Rules tab
2. Paste the rules above inside the existing `match /databases/{database}/documents { }` block
3. Click **Publish**
4. Test: confirm unauthenticated browser cannot `setDoc` directly

---

## 🟡 MEDIUM PRIORITY — Completing Phase 6 (Search/Filter/Pagination)

### 2. Tag Filter

**Status:** ✅ Done  
**File:** `src/views/BlogListView.vue`  
**Spec ref:** `Blog.md §8 Phase 6`

Category filter is done. Tags need the same treatment.

**Plan:**

- Add `activeTag = ref<string | null>(null)` alongside `activeCategory`
- Compute `allTags` — flat unique list from all `post.tags[]`
- Add a second filter row in the search card: "Tags" label + tag pills
- Update `filteredPosts` computed to also filter by `activeTag`
- Include `activeTag` in `isFiltering` and `clearFilters()`

---

### 3. Pagination

**Status:** ✅ Done (implemented as infinite / virtual scroll)  
**Files:**

- `src/views/BlogListView.vue` — add page state + paginatedPosts computed
- `src/components/blog/AbPagination.vue` — create pagination component

**Spec ref:** `Blog.md §8 Phase 6`

**Plan:**

- `PAGE_SIZE = 6` constant
- `currentPage = ref(1)` — reset to 1 whenever filter/search changes (watcher)
- `paginatedPosts = computed(() => filteredPosts.value.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE))`
- `totalPages = computed(() => Math.ceil(filteredPosts.value.length / PAGE_SIZE))`
- Create `AbPagination.vue` — Prev / page numbers / Next buttons; disable Prev on page 1, Next on last page

---

### 4. URL Query Params for Filters

**Status:** ✅ Done  
**File:** `src/views/BlogListView.vue`

Makes filters shareable and survive page refresh.

**Plan:**

- Import `useRoute`, `useRouter`
- On mount: read `route.query.category`, `route.query.tag`, `route.query.q`, `route.query.page` → seed refs
- Watch each filter ref → push updated query to router (`router.replace({ query: { ... } })`)
- Example URL: `/blog?category=Vue&q=nitro&page=2`

---

### 5. GA4 Analytics Events

**Status:** ✅ Done  
**Files:**

- `src/composables/useBlogAnalytics.ts` — create
- `src/views/BlogListView.vue` — call `trackBlogListView()` on mount
- `src/views/BlogPostView.vue` — call `trackBlogPostView()` on mount
- `src/views/BlogListView.vue` — call `trackFilterApplied()` when filter changes

**Spec ref:** `Blog.md §10`

| Event                 | Trigger               | Parameters                                                  |
| --------------------- | --------------------- | ----------------------------------------------------------- |
| `blog_list_view`      | `/blog` mounted       | —                                                           |
| `blog_post_view`      | `/blog/:slug` mounted | `post_slug`, `post_title`, `category`                       |
| `blog_filter_applied` | filter/search changes | `filter_type` (`category`\|`tag`\|`search`), `filter_value` |

**Pattern to follow:** check how `vue-gtag` is set up in `src/main.ts` and follow the same `useGtag()` composable pattern.

---

## 🟢 LOWER PRIORITY — V2 Improvements

### 6. SSG Slug Pre-rendering (Phase 7)

**Status:** ☐ Not started  
**File:** `vite.config.js`  
**Spec ref:** `Blog.md §8 Phase 7`

Makes `/blog/:slug` fully rendered at build time → better SEO.

**Plan:**

```ts
// vite.config.js — inside ssgOptions
async includedRoutes(paths) {
  const { getDb } = await import('./src/firebase')
  const { getDocs, collection, query, where } = await import('firebase/firestore')
  const db = getDb()
  const snap = await getDocs(
    query(collection(db, 'blogPosts'), where('isPublished', '==', true))
  )
  const slugRoutes = snap.docs.map(d => `/blog/${d.data().slug}`)
  return [...paths, ...slugRoutes]
}
```

**Note:** Run `npm run build` after adding to verify no SSR import errors.

---

### 7. Draft Preview Route

**Status:** ☐ Not started  
**Files:**

- `src/views/admin/AdminBlogPreview.vue` — create (reuse `BlogPostView` layout, fetch by ID not slug)
- `src/router/index.ts` — add `/admin/blog/:id/preview` route with `requiresAuth: true`
- `src/views/admin/AdminBlogEditor.vue` — add "Preview" button linking to the route

**Note:** Preview should show a "DRAFT — NOT PUBLISHED" banner at the top.

---

## ✨ POLISH / NICE TO HAVE

### 8. Share Buttons on Post Page

**Status:** ☐ Not started  
**File:** `src/views/BlogPostView.vue`

Copy link + Twitter/X + LinkedIn share buttons below post title or at end of post.

**Plan:**

- Copy link: `navigator.clipboard.writeText(window.location.href)` with ✓ flash
- Twitter: `https://twitter.com/intent/tweet?url={url}&text={title}`
- LinkedIn: `https://linkedin.com/sharing/share-offsite/?url={url}`
- Style: small icon-only buttons with tooltip, consistent with existing icon style

---

### 9. Related Posts Section

**Status:** ☐ Not started  
**File:** `src/views/BlogPostView.vue`

Show 2–3 posts with the same category at the bottom of a post.

**Plan:**

- After post loads, filter `blogStore.posts` by same `category`, exclude current post, take first 3
- Render as a small horizontal card row using `AbBlogCard` (compact variant)
- Heading: "More in {{category}}"
- Guard: only show if `blogStore.posts` is loaded (load list in parallel or reuse)

---

### 10. Reading Progress Bar

**Status:** ☐ Not started  
**File:** `src/views/BlogPostView.vue` (or a new `AbReadingProgress.vue`)

Thin indigo bar fixed at top of viewport that fills as the reader scrolls.

**Plan:**

- `scrollProgress = ref(0)` — updated on `window.scroll` event
- `scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight)`
- `<div class="fixed top-0 left-0 h-1 bg-indigo-500 z-50 transition-none" :style="{ width: scrollProgress + '%' }" />`
- Add/remove listener in `onMounted`/`onUnmounted`

---

### 11. Back to Top Button

**Status:** ☐ Not started  
**File:** `src/views/BlogPostView.vue`

Floating button that appears after scrolling 400px, smooth-scrolls back to top.

**Plan:**

- `showBackToTop = ref(false)` — set true when `scrollY > 400`
- `<Transition name="fade">` wrapping a fixed bottom-right button
- Click → `window.scrollTo({ top: 0, behavior: 'smooth' })`

---

### 12. RSS Feed

**Status:** ☐ Not started  
**Spec ref:** `Blog.md §11`

Generated at build time. Deferred to after Phase 7 (SSG slugs) is working.

**Plan:**

- Add a `generate-rss.ts` script that fetches published posts and writes `public/rss.xml`
- Run as a `prebuild` npm script
- Add `<link rel="alternate" type="application/rss+xml">` in `index.html`

---

## Completion Checklist (before closing V2)

- [ ] Firestore security rules deployed and tested
- [ ] Tag filter working
- [ ] Pagination working with URL params
- [ ] GA4 events firing (verify in GA4 DebugView)
- [ ] SSG pre-rendering of slugs in production build
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] All items above tested on mobile (375px) and in dark mode
