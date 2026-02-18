<template>
    <a :href="link" target="_blank" rel="noopener noreferrer"
        class="group relative rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 flex flex-col"
        @click="trackCardClick">

        <!-- image -->
        <div class="relative overflow-hidden aspect-[16/10]">
            <img :src="img"
                class="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105"
                :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }" @load="imageLoaded = true"
                @error="imageError = true" loading="lazy" :alt="title" />

            <!-- skeleton -->
            <div v-if="!imageLoaded && !imageError"
                class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 animate-pulse" />
            <!-- error -->
            <div v-if="imageError"
                class="absolute inset-0 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <span class="text-xs text-gray-400">No preview</span>
            </div>

            <!-- hover overlay -->
            <div
                class="absolute inset-0 bg-indigo-900/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-white font-semibold text-sm tracking-wide">View Live</span>
                <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" stroke-width="1.5"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </div>
        </div>

        <!-- footer -->
        <div class="flex items-center justify-between px-4 py-3">
            <p class="font-semibold text-sm text-gray-800 dark:text-white truncate">{{ title }}</p>
            <span v-if="tag"
                class="shrink-0 ml-2 text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                {{ tag }}
            </span>
        </div>
    </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const imageLoaded = ref<boolean>(false)
const imageError = ref<boolean>(false)

const props = defineProps<{
    link: string
    img: string
    title: string
    tag?: string
}>()

const { trackCard } = useAnalytics()
function trackCardClick(): void {
    trackCard(props.link)
}
</script>

<style lang="scss" scoped></style>