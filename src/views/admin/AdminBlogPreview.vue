<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import AbPostReader from '@/components/blog/AbPostReader.vue'

const route = useRoute()
const blogStore = useBlogStore()

const postId = computed(() => route.params['id'] as string)

onMounted(async () => {
    if (postId.value) {
        blogStore.currentMeta = null
        blogStore.currentContent = null
        await blogStore.loadPostById(postId.value)
    }
})

const meta = computed(() => blogStore.currentMeta)
const content = computed(() => blogStore.currentContent)
const isLoading = computed(() => blogStore.isLoading)
const error = computed(() => blogStore.error)

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
    <!-- ─── Draft banner ──────────────────────────────────────────────────── -->
    <div
        class="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-400 dark:bg-amber-500 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow-md">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
            aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        DRAFT — NOT PUBLISHED
        <span class="mx-2 text-amber-800 dark:text-amber-900 opacity-60">|</span>
        <RouterLink :to="{ name: 'admin-blog-edit', params: { id: postId } }"
            class="underline underline-offset-2 hover:no-underline transition-all">
            ← Back to editor
        </RouterLink>
    </div>

    <!-- ─── Loading ───────────────────────────────────────────────────────── -->
    <section v-if="isLoading" class="min-h-screen pt-16 pb-20 bg-white dark:bg-slate-900">
        <div class="max-w-3xl mx-auto px-5 animate-pulse space-y-6 pt-12">
            <div class="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700" />
            <div class="w-full aspect-video rounded-2xl bg-gray-200 dark:bg-slate-700" />
            <div class="space-y-3 pt-4">
                <div class="h-3 w-28 rounded bg-gray-200 dark:bg-slate-700" />
                <div class="h-8 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
                <div class="h-8 w-1/2 rounded bg-gray-200 dark:bg-slate-700" />
                <div class="h-4 w-40 rounded bg-gray-200 dark:bg-slate-700" />
            </div>
            <div class="space-y-3 pt-6">
                <div v-for="n in 8" :key="n" class="h-4 rounded bg-gray-200 dark:bg-slate-700"
                    :style="{ width: n % 3 === 0 ? '65%' : '100%' }" />
            </div>
        </div>
    </section>

    <!-- ─── Error ─────────────────────────────────────────────────────────── -->
    <section v-else-if="error"
        class="min-h-screen pt-20 pb-20 flex flex-col items-center justify-center px-5 text-center bg-white dark:bg-slate-900">
        <p class="text-4xl mb-4" aria-hidden="true">⚠️</p>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ error }}</p>
        <RouterLink :to="{ name: 'admin-blog-edit', params: { id: postId } }"
            class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            ← Back to editor
        </RouterLink>
    </section>

    <!-- ─── Post ──────────────────────────────────────────────────────────── -->
    <article v-else-if="meta" class="min-h-screen pt-10 pb-24 bg-white dark:bg-slate-900">
        <div class="max-w-4xl mx-auto px-5">
            <div class="flex gap-6 items-start">

                <!-- ── Main article content ──────────────────────────────── -->
                <div class="flex-1 min-w-0">

                    <!-- Back to editor link -->
                    <RouterLink :to="{ name: 'admin-blog-edit', params: { id: postId } }"
                        class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to editor
                    </RouterLink>

                    <!-- Cover image -->
                    <img v-if="meta.coverImageBase64" :src="meta.coverImageBase64" :alt="meta.title"
                        class="w-full aspect-video object-cover rounded-2xl mb-10" />

                    <!-- Post header -->
                    <header class="mb-10">
                        <span v-if="meta.category"
                            class="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                            {{ meta.category }}
                        </span>

                        <h1
                            class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                            {{ meta.title }}
                        </h1>

                        <!-- Meta row -->
                        <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <time :datetime="meta.publishDate instanceof Date ? meta.publishDate.toISOString() : ''">
                                {{ formatDate(meta.publishDate) }}
                            </time>
                            <span aria-hidden="true">·</span>
                            <span>{{ meta.readingTime }} min read</span>
                            <!-- Draft badge instead of view count -->
                            <span aria-hidden="true">·</span>
                            <span
                                class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                                Draft
                            </span>
                        </div>

                        <!-- Tags -->
                        <div v-if="meta.tags.length" class="flex flex-wrap gap-2 mt-4">
                            <span v-for="tag in meta.tags" :key="tag"
                                class="px-2.5 py-0.5 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                #{{ tag }}
                            </span>
                        </div>
                    </header>

                    <!-- Post body -->
                    <AbPostReader v-if="content" :doc="content.body" />

                    <!-- Bottom action -->
                    <div class="mt-16 pt-8 border-t border-gray-200 dark:border-slate-700">
                        <RouterLink :to="{ name: 'admin-blog-edit', params: { id: postId } }"
                            class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">
                            ← Back to editor
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<style scoped>
:deep(.inline-code) {
    @apply bg-gray-100 dark:bg-slate-800 text-sm px-1.5 py-0.5 rounded font-mono;
}

:deep(.post-reader a) {
    @apply text-indigo-600 dark:text-indigo-400 underline hover:no-underline;
}
</style>
