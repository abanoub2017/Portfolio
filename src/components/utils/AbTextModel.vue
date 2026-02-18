<template>
    <div class="w-full max-w-md flex flex-col gap-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7">
        <div>
            <p class="text-indigo-400 font-semibold text-xs uppercase tracking-widest mb-1">Senior Frontend Engineer</p>
            <h1 class="text-3xl lg:text-4xl font-bold text-white leading-tight">Hi, I'm Abanoub</h1>
        </div>
        <p class="text-slate-300 text-sm leading-relaxed">
            I build fast, accessible, and scalable web products with Vue 3, TypeScript, and Tailwind CSS.
            5+ years delivering pixel-perfect interfaces and production-grade frontend architecture.
        </p>
        <div class="flex flex-wrap gap-3">
            <a class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
                href="#contact" @click="trackHireMe">Hire Me</a>
            <a class="border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                href="#works">See My Work</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '@/composables/useAnalytics'

const { trackHireMe } = useAnalytics()
</script>

<style lang="scss" scoped></style>