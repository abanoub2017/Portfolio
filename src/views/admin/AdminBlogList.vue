<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

const router = useRouter()
const blogStore = useBlogStore()

onMounted(() => blogStore.loadAll())

function handleNew() {
    router.push({ name: 'admin-blog-new' })
}

function handleEdit(id: string) {
    router.push({ name: 'admin-blog-edit', params: { id } })
}

// ─── Delete modal ─────────────────────────────────────────────────────────────
const deleteModal = ref<{ id: string; title: string } | null>(null)
const isDeleting = ref(false)

function handleDelete(id: string, title: string) {
    deleteModal.value = { id, title }
}

async function confirmDelete() {
    if (!deleteModal.value) return
    isDeleting.value = true
    await blogStore.remove(deleteModal.value.id)
    isDeleting.value = false
    deleteModal.value = null
}

function cancelDelete() {
    deleteModal.value = null
}

async function handleTogglePublish(id: string, current: boolean) {
    await blogStore.toggle(id, !current)
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
    <div>

        <!-- ─── Page header ───────────────────────────────────────────────────────── -->
        <div class="mb-8 flex items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-white">Blog Posts</h1>
                <p class="text-gray-400 text-sm mt-1">
                    Manage your blog posts. Drafts are invisible to visitors until published.
                </p>
            </div>
            <button @click="handleNew"
                class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Post
            </button>
        </div>

        <!-- ─── Loading skeletons ─────────────────────────────────────────────────── -->
        <div v-if="blogStore.isLoading" class="flex flex-col gap-3">
            <div v-for="n in 5" :key="n" class="h-20 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />
        </div>

        <!-- ─── Error state ────────────────────────────────────────────────────────── -->
        <div v-else-if="blogStore.error" class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <p class="text-red-400 text-sm">{{ blogStore.error }}</p>
            <button @click="blogStore.loadAll()" class="mt-3 text-sm text-red-400 underline hover:no-underline">
                Retry
            </button>
        </div>

        <!-- ─── Empty state ────────────────────────────────────────────────────────── -->
        <div v-else-if="blogStore.posts.length === 0"
            class="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center text-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center">
                <svg class="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>
            <div>
                <p class="text-white font-semibold">No posts yet</p>
                <p class="text-gray-400 text-sm mt-1">Write your first post to get started.</p>
            </div>
            <button @click="handleNew"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
                Write your first post
            </button>
        </div>

        <!-- ─── Post list ──────────────────────────────────────────────────────────── -->
        <div v-else class="flex flex-col gap-3">
            <div v-for="post in blogStore.posts" :key="post.id"
                class="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 flex items-center gap-4 group hover:border-gray-700 transition-colors">

                <!-- Cover thumbnail -->
                <div class="w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-gray-800 flex items-center justify-center">
                    <img v-if="post.coverImageBase64" :src="post.coverImageBase64" class="w-full h-full object-cover"
                        :alt="post.title" />
                    <svg v-else class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 12V21h18V12M3 3h18v9H3V3z" />
                    </svg>
                </div>

                <!-- Title + meta -->
                <div class="flex-1 min-w-0">
                    <p class="text-white font-medium text-sm truncate">{{ post.title || '(Untitled)' }}</p>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                        <!-- Category badge -->
                        <span v-if="post.category"
                            class="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs border border-gray-700">
                            {{ post.category }}
                        </span>
                        <!-- Reading time -->
                        <span class="text-gray-600 text-xs">{{ post.readingTime }} min read</span>
                    </div>
                </div>

                <!-- Status + date -->
                <div class="hidden sm:flex flex-col items-end gap-1 shrink-0">
                    <!-- Status badge -->
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium" :class="post.isPublished
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'">
                        {{ post.isPublished ? 'Published' : 'Draft' }}
                    </span>
                    <!-- Date -->
                    <span class="text-gray-600 text-xs">
                        {{ post.isPublished ? formatDate(post.publishDate) : 'Not published' }}
                    </span>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 shrink-0">
                    <!-- Publish toggle -->
                    <button @click="handleTogglePublish(post.id, post.isPublished)"
                        class="p-2 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                        :title="post.isPublished ? 'Unpublish' : 'Publish'">
                        <!-- Eye open = published, eye-slash = draft -->
                        <svg v-if="post.isPublished" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    </button>

                    <!-- Edit -->
                    <button @click="handleEdit(post.id)"
                        class="p-2 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-colors"
                        title="Edit post">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                    </button>

                    <!-- Delete -->
                    <button @click="handleDelete(post.id, post.title)"
                        class="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Delete post">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    </div>

    <!-- ─── Delete confirmation modal ──────────────────────────────────────────── -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="deleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                @click.self="cancelDelete">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                <!-- Dialog -->
                <div class="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6">
                    <!-- Icon -->
                    <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/15 mx-auto mb-4">
                        <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>

                    <!-- Text -->
                    <h2 class="text-white font-semibold text-center text-lg">Delete post?</h2>
                    <p class="text-gray-400 text-sm text-center mt-2">
                        <span class="text-white font-medium">"{{ deleteModal.title || 'Untitled' }}"</span>
                        will be permanently deleted. This cannot be undone.
                    </p>

                    <!-- Buttons -->
                    <div class="flex gap-3 mt-6">
                        <button @click="cancelDelete" :disabled="isDeleting"
                            class="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button @click="confirmDelete" :disabled="isDeleting"
                            class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            <svg v-if="isDeleting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {{ isDeleting ? 'Deleting…' : 'Delete post' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
