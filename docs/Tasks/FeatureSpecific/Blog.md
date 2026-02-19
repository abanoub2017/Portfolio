# Blog Module

> **Type:** New Feature (Major)
> **Status:** Phase 5 — Complete
> **Date:** July 2025
> **Author:** Abanoub George
> **Last Updated:** February 19, 2026

---

## Changelog

| Date         | Phase    | What Changed                                                                                                                                                                                |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jul 2025     | Planning | Initial spec written, packages researched, architecture defined                                                                                                                             |
| Feb 19, 2026 | Phase 1  | ✅ COMPLETE — `src/types/blog.ts`, `src/services/blog.service.ts`, `src/stores/blog.ts` created                                                                                             |
| Feb 19, 2026 | Phase 2  | ✅ COMPLETE — `AdminBlogList.vue` created, `/admin/blog` route added, sidebar nav link added                                                                                                |
| Feb 19, 2026 | Phase 3  | ✅ COMPLETE — TipTap installed, `AdminBlogEditor.vue` created, `/admin/blog/new` + `/admin/blog/:id/edit` routes added                                                                      |
| Feb 19, 2026 | Phase 4  | ✅ COMPLETE — `AbBlogCard.vue`, `AbBlogCardSkeleton.vue`, `BlogListView.vue` created; `/blog` route + ANav Blog link added                                                                  |
| Feb 19, 2026 | Phase 5  | ✅ COMPLETE — `ProseMirrorNode` types added; `AbInlineContent.vue` render-fn; 10 `AbBlock*.vue` components; `AbPostReader.vue`; `BlogPostView.vue`; `/blog/:slug` (`blog-post`) route added |

---

## Pre-Task Checklist

- [x] Read `docs/DesignSystem/Components.md`
- [x] Read `docs/DesignSystem/Layouts.md`
- [x] Read `docs/Architecture/NamingConventions.md`
- [x] Read `docs/Architecture/FolderStructure.md`
- [x] Read `docs/Architecture/ComponentArchitecture.md`
- [x] Read `docs/Architecture/SSG.md`
- [x] Read `docs/Architecture/APIIntegrationGuide.md`
- [x] Read `docs/Tasks/FeatureSpecific/AdminDashboard.md`

---

## 1. Understanding Summary

We are building a **Blog Module** that consists of two parts:

1. **Admin side** — private TipTap-powered editor at `/admin/blog` to write, manage, and publish posts
2. **Public side** — reader-facing blog list at `/blog` and individual post pages at `/blog/:slug`

**Key principles (same as AdminDashboard):**

- Firestore is the source of truth
- Admin is the write layer
- Public portfolio is a read-only renderer
- No `v-html`. All content is rendered by a custom Vue component tree (never raw HTML injection)

---

## 2. Package Decisions

### Editor: TipTap v3

| Package                                 | Purpose                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| `@tiptap/vue-3`                         | Official Vue 3 wrapper, MIT                                                   |
| `@tiptap/starter-kit`                   | Bold, italic, headings, lists, blockquote, code, hardBreak — all in one       |
| `@tiptap/extension-image`               | Image insertion                                                               |
| `@tiptap/extension-link`                | Hyperlinks                                                                    |
| `@tiptap/extension-code-block-lowlight` | Code blocks with lowlight tokenizer                                           |
| `lowlight`                              | Required peer for code-block-lowlight (uses highlight.js grammar definitions) |

> **Why TipTap?** 494K weekly downloads, official Vue 3 package (`@tiptap/vue-3`), ProseMirror-based, fully headless (zero bundled CSS), MIT licensed. No paid tier required for all features used here.

> **Why not EditorJS?** EditorJS serialises to a custom JSON block format that requires a custom renderer on every platform. TipTap serialises to standard ProseMirror JSON _and_ HTML, and the JSON structure is well-documented and stable.

### Syntax highlighting: Shiki v3

| Package | Purpose                                                          |
| ------- | ---------------------------------------------------------------- |
| `shiki` | Zero-runtime syntax highlighter — uses VS Code TextMate grammars |

> **Why Shiki?** 4.7M weekly downloads, same Anthony Fu / Vite ecosystem, produces static HTML (no runtime JS on the public page), integrates with TipTap's code blocks via a custom `NodeView`.

