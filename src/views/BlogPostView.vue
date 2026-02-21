<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useBlogStore } from '@/stores/blog'
import { useSeoStore } from '@/stores/seo'
import AbPostReader from '@/components/blog/AbPostReader.vue'

const route = useRoute()
const blogStore = useBlogStore()
const seoStore = useSeoStore()

const slug = computed(() => route.params['slug'] as string)

onMounted(() => {
    if (slug.value) blogStore.loadPostBySlug(slug.value)
})

// ─── Derived state ────────────────────────────────────────────────────────────

const meta = computed(() => blogStore.currentMeta)
const content = computed(() => blogStore.currentContent)
const isLoading = computed(() => blogStore.isLoading)
const error = computed(() => blogStore.error)
const notFound = computed(() => !isLoading.value && !error.value && !meta.value)

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

const pageTitle = computed(() =>
    meta.value
        ? `${meta.value.metaTitle || meta.value.title} — ${seoStore.config.title}`
        : seoStore.config.title,
)

const pageDescription = computed(() =>
    meta.value ? meta.value.metaDescription || meta.value.excerpt : seoStore.config.description,
)

const ogImage = computed(() =>
    meta.value?.coverImageBase64 || seoStore.config.ogImage,
)

const publishedTime = computed(() =>
    meta.value?.publishDate instanceof Date
        ? meta.value.publishDate.toISOString()
        : '',
)

useHead({
    title: pageTitle,
    meta: [
        { name: 'description', content: pageDescription },
        { property: 'og:type', content: 'article' },
        {
            property: 'article:published_time',
            content: publishedTime,
        },
        {
            property: 'article:tag',
            content: computed(() => meta.value?.tags.join(', ') ?? ''),
        },
    ],
})

useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: ogImage,
})
</script>

<template>
    <!-- ─── Loading state ──────────────────────────────────────────────────── -->
    <section v-if="isLoading" class="min-h-screen pt-32 pb-20 bg-white dark:bg-slate-900">
        <div class="max-w-3xl mx-auto px-5 animate-pulse space-y-6">
            <!-- Back link skeleton -->
            <div class="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700" />
            <!-- Cover skeleton -->
            <div class="w-full aspect-video rounded-2xl bg-gray-200 dark:bg-slate-700" />
            <!-- Title skeleton -->
            <div class="space-y-3 pt-4">
                <div class="h-3 w-28 rounded bg-gray-200 dark:bg-slate-700" />
                <div class="h-8 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
                <div class="h-8 w-1/2 rounded bg-gray-200 dark:bg-slate-700" />
                <div class="h-4 w-40 rounded bg-gray-200 dark:bg-slate-700" />
            </div>
            <!-- Body skeleton lines -->
            <div class="space-y-3 pt-6">
                <div v-for="n in 8" :key="n" class="h-4 rounded bg-gray-200 dark:bg-slate-700"
                    :style="{ width: n % 3 === 0 ? '65%' : '100%' }" />
            </div>
        </div>
    </section>

    <!-- ─── Error state ────────────────────────────────────────────────────── -->
    <section v-else-if="error"
        class="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-5 text-center bg-white dark:bg-slate-900">
        <p class="text-4xl mb-4" aria-hidden="true">⚠️</p>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ error }}</p>
        <RouterLink to="/blog"
            class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            ← Back to Blog
        </RouterLink>
    </section>

    <!-- ─── Not found state ───────────────────────────────────────────────── -->
    <section v-else-if="notFound"
        class="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-5 text-center bg-white dark:bg-slate-900">
        <p class="text-6xl font-extrabold text-indigo-500 mb-4" aria-hidden="true">404</p>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Post not found</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
            The article you're looking for doesn't exist or may have been moved.
        </p>
        <RouterLink to="/blog"
            class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            ← Browse all posts
        </RouterLink>
    </section>

    <!-- ─── Post ─────────────────────────────────────────────────────────── -->
    <article v-else-if="meta" class="min-h-screen pt-28 pb-24 bg-white dark:bg-slate-900">
        <div class="max-w-3xl mx-auto px-5">

            <!-- Back link -->
            <RouterLink to="/blog"
                class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                All posts
            </RouterLink>

            <!-- Cover image -->
            <img v-if="meta.coverImageBase64" :src="meta.coverImageBase64" :alt="meta.title"
                class="w-full aspect-video object-cover rounded-2xl mb-10" />

            <!-- Post header -->
            <header class="mb-10">
                <!-- Category -->
                <span v-if="meta.category"
                    class="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                    {{ meta.category }}
                </span>

                <!-- Title -->
                <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                    {{ meta.title }}
                </h1>

                <!-- Meta row: date · reading time · views -->
                <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <time :datetime="publishedTime">
                        {{ formatDate(meta.publishDate) }}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{{ meta.readingTime }} min read</span>
                    <span aria-hidden="true">·</span>
                    <span class="inline-flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ (meta.viewCount ?? 0).toLocaleString() }} views
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

            <!-- Bottom nav -->
            <div class="mt-16 pt-8 border-t border-gray-200 dark:border-slate-700">
                <RouterLink to="/blog"
                    class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">
                    ← Back to all posts
                </RouterLink>
            </div>
        </div>
    </article>
</template>

<style scoped>
/* ── inline code rendered by AbInlineContent ──────────────────────────────── */
:deep(.inline-code) {
    @apply bg-gray-100 dark:bg-slate-800 text-sm px-1.5 py-0.5 rounded font-mono;
}

/* ── links inside AbInlineContent ────────────────────────────────────────── */
:deep(.post-reader a) {
    @apply text-indigo-600 dark:text-indigo-400 underline hover:no-underline;
}
</style>
