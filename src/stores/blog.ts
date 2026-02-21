/**
 * src/stores/blog.ts
 *
 * Pinia store for the Blog Module.
 *
 * Consumers:
 *   - Public BlogListView  → `loadPublished()`
 *   - Public BlogPostView  → `loadPostBySlug(slug)`
 *   - Admin AdminBlogList  → `loadAll()`
 *   - Admin AdminBlogEditor → `loadPostById(id)` / `save()` / `remove()`
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    fetchPublishedPosts,
    fetchAllPosts,
    fetchPostBySlug,
    fetchPostById,
    fetchPostContent,
    createPost,
    updatePost,
    togglePublish,
    deletePost,
    incrementViewCount,
} from '@/services/blog.service'
import type { BlogPostMeta, BlogPostContent, BlogPostDraft } from '@/types/blog'

export const useBlogStore = defineStore('blog', () => {
    // ─── State ─────────────────────────────────────────────────────────────────

    /** List of posts shown in the public blog list or admin blog list */
    const posts = ref<BlogPostMeta[]>([])

    /** Currently open post metadata (post view or editor) */
    const currentMeta = ref<BlogPostMeta | null>(null)

    /** Currently open post content/body (editor or post reader) */
    const currentContent = ref<BlogPostContent | null>(null)

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // ─── Private helpers ───────────────────────────────────────────────────────

    function startLoad() {
        isLoading.value = true
        error.value = null
    }

    function handleError(e: unknown, fallback: string) {
        error.value = e instanceof Error ? e.message : fallback
    }

    function finishLoad() {
        isLoading.value = false
    }

    // ─── Public reads ──────────────────────────────────────────────────────────

    /**
     * Load all published posts ordered newest-first.
     * Called by BlogListView on mount.
     */
    async function loadPublished() {
        startLoad()
        try {
            posts.value = await fetchPublishedPosts()
        } catch (e) {
            handleError(e, 'Failed to load posts')
        } finally {
            finishLoad()
        }
    }

    /**
     * Load a single published post by slug + its TipTap content body.
     * Called by BlogPostView on mount.
     * Sets `currentMeta` and `currentContent`; clears both on not-found.
     */
    async function loadPostBySlug(slug: string) {
        startLoad()
        currentMeta.value = null
        currentContent.value = null
        try {
            const meta = await fetchPostBySlug(slug)
            if (!meta) return
            currentMeta.value = meta
            currentContent.value = await fetchPostContent(meta.id)
            // Fire-and-forget: don't block rendering on the counter write
            incrementViewCount(meta.id).catch(() => { /* non-critical */ })
        } catch (e) {
            handleError(e, 'Failed to load post')
        } finally {
            finishLoad()
        }
    }

    // ─── Admin reads ───────────────────────────────────────────────────────────

    /**
     * Load every post (drafts + published) for the admin list.
     * Requires the user to be authenticated (Firestore rules enforce this).
     */
    async function loadAll() {
        startLoad()
        try {
            posts.value = await fetchAllPosts()
        } catch (e) {
            handleError(e, 'Failed to load posts')
        } finally {
            finishLoad()
        }
    }

    /**
     * Load a single post by ID for the admin editor.
     * Sets `currentMeta` and `currentContent`.
     */
    async function loadPostById(id: string) {
        startLoad()
        currentMeta.value = null
        currentContent.value = null
        try {
            const meta = await fetchPostById(id)
            if (!meta) return
            currentMeta.value = meta
            currentContent.value = await fetchPostContent(id)
        } catch (e) {
            handleError(e, 'Failed to load post')
        } finally {
            finishLoad()
        }
    }

    // ─── Admin writes ──────────────────────────────────────────────────────────

    /**
     * Create a new post from the editor.
     * Updates `currentMeta` with the server-assigned ID on success.
     * Returns the new post ID or null on failure.
     */
    async function create(
        draft: BlogPostDraft,
        contentBody: Record<string, unknown>,
    ): Promise<string | null> {
        startLoad()
        try {
            const id = await createPost(draft, contentBody)
            // Refresh the local list to include the new post
            posts.value = await fetchAllPosts()
            return id
        } catch (e) {
            handleError(e, 'Failed to create post')
            return null
        } finally {
            finishLoad()
        }
    }

    /**
     * Persist changes from the editor.
     * Pass `contentBody` only when the TipTap editor content changed.
     */
    async function save(
        id: string,
        partial: Partial<BlogPostDraft>,
        contentBody?: Record<string, unknown>,
    ): Promise<void> {
        startLoad()
        try {
            await updatePost(id, partial, contentBody)
            // Keep currentMeta in sync
            if (currentMeta.value?.id === id) {
                currentMeta.value = { ...currentMeta.value, ...partial, updatedAt: new Date() }
            }
            // Keep list in sync
            const idx = posts.value.findIndex((p) => p.id === id)
            if (idx !== -1) {
                posts.value[idx] = { ...posts.value[idx]!, ...partial, updatedAt: new Date() } as BlogPostMeta
            }
        } catch (e) {
            handleError(e, 'Failed to save post')
        } finally {
            finishLoad()
        }
    }

    /**
     * Toggle `isPublished` without a full editor save.
     * Called from the admin list row buttons.
     */
    async function toggle(id: string, isPublished: boolean): Promise<void> {
        try {
            await togglePublish(id, isPublished)
            const idx = posts.value.findIndex((p) => p.id === id)
            if (idx !== -1) posts.value[idx] = { ...posts.value[idx]!, isPublished, updatedAt: new Date() }
            if (currentMeta.value?.id === id) currentMeta.value = { ...currentMeta.value, isPublished }
        } catch (e) {
            handleError(e, 'Failed to toggle publish status')
        }
    }

    /**
     * Delete a post and remove it from the local list.
     */
    async function remove(id: string): Promise<void> {
        startLoad()
        try {
            await deletePost(id)
            posts.value = posts.value.filter((p) => p.id !== id)
            if (currentMeta.value?.id === id) {
                currentMeta.value = null
                currentContent.value = null
            }
        } catch (e) {
            handleError(e, 'Failed to delete post')
        } finally {
            finishLoad()
        }
    }

    return {
        // State
        posts,
        currentMeta,
        currentContent,
        isLoading,
        error,
        // Actions
        loadPublished,
        loadPostBySlug,
        loadAll,
        loadPostById,
        create,
        save,
        toggle,
        remove,
    }
})
