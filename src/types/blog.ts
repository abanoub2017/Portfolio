/**
 * src/types/blog.ts
 *
 * TypeScript types for the Blog Module.
 *
 * Firestore layout:
 *   blogPosts/{postId}               ← BlogPostMeta (no body — avoids 1 MB limit)
 *   blogPosts/{postId}/content/main  ← BlogPostContent (full TipTap JSON)
 */

// ─── Metadata ─────────────────────────────────────────────────────────────────

/**
 * Stored in `blogPosts/{postId}`.
 * Never includes the post body — fetch that separately via BlogPostContent.
 */
export interface BlogPostMeta {
    /** Matches the Firestore document ID */
    id: string
    /** Display title shown in list cards and as the page <h1> */
    title: string
    /** URL-safe unique identifier, e.g. "my-post-title" */
    slug: string
    /** 1–2 sentence summary shown in list cards and as fallback meta description */
    excerpt: string
    /**
     * Compressed Base64-encoded cover image.
     * Same pattern as section images (works, hero photo).
     * Empty string if no cover has been uploaded.
     */
    coverImageBase64: string
    /** Single category label, e.g. "Vue", "Career", "Tooling" */
    category: string
    /** Array of lowercase tag strings, e.g. ["vue", "typescript", "firebase"] */
    tags: string[]
    /** false = draft (admin-only), true = visible on public /blog */
    isPublished: boolean
    /** Whether to show this post in the featured slot at the top of the list */
    featured: boolean
    /** Controls the public display date; set explicitly by the author */
    publishDate: Date
    createdAt: Date
    updatedAt: Date
    /** Estimated reading time in minutes — auto-calculated on save */
    readingTime: number
    /** <title> tag override for this post (falls back to `title` if empty) */
    metaTitle: string
    /** <meta description> override (falls back to `excerpt` if empty) */
    metaDescription: string
    /** Total number of times the post has been opened — incremented on every visit */
    viewCount: number
}

// ─── Content ──────────────────────────────────────────────────────────────────

/**
 * Stored in `blogPosts/{postId}/content/main`.
 * Holds the full TipTap ProseMirror JSON document node.
 */
export interface BlogPostContent {
    /**
     * TipTap / ProseMirror JSON serialisation of the document.
     * Root shape: { type: 'doc', content: ProseMirrorNode[] }
     */
    body: Record<string, unknown>
    updatedAt: Date
}

// ─── Combined ─────────────────────────────────────────────────────────────────

/** Full post — metadata + content body joined in memory (never fetched as one Firestore read). */
export interface BlogPost extends BlogPostMeta {
    content: BlogPostContent
}

// ─── Draft (write) ────────────────────────────────────────────────────────────

/**
 * Shape used when creating or updating a post from the admin editor.
 * Omits auto-generated server fields (`id`, `createdAt`, `updatedAt`, `viewCount`).
 */
export type BlogPostDraft = Omit<BlogPostMeta, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>

// ─── ProseMirror JSON (TipTap serialisation) ──────────────────────────────────

/** Inline mark applied to a text node (bold, italic, link, etc.) */
export interface ProseMirrorMark {
    type: string
    attrs?: Record<string, unknown>
}

/**
 * A single node in the TipTap / ProseMirror JSON document tree.
 * Used by AbPostReader and all AbBlock* components to render content
 * without v-html.
 */
export interface ProseMirrorNode {
    type: string
    /** Present only on `text` nodes */
    text?: string
    /** Present on nodes that carry configuration (heading level, image src, etc.) */
    attrs?: Record<string, unknown>
    /** Child nodes (paragraphs inside blockquote, list items inside lists, etc.) */
    content?: ProseMirrorNode[]
    /** Inline formatting marks applied to this text node */
    marks?: ProseMirrorMark[]
}
