<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { BlogPostMeta } from '@/types/blog'

const props = defineProps<{ post: BlogPostMeta }>()
const router = useRouter()

const imageLoaded = ref(false)
const imageError = ref(false)

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function navigate() {
    router.push({ name: 'blog-post', params: { slug: props.post.slug } })
}
</script>

<template>
    <article
        class="group relative rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 flex flex-col cursor-pointer"
        @click="navigate">

        <!-- Cover image -->
        <div class="card-cover relative overflow-hidden h-48 w-full">
            <img v-if="post.coverImageBase64" :src="post.coverImageBase64" :alt="post.title"
                class="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105"
                :class="imageLoaded ? 'opacity-100' : 'opacity-0'" loading="lazy" @load="imageLoaded = true"
                @error="imageError = true" />

            <!-- Image loading skeleton -->
            <div v-if="post.coverImageBase64 && !imageLoaded && !imageError"
                class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 animate-pulse" />

            <!-- No cover placeholder -->
            <div v-if="!post.coverImageBase64 || imageError"
                class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                <svg class="w-10 h-10 text-indigo-200 dark:text-slate-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>

            <!-- Featured badge -->
            <div v-if="post.featured"
                class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                Featured
            </div>
        </div>

        <!-- Card body -->
        <div class="flex flex-col flex-1 p-5 gap-3">

            <!-- Category badge -->
            <span v-if="post.category"
                class="self-start text-[11px] font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
                {{ post.category }}
            </span>

            <!-- Title -->
            <h3
                class="font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {{ post.title }}
            </h3>

            <!-- Excerpt -->
            <p v-if="post.excerpt" class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
                {{ post.excerpt }}
            </p>

            <!-- Footer: reading time + date + arrow -->
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-slate-700">
                <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <!-- Clock icon -->
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ post.readingTime }} min read</span>
                    <span class="text-gray-300 dark:text-slate-600">·</span>
                    <span>{{ formatDate(post.publishDate) }}</span>
                </div>

                <!-- Read more arrow -->
                <span
                    class="text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </span>
            </div>
        </div>
    </article>
</template>