> **Alternative (lowlight-only):** For v1, `lowlight` inside `@tiptap/extension-code-block-lowlight` is sufficient and much lighter. Shiki can be added in a later phase once the base editor is stable.

### Decision for v1

- Use `lowlight` inside `code-block-lowlight` for the **editor** (it's the official TipTap extension)
- Add Shiki for the **public reader** in Phase 5 (post view) if needed — or keep lowlight only

---

## 3. Firestore Schema

### Blog Post Document: `blogPosts/{postId}`

Metadata only — no content body here (avoids 1MB document limit).

```
blogPosts/
  {postId}
    id:               string     ← matches document ID
    title:            string
    slug:             string     ← URL-safe, unique, e.g. "my-post-title"
    excerpt:          string     ← 1–2 sentence summary (shown in list cards)
    coverImageBase64: string     ← compressed Base64 (same pattern as works images)
    category:         string     ← e.g. "Vue", "Career", "Tooling"
    tags:             string[]   ← e.g. ["vue", "typescript", "firebase"]
    isPublished:      boolean    ← false = draft, true = live
    featured:         boolean    ← shown in a featured slot at top of list
    publishDate:      Timestamp  ← set by user; controls display date
    createdAt:        Timestamp
    updatedAt:        Timestamp
    readingTime:      number     ← minutes, auto-calculated on save
    metaTitle:        string     ← OG/meta title override (falls back to title)
    metaDescription:  string     ← OG/meta description override (falls back to excerpt)
```

### Blog Post Content: `blogPosts/{postId}/content/main`

One sub-document holding the entire TipTap JSON doc.

```
blogPosts/{postId}/content/
  main
    body:      object    ← TipTap ProseMirror JSON (doc node tree)
    updatedAt: Timestamp
```

> **Why a subcollection?** TipTap JSON can grow large for long posts. Firestore has a 1MB per-document limit. Keeping content separate means the list query (`getDocs(collection(db, 'blogPosts'))`) never fetches post bodies — only metadata. The editor fetches the `content/main` doc only when editing.

---

## 4. TypeScript Types

**File:** `src/types/blog.ts`

```ts
export interface BlogPostMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageBase64: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  featured: boolean;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
  readingTime: number;
  metaTitle: string;
  metaDescription: string;
}

export interface BlogPostContent {
  body: Record<string, unknown>; // TipTap ProseMirror JSON node
  updatedAt: Date;
}

export interface BlogPost extends BlogPostMeta {
  content: BlogPostContent;
}

export type BlogPostDraft = Omit<
  BlogPostMeta,
  "id" | "createdAt" | "updatedAt"
>;
```

---

## 5. Folder Structure (new files)

All new files follow existing naming conventions (see `docs/Architecture/NamingConventions.md`):

- **Pages/Views** → PascalCase with domain prefix (`BlogListView`, `BlogPostView`)
- **Admin views** → PascalCase with `Admin` prefix (`AdminBlogList`, `AdminBlogEditor`)
- **Section-level components** → `A` prefix (`ABlog`)
- **Utility/primitive components** → `Ab` prefix

```
src/
  types/
    blog.ts                         ← NEW: BlogPostMeta, BlogPostContent, BlogPost

  services/
    blog.service.ts                 ← NEW: Firestore CRUD for blogPosts

  stores/
    blog.ts                         ← NEW: Pinia store (list, currentPost, loading)

  components/
    blog/                           ← NEW folder
      AbBlogCard.vue                ← Public: preview card (title, excerpt, cover, date, tag)
      AbBlogCardSkeleton.vue        ← Public: skeleton placeholder (matches AbCardSkeleton pattern)
      AbPostReader.vue              ← Public: renders TipTap JSON → Vue component tree (NO v-html)
      blocks/                       ← Public: one component per TipTap node type
        AbBlockParagraph.vue
        AbBlockHeading.vue
        AbBlockBulletList.vue
        AbBlockOrderedList.vue
        AbBlockListItem.vue
        AbBlockBlockquote.vue
        AbBlockCode.vue             ← syntax-highlighted code block
        AbBlockImage.vue
        AbBlockHardBreak.vue
        AbBlockHorizontalRule.vue

  views/
    BlogListView.vue                ← NEW: public /blog route
    BlogPostView.vue                ← NEW: public /blog/:slug route

  views/admin/
    AdminBlogList.vue               ← NEW: admin /admin/blog route
    AdminBlogEditor.vue             ← NEW: admin /admin/blog/new and /admin/blog/:id/edit routes

  router/
    index.ts                        ← MODIFIED: add /blog, /blog/:slug, /admin/blog, /admin/blog/:id/edit
```

---

## 6. Rendering Philosophy

> **Rule:** Never use `v-html` to render TipTap JSON. Always walk the ProseMirror node tree in `AbPostReader.vue` and dispatch to typed block components.

```
AbPostReader.vue
  ├── receives: TipTap JSON `doc` node (object)
  ├── iterates: doc.content[] array
  └── renders each node via <component :is="blockComponent(node.type)" :node="node" />

Each block component:
  ├── receives: { node: ProseMirrorNode }
  ├── handles its own mark rendering (bold, italic, link, code inline)
  └── recursively renders children for list items, blockquotes
```

This approach:

- Is XSS-safe (no raw HTML injection)
- Is tree-shakeable (only import block components actually used)
- Is testable (each block is an isolated component)
- Follows Vue rendering patterns already in the codebase

---

## 7. SSG Behaviour

| Route                  | SSG Strategy             | Reason                                                                                                           |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `/blog`                | Pre-rendered             | Static shell, list hydrates from Firestore on mount                                                              |
| `/blog/:slug`          | **Client-rendered (v1)** | Slugs are dynamic; listing them all in `includedRoutes` requires a Firestore read at build time — deferred to v2 |
| `/admin/blog`          | Excluded (client-only)   | Same as all `/admin/*` routes                                                                                    |
| `/admin/blog/:id/edit` | Excluded (client-only)   | Same                                                                                                             |

> **v2 upgrade path:** Add a build-time `includedRoutes` function that calls Firestore, fetches all published slugs, and returns `/blog/:slug` for each. This gives full SSG for SEO. Not needed for v1 — Google crawls JS.

---

## 8. Phases

Each phase is intentionally small. Mark status in this doc as you go.

---

### Phase 1 — Foundation (Types, Service, Store)

**Status:** ✅ Complete

**Goal:** Lay the data layer. No UI. No routes. Fully testable in isolation.

**Files to create:**

| File                           | Action |
| ------------------------------ | ------ |
| `src/types/blog.ts`            | Create |
| `src/services/blog.service.ts` | Create |
| `src/stores/blog.ts`           | Create |

**Acceptance criteria:**

- `BlogPostMeta`, `BlogPostContent`, `BlogPost`, `BlogPostDraft` types exported from `src/types/blog.ts`
- `blog.service.ts` exports: `fetchPublishedPosts()`, `fetchPostBySlug()`, `fetchPostContent()`, `createPost()`, `updatePost()`, `deletePost()`, `togglePublish()`
- All service functions use `getDb()` lazy getter (never import `db` directly — see `src/firebase.ts` pattern)
- `useBlogStore()` Pinia store has: `posts`, `currentPost`, `loading`, `error` state + `loadPublished()`, `loadPostBySlug()`, `loadAdminPosts()` actions
- No components touched in this phase

**Implementation steps:**

1. Create `src/types/blog.ts` — copy the type definitions from Section 4 above
2. Create `src/services/blog.service.ts`:
   - `fetchPublishedPosts()` → `getDocs` on `blogPosts` filtered by `isPublished == true`, ordered by `publishDate desc`
   - `fetchAllPosts()` → unfiltered, for admin list
   - `fetchPostBySlug(slug)` → `query(collection, where('slug', '==', slug), limit(1))`
   - `fetchPostContent(postId)` → `getDoc(doc(db, 'blogPosts', postId, 'content', 'main'))`
   - `createPost(draft)` → `addDoc` for meta, then `setDoc` for content subcollection
   - `updatePost(id, partial)` → `updateDoc` meta, separate call for content if body changed
   - `deletePost(id)` → delete content subcollection doc first, then delete meta doc
   - `togglePublish(id, isPublished)` → `updateDoc` with `{ isPublished, updatedAt }`
3. Create `src/stores/blog.ts` following the pattern in `src/stores/seo.ts`

---

### Phase 2 — Admin Blog List

**Status:** ✅ Complete

**Goal:** Admin can see a table/list of all blog posts (drafts + published) and delete or navigate to edit them.

**Prerequisites:** Phase 1 complete.

**Files to create/modify:**

| File                                | Action                           |
| ----------------------------------- | -------------------------------- |
| `src/views/admin/AdminBlogList.vue` | Create                           |
| `src/router/index.ts`               | Modify — add `/admin/blog` route |
| `src/views/admin/AdminLayout.vue`   | Modify — add Blog nav link       |

**Acceptance criteria:**

- `/admin/blog` route exists, guarded by auth (same guard as other admin routes)
- `AdminLayout.vue` sidebar has a "Blog Posts" router-link with `exact-active-class` (same pattern as SEO link)
- `AdminBlogList.vue` shows a list of all posts with: title, category, status badge (Draft/Published), publish date, Edit button, Delete button
- Delete triggers a confirmation (native `confirm()` is fine for v1) then calls `blogService.deletePost()`
- New Post button navigates to `/admin/blog/new`
- Page shows skeleton loading state while fetching (reuse `AbCardSkeleton` pattern or create inline skeleton rows)
- Empty state shows a helpful message and "Write your first post" button

**Implementation steps:**

1. Add route to `src/router/index.ts`:
   ```ts
   { path: '/admin/blog', name: 'admin-blog', component: () => import('../views/admin/AdminBlogList.vue'), meta: { requiresAuth: true } }
   ```
2. Add nav link to `AdminLayout.vue` sidebar (after SEO Settings link)
3. Create `AdminBlogList.vue`:
   - `onMounted` → `blogStore.loadAdminPosts()`
   - Render a responsive table/card list
   - Status badge: `isPublished` = green "Published", else gray "Draft"
   - Display `publishDate.toLocaleDateString()` or "—" for drafts
   - Edit button → `router.push({ name: 'admin-blog-edit', params: { id: post.id } })`
   - Delete button → confirm → `blogService.deletePost(id)` → reload list

---

### Phase 3 — Admin Blog Editor (TipTap)

**Status:** ✅ Complete

**Goal:** Admin can create and edit posts using the TipTap editor with full metadata fields.

**Prerequisites:** Phase 2 complete.

**Files to create/modify:**

| File                                  | Action                                                           |
| ------------------------------------- | ---------------------------------------------------------------- |
| `src/views/admin/AdminBlogEditor.vue` | Create                                                           |
| `src/router/index.ts`                 | Modify — add `/admin/blog/new` and `/admin/blog/:id/edit` routes |

**Packages to install (run before starting):**

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-code-block-lowlight lowlight
```

**Acceptance criteria:**

- `/admin/blog/new` route → empty editor
- `/admin/blog/:id/edit` route → loads existing post (meta + content)
- Editor toolbar has: Bold, Italic, Headings (H2, H3), Bullet list, Ordered list, Blockquote, Code block, Link, Image (base64 from file picker), Horizontal rule
- Metadata panel (alongside editor) with fields:
  - Title (required)
  - Slug (auto-generated from title, editable)
  - Excerpt (textarea, max 200 chars with counter)
  - Category (text input)
  - Tags (comma-separated, displayed as chips)
  - Cover Image (file picker → compressed Base64, same `compressImageToBase64` utility as works section)
  - Meta Title (optional override)
  - Meta Description (optional override, max 160 chars with counter)
  - Publish Date (date input)
  - Is Published toggle
  - Featured toggle
- Save Draft button → `blogService.createPost()` or `updatePost()`, stays on page
- Publish/Unpublish toggle → calls `blogService.togglePublish()`
- Back button → navigate to `/admin/blog`
- Reading time auto-calculated from editor word count on save

**Slug generation rule:**

```ts
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
```

**Editor setup pattern:**

```ts
const editor = useEditor({
  extensions: [
    StarterKit.configure({ codeBlock: false }), // disable default, use lowlight version
    CodeBlockLowlight.configure({ lowlight }),
    Image,
    Link.configure({ openOnClick: false }),
  ],
  content: postContent.value?.body ?? "",
});
```

**Implementation steps:**

1. Install packages (see above)
2. Add routes to `src/router/index.ts`
3. Create `AdminBlogEditor.vue`:
   - Two-column layout (editor left, metadata panel right) on lg+; stacked on mobile
   - TipTap `useEditor()` with the extension list above
   - `<EditorContent :editor="editor" />` wrapped in a styled container
   - Custom toolbar above editor using `editor.chain().focus().*` commands
   - Metadata fields in right panel
   - Save logic: build `BlogPostDraft` from form + get `editor.getJSON()` for content body
   - `readingTime` = `Math.ceil(wordCount / 200)` (200 wpm average)
4. Style the editor content area: add `prose` Tailwind Typography styles if `@tailwindcss/typography` is installed, otherwise add minimal editor styles in a scoped `<style>` block

> **Note:** TipTap editor is admin-only. The `EditorContent` component is NEVER used on public-facing pages. The public reader uses `AbPostReader.vue` (Phase 5).

---

### Phase 4 — Public Blog List

**Status:** ✅ Complete

**Goal:** Visitors can browse published posts at `/blog`.

**Prerequisites:** Phase 1 complete (Phase 3 recommended so there's real content to display).

**Files to create/modify:**

| File                                         | Action                     |
| -------------------------------------------- | -------------------------- |
| `src/views/BlogListView.vue`                 | Create                     |
| `src/components/blog/AbBlogCard.vue`         | Create                     |
| `src/components/blog/AbBlogCardSkeleton.vue` | Create                     |
| `src/router/index.ts`                        | Modify — add `/blog` route |
| `src/views/admin/ANav.vue`                   | Modify — add Blog nav link |

**Acceptance criteria:**

- `/blog` route exists and is pre-rendered by SSG (static shell)
- `ANav` has a "Blog" link
- Page has proper `section-header` with label, `<h1>` title, subtitle
- Displays published posts as a responsive card grid (3 cols desktop, 2 cols tablet, 1 col mobile)
- Each card (`AbBlogCard`) shows: cover image, category badge, title, excerpt, reading time, publish date
- 8 skeleton cards shown while loading (matches `AbCardSkeleton` pattern)
- Empty state if no posts are published
- Page uses `useHead()` with title and description from `seoStore` base values

**`AbBlogCard` props:**

```ts
interface Props {
  post: BlogPostMeta;
}
```

**Card layout (follows `AbCard` pattern):**

```
[Cover Image — aspect-video]
[Category Badge]
[Title — font-semibold text-gray-900 dark:text-white]
[Excerpt — text-sm text-gray-500 dark:text-gray-400 line-clamp-2]
[Reading time • Publish date]
[Read More →]
```

**Implementation steps:**

1. Create `AbBlogCard.vue` — card component following `AbCard` visual style
2. Create `AbBlogCardSkeleton.vue` — animated skeleton matching card dimensions
3. Add `/blog` to `src/router/index.ts`
4. Add Blog link to `ANav.vue`
5. Create `BlogListView.vue`:
   - `onMounted` → `blogStore.loadPublished()`
   - Show skeletons while loading, cards when loaded
   - Use `section` + `container` structure (see Layouts.md section template)

---

### Phase 5 — Public Post Reader + SEO

**Status:** ☐ Not Started

**Goal:** Visitors can read full posts at `/blog/:slug` with proper SEO meta tags.

**Prerequisites:** Phase 4 complete.

**Files to create/modify:**

| File                                                   | Action                     |
| ------------------------------------------------------ | -------------------------- |
| `src/views/BlogPostView.vue`                           | Create                     |
| `src/components/blog/AbPostReader.vue`                 | Create                     |
| `src/components/blog/blocks/AbBlockParagraph.vue`      | Create                     |
| `src/components/blog/blocks/AbBlockHeading.vue`        | Create                     |
| `src/components/blog/blocks/AbBlockBulletList.vue`     | Create                     |
| `src/components/blog/blocks/AbBlockOrderedList.vue`    | Create                     |
| `src/components/blog/blocks/AbBlockListItem.vue`       | Create                     |
| `src/components/blog/blocks/AbBlockBlockquote.vue`     | Create                     |
| `src/components/blog/blocks/AbBlockCode.vue`           | Create                     |
| `src/components/blog/blocks/AbBlockImage.vue`          | Create                     |
| `src/components/blog/blocks/AbBlockHardBreak.vue`      | Create                     |
| `src/components/blog/blocks/AbBlockHorizontalRule.vue` | Create                     |
| `src/router/index.ts`                                  | Modify — add `/blog/:slug` |

**Acceptance criteria:**

- `/blog/:slug` fetches post by slug on `onMounted` (client-side)
- 404-style empty state if post not found or not published
- Cover image rendered at top (full-width, aspect-video)
- Category, title, publish date, reading time header
- Full post content rendered via `AbPostReader.vue` (NO `v-html`)
- `useHead()` sets: `title = post.metaTitle || post.title`, `description = post.metaDescription || post.excerpt`, `og:image = post.coverImageBase64 || seoStore.config.ogImage`, `og:type = 'article'`, `article:published_time`, `article:tag`
- "← Back to Blog" link at top and bottom
- Related posts section (same category, max 3) — optional for v1

**`AbPostReader.vue` implementation:**

```ts
// Core render function pattern
function getBlockComponent(type: string) {
  const map: Record<string, Component> = {
    paragraph: AbBlockParagraph,
    heading: AbBlockHeading,
    bulletList: AbBlockBulletList,
    orderedList: AbBlockOrderedList,
    listItem: AbBlockListItem,
    blockquote: AbBlockBlockquote,
    codeBlock: AbBlockCode,
    image: AbBlockImage,
    hardBreak: AbBlockHardBreak,
    horizontalRule: AbBlockHorizontalRule,
  };
  return map[type] ?? AbBlockParagraph;
}
```

**Marks (inline formatting) — handled inside each block component:**

| Mark type | Rendered as                                                |
| --------- | ---------------------------------------------------------- |
| `bold`    | `<strong>`                                                 |
| `italic`  | `<em>`                                                     |
| `code`    | `<code class="...">`                                       |
| `link`    | `<a href="..." target="_blank" rel="noopener noreferrer">` |
| `strike`  | `<s>`                                                      |

**Implementation steps:**

1. Create all `blocks/AbBlock*.vue` components — start simple, add mark support
2. Create `AbPostReader.vue` — walks `doc.content[]`, dispatches to block components
3. Add `/blog/:slug` route
4. Create `BlogPostView.vue`:
   - `onMounted` → fetch by slug → set `currentPost` in store
   - `useHead()` with computed refs from `currentPost`
   - Render header, cover image, `<AbPostReader :doc="content.body" />`

---

### Phase 6 — Search, Filter & Pagination (v2)

**Status:** ☐ Not Started

**Goal:** Visitors can filter posts by category/tag and search by keyword.

**Prerequisites:** Phase 5 complete.

**Notes — defer to v2:**

- Firestore does not support full-text search natively. Options:
  - **Client-side filter** (simplest): fetch all published posts, filter in memory — fine up to ~200 posts
  - **Algolia free tier**: 10K records, 10K searches/month — good if blog grows large
  - **Pagefind**: runs at build time, works with SSG — best option if SSG is upgraded
- Category filter: computed `filteredPosts` from `selectedCategory` ref
- Tag filter: same pattern
- Pagination: 6 posts per page, `currentPage` ref, computed `paginatedPosts`
- URL params: `/blog?category=Vue&page=2` — use `useRoute().query`

**Files to create/modify (v2):**

| File                                    | Action |
| --------------------------------------- | ------ |
| `src/components/blog/AbBlogFilters.vue` | Create |
| `src/components/blog/AbPagination.vue`  | Create |
| `src/views/BlogListView.vue`            | Modify |

---

### Phase 7 — SSG Slug Pre-rendering (v2)

**Status:** ☐ Not Started

**Goal:** Pre-render `/blog/:slug` at build time for full SEO without JavaScript dependency.

**Prerequisites:** Phase 5 complete. Blog has real published posts.

**Notes:**

Update `vite.config.ts` → `includedRoutes` async function:

```ts
async includedRoutes(paths) {
  const { getDb } = await import('./src/firebase')
  const { getDocs, collection, query, where } = await import('firebase/firestore')
  const db = await getDb()
  const snap = await getDocs(
    query(collection(db, 'blogPosts'), where('isPublished', '==', true))
  )
  const slugRoutes = snap.docs.map(d => `/blog/${d.data().slug}`)
  return [...paths, ...slugRoutes]
}
```

This runs only at `npm run build` time, not at runtime. Lazy getter pattern stays intact.

---

## 9. Design Guidelines

### Blog List Page

- Follow the Section Layout Template from `docs/DesignSystem/Layouts.md`
- Section label: `BLOG`
- `<h1>` title: `Thoughts & Writings`
- Subtitle: `Articles on frontend engineering, tooling, and career growth.`
- Background: `bg-gray-50 dark:bg-slate-900` (alternates with any surrounding sections)
- Card grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

### Blog Post Page

- Does NOT follow the section template (it's a full reading layout)
- Max content width: `max-w-3xl mx-auto px-5`
- Cover image: `w-full aspect-video object-cover rounded-2xl`
- Typography for post body:
  - `h2`: `text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4`
  - `h3`: `text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3`
  - `p`: `text-gray-600 dark:text-gray-300 leading-relaxed mb-4`
  - `code` (inline): `bg-gray-100 dark:bg-slate-800 text-sm px-1.5 py-0.5 rounded font-mono`
  - `pre` (code block): `bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm font-mono`
  - `blockquote`: `border-l-4 border-indigo-500 pl-4 italic text-gray-500 dark:text-gray-400`
  - `a`: `text-indigo-600 dark:text-indigo-400 underline hover:no-underline`
  - `hr`: `border-gray-200 dark:border-slate-700 my-8`

### Admin Editor

- Toolbar: same pill/button style as other admin action buttons
- Editor content area: `min-h-[500px]` with `border border-gray-200 dark:border-slate-600 rounded-xl p-4`
- Metadata panel: same card style as `AdminSeoSettings.vue` (white card, rounded-2xl, shadow-sm)

---

## 10. Analytics Events

Add the following GA4 events (follow `docs/Architecture/APIIntegrationGuide.md` — add to a composable):

| Event                 | Trigger                          | Parameters                            |
| --------------------- | -------------------------------- | ------------------------------------- |
| `blog_post_view`      | User opens `/blog/:slug`         | `post_slug`, `post_title`, `category` |
| `blog_list_view`      | User opens `/blog`               | —                                     |
| `blog_filter_applied` | User selects category/tag filter | `filter_type`, `filter_value`         |

---

## 11. Open Questions (resolve before starting each phase)

1. **Tailwind Typography plugin** (`@tailwindcss/typography`) — do we want to install it for the `prose` class on the post reader? It gives sensible typographic defaults with zero custom CSS. **Decide before Phase 5.**
2. **Image handling in editor** — TipTap `Image` extension inserts images as base64 by default. Large images would bloat Firestore. Should images in the post body use Firebase Storage? **Decision: for v1, limit image size in the file picker (e.g. 400KB max after compression). Firebase Storage can be added in v2.**
3. **Comment system** — out of scope for all phases listed. Can be added as Phase 8 using Disqus or a custom Firestore sub-collection.
4. **RSS feed** — out of scope for v1. Can be generated at build time in v2.
5. **Draft preview** — admin may want to preview a draft post before publishing. For v1, the editor itself is the preview. A proper `/blog/preview/:id` route can be a v2 feature.

---

## 12. Testing Checklist (per phase, before marking Done)

- [ ] TypeScript: `npm run type-check` passes with no new errors
- [ ] Build: `npm run build` succeeds
- [ ] Lint: no new ESLint warnings
- [ ] Manual: tested on mobile viewport (375px)
- [ ] Manual: tested in dark mode
- [ ] Manual: tested with no posts in Firestore (empty state)
- [ ] Manual: tested with loading state (slow network or throttle in DevTools)
- [ ] Manual: Firestore rules — unauthenticated user cannot write to `blogPosts`
- [ ] Manual: authenticated admin can create, update, delete posts
- [ ] Manual: published post visible on public `/blog` list
- [ ] Manual: draft post NOT visible on public `/blog` list
- [ ] SEO: `useHead()` sets correct `<title>` and `<meta description>` on post page

---

## 13. Firestore Rules (add when Phase 1 starts)

```
match /blogPosts/{postId} {
  allow read: if resource.data.isPublished == true;
  allow write: if request.auth != null;

  match /content/{contentId} {
    allow read: if get(/databases/$(database)/documents/blogPosts/$(postId)).data.isPublished == true;
    allow write: if request.auth != null;
  }
}
```

> **Note:** Unauthenticated reads of draft posts are denied. The admin editor is behind `requiresAuth: true` so it uses the authenticated Firebase user's token for reads of drafts.
