<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useBlogStore } from '@/stores/blog'
import { useSeoStore } from '@/stores/seo'
import AbBlogCard from '@/components/blog/AbBlogCard.vue'
import AbBlogCardSkeleton from '@/components/blog/AbBlogCardSkeleton.vue'

const blogStore = useBlogStore()
const seoStore = useSeoStore()

onMounted(() => blogStore.loadPublished())

// ─── Featured post (first featured one, if any) ───────────────────────────────
const featuredPost = computed(() =>
    blogStore.posts.find((p) => p.featured) ?? null
)

// Non-featured posts (or all posts if none are featured)
const listPosts = computed(() =>
    featuredPost.value
        ? blogStore.posts.filter((p) => p.id !== featuredPost.value!.id)
        : blogStore.posts
)

// ─── Head ─────────────────────────────────────────────────────────────────────
useHead({
    title: computed(() => `Blog — ${seoStore.config.title}`),
    meta: [
        {
            name: 'description',
            content: computed(() => seoStore.config.description),
        },
        {
            property: 'og:title',
            content: computed(() => `Blog — ${seoStore.config.title}`),
        },
        {
            property: 'og:type',
            content: 'website',
        },
    ],
})
</script>

<template>
    <section class="bg-gray-50 dark:bg-slate-900 section-spacing min-h-screen">
        <div class="container mx-auto px-5">

            <!-- ─── Section header ─────────────────────────────────────────────────── -->
            <div class="section-header mb-14">
                <span class="section-label">Blog</span>
                <h1 class="section-title">Thoughts &amp; Writings</h1>
                <p class="section-subtitle">
                    Articles on frontend engineering, tooling, and career growth.
                </p>
            </div>

            <!-- ─── Loading state ─────────────────────────────────────────────────── -->
            <template v-if="blogStore.isLoading">
                <!-- Featured skeleton -->
                <div
                    class="mb-10 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 animate-pulse">
                    <div
                        class="aspect-[21/9] bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600" />
                    <div class="p-8 flex flex-col gap-4">
                        <div class="h-5 w-20 rounded-full bg-gray-200 dark:bg-slate-700" />
                        <div class="h-7 w-2/3 rounded-lg bg-gray-200 dark:bg-slate-700" />
                        <div class="h-4 w-full rounded bg-gray-100 dark:bg-slate-700/60" />
                        <div class="h-4 w-3/4 rounded bg-gray-100 dark:bg-slate-700/60" />
                    </div>
                </div>
                <!-- Grid skeletons -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AbBlogCardSkeleton v-for="n in 6" :key="n" />
                </div>
            </template>

            <!-- ─── Error state ───────────────────────────────────────────────────── -->
            <div v-else-if="blogStore.error"
                class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-10 text-center">
                <p class="text-red-500 dark:text-red-400 text-sm">Could not load posts right now.</p>
                <button @click="blogStore.loadPublished()"
                    class="mt-3 text-sm text-red-500 dark:text-red-400 underline hover:no-underline">
                    Try again
                </button>
            </div>

            <!-- ─── Empty state ───────────────────────────────────────────────────── -->
            <div v-else-if="blogStore.posts.length === 0" class="py-20 flex flex-col items-center text-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-indigo-300 dark:text-indigo-700" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="1.2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400">No posts published yet. Check back soon!</p>
            </div>

            <!-- ─── Posts ──────────────────────────────────────────────────────────── -->
            <template v-else>
                <!-- Featured post (wide hero card) -->
                <div v-if="featuredPost" class="mb-10">
                    <AbBlogCard :post="featuredPost"
                        class="sm:flex-row [&_.aspect-video]:sm:w-2/5 [&_.aspect-video]:sm:aspect-auto [&_.aspect-video]:sm:min-h-56" />
                </div>

                <!-- Regular grid -->
                <div v-if="listPosts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AbBlogCard v-for="post in listPosts" :key="post.id" :post="post" />
                </div>
            </template>

        </div>
    </section>
</template>
