/**
 * src/services/blog.service.ts
 *
 * Firestore CRUD operations for the Blog Module.
 *
 * Firestore layout:
 *   blogPosts/{postId}               ← metadata (BlogPostMeta)
 *   blogPosts/{postId}/content/main  ← TipTap JSON body (BlogPostContent)
 *
 * All functions use the `getDb()` lazy getter so this module is safe to import
 * at the top level — Firebase is never initialised during the SSG build.
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
    increment,
} from 'firebase/firestore'
import { getDb } from '@/firebase'
import type { BlogPostMeta, BlogPostContent, BlogPostDraft } from '@/types/blog'

// ─── Collection helpers ───────────────────────────────────────────────────────

const postsCol = () => collection(getDb(), 'blogPosts')
const postDoc = (id: string) => doc(getDb(), 'blogPosts', id)
const contentDoc = (postId: string) => doc(getDb(), 'blogPosts', postId, 'content', 'main')

// ─── Serialisation helpers ────────────────────────────────────────────────────

/** Convert a Firestore document snapshot's data to a BlogPostMeta. */
function snapToMeta(id: string, data: Record<string, unknown>): BlogPostMeta {
    const toDate = (v: unknown): Date =>
        v instanceof Timestamp ? v.toDate() : v instanceof Date ? v : new Date()

    return {
        id,
        title: (data.title as string) ?? '',
        slug: (data.slug as string) ?? '',
        excerpt: (data.excerpt as string) ?? '',
        coverImageBase64: (data.coverImageBase64 as string) ?? '',
        category: (data.category as string) ?? '',
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        isPublished: (data.isPublished as boolean) ?? false,
        featured: (data.featured as boolean) ?? false,
        publishDate: toDate(data.publishDate),
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        readingTime: (data.readingTime as number) ?? 1,
        metaTitle: (data.metaTitle as string) ?? '',
        metaDescription: (data.metaDescription as string) ?? '',
        viewCount: (data.viewCount as number) ?? 0,
    }
}

// ─── Public reads ─────────────────────────────────────────────────────────────

/**
 * Fetch all published posts, ordered newest first.
 * Used on the public `/blog` list page.
 */
export async function fetchPublishedPosts(): Promise<BlogPostMeta[]> {
    const q = query(
        postsCol(),
        where('isPublished', '==', true),
    )
    const snap = await getDocs(q)
    const posts = snap.docs.map((d) => snapToMeta(d.id, d.data() as Record<string, unknown>))
    // Sort client-side to avoid requiring a Firestore composite index on isPublished + publishDate
    return posts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
}

/**
 * Fetch a single published post by its slug.
 * Returns `null` if not found or not published.
 */
export async function fetchPostBySlug(slug: string): Promise<BlogPostMeta | null> {
    const q = query(
        postsCol(),
        where('slug', '==', slug),
        limit(1),
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]!
    const meta = snapToMeta(d.id, d.data() as Record<string, unknown>)
    // Guard: do not expose unpublished posts to the public reader
    return meta.isPublished ? meta : null
}

// ─── Admin reads ──────────────────────────────────────────────────────────────

/**
 * Fetch ALL posts (drafts + published), ordered by `updatedAt` desc.
 * Used in the admin blog list — requires authentication.
 */
export async function fetchAllPosts(): Promise<BlogPostMeta[]> {
    const q = query(postsCol(), orderBy('updatedAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => snapToMeta(d.id, d.data() as Record<string, unknown>))
}

/**
 * Fetch a single post by ID regardless of published status.
 * Used by the admin editor when loading an existing post.
 */
export async function fetchPostById(id: string): Promise<BlogPostMeta | null> {
    const snap = await getDoc(postDoc(id))
    if (!snap.exists()) return null
    return snapToMeta(snap.id, snap.data() as Record<string, unknown>)
}

// ─── Content (body) ───────────────────────────────────────────────────────────

/**
 * Fetch the TipTap JSON body for a post.
 * Returns `null` if the content sub-document does not exist yet.
 */
export async function fetchPostContent(postId: string): Promise<BlogPostContent | null> {
    const snap = await getDoc(contentDoc(postId))
    if (!snap.exists()) return null
    const data = snap.data() as Record<string, unknown>
    const toDate = (v: unknown): Date =>
        v instanceof Timestamp ? v.toDate() : v instanceof Date ? v : new Date()
    return {
        body: (data.body as Record<string, unknown>) ?? {},
        updatedAt: toDate(data.updatedAt),
    }
}

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * Create a new blog post.
 *
 * Steps:
 * 1. `addDoc` the metadata to `blogPosts` — Firestore generates the ID
 * 2. `setDoc` the TipTap JSON body to `blogPosts/{id}/content/main`
 *
 * Returns the new document ID.
 */
export async function createPost(
    draft: BlogPostDraft,
    contentBody: Record<string, unknown>,
): Promise<string> {
    const now = serverTimestamp()

    // 1. Write metadata
    const metaRef = await addDoc(postsCol(), {
        ...draft,
        publishDate: Timestamp.fromDate(draft.publishDate),
        createdAt: now,
        updatedAt: now,
    })

    // 2. Write content sub-document
    await setDoc(contentDoc(metaRef.id), {
        body: contentBody,
        updatedAt: now,
    })

    return metaRef.id
}

/**
 * Update an existing post's metadata.
 * Pass `contentBody` only when the editor content has changed.
 */
export async function updatePost(
    id: string,
    partial: Partial<BlogPostDraft>,
    contentBody?: Record<string, unknown>,
): Promise<void> {
    const now = serverTimestamp()

    // Always stamp updatedAt on metadata
    await updateDoc(postDoc(id), {
        ...partial,
        ...(partial.publishDate !== undefined && {
            publishDate: Timestamp.fromDate(partial.publishDate),
        }),
        updatedAt: now,
    })

    // Only touch the content sub-document if the body was actually edited
    if (contentBody !== undefined) {
        await setDoc(
            contentDoc(id),
            { body: contentBody, updatedAt: now },
            { merge: true },
        )
    }
}

/**
 * Toggle `isPublished` on a post without a full update round-trip.
 * Called from the admin list or the editor's publish toggle.
 */
export async function togglePublish(id: string, isPublished: boolean): Promise<void> {
    await updateDoc(postDoc(id), {
        isPublished,
        updatedAt: serverTimestamp(),
    })
}

/**
 * Permanently delete a post.
 *
 * Order matters: delete the content sub-document first so a partial failure
 * (content deleted, meta not yet) doesn't leave an orphaned meta with no body.
 * In practice Firestore deletes are atomic per document, so either succeeds.
 */
export async function deletePost(id: string): Promise<void> {
    await deleteDoc(contentDoc(id))
    await deleteDoc(postDoc(id))
}

/**
 * Atomically increment the view counter for a post.
 * Fire-and-forget — call without await from the public reader.
 * Uses Firestore's atomic increment so concurrent visitors never overwrite each other.
 */
export async function incrementViewCount(id: string): Promise<void> {
    await updateDoc(postDoc(id), { viewCount: increment(1) })
}
