<script setup lang="ts">
/**
 * AbShareButtons.vue
 *
 * Two variants:
 *  - 'header'  → compact icon-only row under the post title (quick share)
 *  - 'banner'  → prominent card at the end of the post (main CTA)
 */
import { ref } from 'vue'

const props = defineProps<{
    title: string
    url: string
    variant?: 'header' | 'banner'
}>()

const variant = props.variant ?? 'header'

// ─── Copy link ────────────────────────────────────────────────────────────────

const copied = ref(false)

async function copyLink() {
    try {
        await navigator.clipboard.writeText(props.url)
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
    } catch {
        // Fallback for browsers that block clipboard without user gesture
        const el = document.createElement('textarea')
        el.value = props.url
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
    }
}

// ─── Social share URLs ────────────────────────────────────────────────────────

function twitterUrl() {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`
}

function linkedInUrl() {
    return `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`
}
</script>

<template>
    <!-- ══ HEADER variant — compact icon-only row ══════════════════════════ -->
    <div v-if="variant === 'header'" class="flex items-center gap-1.5" role="group" aria-label="Share this post">
        <span class="text-xs font-medium text-gray-400 dark:text-gray-500 mr-1 select-none">Share</span>

        <!-- Copy link -->
        <div class="relative group/tip">
            <button type="button" :aria-label="copied ? 'Link copied!' : 'Copy link'" @click="copyLink"
                class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
                :class="copied ? 'bg-emerald-500/15 text-emerald-500' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-300'">
                <svg v-if="copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </button>
            <span
                class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-slate-700 px-2 py-1 text-xs text-white opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 select-none">{{
                    copied ? 'Copied!' : 'Copy link' }}</span>
        </div>

        <!-- X -->
        <div class="relative group/tip">
            <a :href="twitterUrl()" target="_blank" rel="noopener noreferrer" aria-label="Share on X (Twitter)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-150">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>
            <span
                class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-slate-700 px-2 py-1 text-xs text-white opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 select-none">Share
                on X</span>
        </div>

        <!-- LinkedIn -->
        <div class="relative group/tip">
            <a :href="linkedInUrl()" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-[#0a66c2] dark:hover:text-[#0a66c2] transition-all duration-150">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            </a>
            <span
                class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-slate-700 px-2 py-1 text-xs text-white opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 select-none">Share
                on LinkedIn</span>
        </div>
    </div>

    <!-- ══ BANNER variant — prominent end-of-post CTA ══════════════════════ -->
    <div v-else
        class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-6 py-6 text-center"
        role="group" aria-label="Share this post">

        <!-- Heading -->
        <p class="text-base font-semibold text-gray-800 dark:text-white mb-1">Enjoyed this article?</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Share it with your network — it helps more than you
            think 🙌</p>

        <!-- Buttons row -->
        <div class="flex flex-wrap items-center justify-center gap-3">

            <!-- Copy link -->
            <button type="button" @click="copyLink"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150"
                :class="copied
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'">
                <svg v-if="copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {{ copied ? 'Link copied!' : 'Copy link' }}
            </button>

            <!-- X / Twitter -->
            <a :href="twitterUrl()" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-150">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
            </a>

            <!-- LinkedIn -->
            <a :href="linkedInUrl()" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-[#0a66c2] hover:text-[#0a66c2] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Share on LinkedIn
            </a>
        </div>
    </div>
</template>
