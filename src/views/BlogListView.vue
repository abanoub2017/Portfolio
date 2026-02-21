<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useBlogStore } from '@/stores/blog'
import { useSeoStore } from '@/stores/seo'
import AbBlogCard from '@/components/blog/AbBlogCard.vue'
import AbBlogCardSkeleton from '@/components/blog/AbBlogCardSkeleton.vue'

const blogStore = useBlogStore()
const seoStore = useSeoStore()

onMounted(() => blogStore.loadPublished())

// ─── Search & filter state ────────────────────────────────────────────────────
const searchQuery = ref('')
const activeCategory = ref<string | null>(null)
const activeTag = ref<string | null>(null)

// All unique categories from published posts
const categories = computed<string[]>(() => {
    const set = new Set(blogStore.posts.map((p) => p.category).filter(Boolean))
    return [...set].sort()
})

// All unique tags from published posts
const allTags = computed<string[]>(() => {
    const set = new Set(blogStore.posts.flatMap((p) => p.tags).filter(Boolean))
    return [...set].sort()
})

const isFiltering = computed(
    () => !!searchQuery.value.trim() || !!activeCategory.value || !!activeTag.value,
)

// Posts matching the current search + category + tag filter
const filteredPosts = computed(() => {
    let posts = blogStore.posts
    if (activeCategory.value) {
        posts = posts.filter((p) => p.category === activeCategory.value)
    }
    if (activeTag.value) {
        posts = posts.filter((p) => p.tags.includes(activeTag.value!))
    }
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
        posts = posts.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q)),
        )
    }
    return posts
})

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

// ─── Infinite / virtual scroll ───────────────────────────────────────────────
const PAGE_SIZE = 6
const visibleCount = ref(PAGE_SIZE)
const sentinelEl = ref<HTMLElement | null>(null)

// The list that virtual scroll is applied to (filter mode vs default mode)
const activeList = computed(() =>
    isFiltering.value ? filteredPosts.value : listPosts.value
)
const visiblePosts = computed(() => activeList.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < activeList.value.length)

// Reset to first page whenever filters/search change
watch([searchQuery, activeCategory, activeTag], () => {
    visibleCount.value = PAGE_SIZE
})

let _observer: IntersectionObserver | null = null

onMounted(() => {
    _observer = new IntersectionObserver(
        (entries) => {
            if (entries[0]?.isIntersecting && hasMore.value) {
                visibleCount.value += PAGE_SIZE
            }
        },
        { rootMargin: '300px' },
    )
    watch(
        sentinelEl,
        (el, _, onCleanup) => {
            if (el) {
                _observer!.observe(el)
                onCleanup(() => _observer!.unobserve(el))
            }
        },
        { immediate: true },
    )
})

onUnmounted(() => {
    _observer?.disconnect()
    _observer = null
})

function toggleCategory(cat: string) {
    activeCategory.value = activeCategory.value === cat ? null : cat
}

function toggleTag(tag: string) {
    activeTag.value = activeTag.value === tag ? null : tag
}

function clearFilters() {
    searchQuery.value = ''
    activeCategory.value = null
    activeTag.value = null
}

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
            <div class="section-header mb-10">
                <span class="section-label">Blog</span>
                <h1 class="section-title">Thoughts &amp; Writings</h1>
                <p class="section-subtitle">
                    Articles on frontend engineering, tooling, and career growth.
                </p>
            </div>

            <!-- ─── Search & filter bar ───────────────────────────────────────────── -->
            <div v-if="!blogStore.isLoading && blogStore.posts.length"
                class="mb-12 rounded-2xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 backdrop-blur-sm p-5 shadow-sm space-y-4">

                <!-- Row 1: search -->
                <div class="relative">
                    <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input v-model="searchQuery" type="search" placeholder="Search by title, excerpt or tag…"
                        class="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/60 text-gray-800 dark:text-white text-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500 transition" />
                    <!-- Clear search x -->
                    <button v-if="searchQuery" @click="searchQuery = ''"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Row 2: category pills -->
                <div v-if="categories.length" class="flex flex-wrap items-center gap-2">
                    <span
                        class="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mr-1 shrink-0">
                        Category
                    </span>
                    <button @click="activeCategory = null"
                        class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                        :class="!activeCategory
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40'
                            : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300'">
                        All
                    </button>
                    <button v-for="cat in categories" :key="cat" @click="toggleCategory(cat)"
                        class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                        :class="activeCategory === cat
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40'
                            : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300'">
                        {{ cat }}
                    </button>
                </div>

                <!-- Row 3: tag pills + results count -->
                <div v-if="allTags.length" class="flex flex-wrap items-center gap-2">
                    <span
                        class="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mr-1 shrink-0">
                        Tags
                    </span>
                    <button v-for="tag in allTags" :key="tag" @click="toggleTag(tag)"
                        class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border"
                        :class="activeTag === tag
                            ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200 dark:shadow-violet-900/40'
                            : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300'">
                        #{{ tag }}
                    </button>

                    <!-- Results count (right side) -->
                    <span v-if="isFiltering" class="ml-auto text-xs text-gray-400 dark:text-slate-500 shrink-0">
                        {{ filteredPosts.length }}&nbsp;result{{ filteredPosts.length !== 1 ? 's' : '' }}
                        <button @click="clearFilters"
                            class="ml-1.5 text-indigo-500 dark:text-indigo-400 hover:underline font-medium">
                            Clear
                        </button>
                    </span>
                </div>
            </div>

            <!-- ─── Loading state ─────────────────────────────────────────────────── -->
            <template v-if="blogStore.isLoading">
                <!-- Featured skeleton -->
                <div
                    class="mb-10 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 animate-pulse">
                    <div
                        class="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600" />
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

                <!-- ── Filtered / search results ── -->
                <template v-if="isFiltering">
                    <!-- No results -->
                    <div v-if="filteredPosts.length === 0" class="py-20 flex flex-col items-center text-center gap-4">
                        <div
                            class="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                            <svg class="w-8 h-8 text-indigo-300 dark:text-indigo-700" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="1.2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400">
                            No posts match your search.
                            <button @click="clearFilters"
                                class="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
                                Clear filters
                            </button>
                        </p>
                    </div>
                    <!-- Filtered grid -->
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AbBlogCard v-for="post in visiblePosts" :key="post.id" :post="post" />
                    </div>
                </template>

                <!-- ── Default: featured hero + grid ── -->
                <template v-else>
                    <!-- Featured post (wide hero card) -->
                    <div v-if="featuredPost" class="mb-10">
                        <AbBlogCard :post="featuredPost"
                            class="sm:flex-row [&_.card-cover]:sm:w-2/5 [&_.card-cover]:sm:h-64" />
                    </div>

                    <!-- Regular grid -->
                    <div v-if="listPosts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AbBlogCard v-for="post in visiblePosts" :key="post.id" :post="post" />
                    </div>
                </template>

                <!-- ── Infinite scroll sentinel ── -->
                <div ref="sentinelEl" class="mt-10 flex justify-center" aria-hidden="true">
                    <!-- Spinner shown while more posts remain -->
                    <transition enter-active-class="transition-opacity duration-300"
                        leave-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
                        leave-to-class="opacity-0">
                        <div v-if="hasMore" class="flex items-center gap-2 text-gray-400 dark:text-slate-500 text-sm">
                            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Loading more posts…</span>
                        </div>
                    </transition>
                </div>

            </template>

        </div>
    </section>
</template>
