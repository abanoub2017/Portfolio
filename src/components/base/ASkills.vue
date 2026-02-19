<template>
    <section id="skills" class="bg-gray-50 dark:bg-slate-900 section-spacing" ref="target">
        <div class="container mx-auto">

            <!-- header -->
            <div class="section-header mb-14">
                <p class="section-label">Skills</p>
                <h2 class="section-title">Areas of Expertise</h2>
                <p class="section-subtitle">Technologies and tools I work with on a daily basis</p>
            </div>

            <!-- category cards grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <div v-for="category in categories" :key="category.title"
                    class="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-gray-100 dark:border-slate-600 flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1"
                    :class="{ 'opacity-0 translate-y-4': !isIntersecting, 'opacity-100 translate-y-0': isIntersecting }"
                    style="transition: opacity 0.5s ease, transform 0.5s ease">
                    <!-- icon + title -->
                    <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            :class="category.iconBg">
                            {{ category.icon }}
                        </span>
                        <h3 class="font-bold text-gray-800 dark:text-white text-sm">{{ category.title }}</h3>
                    </div>

                    <!-- skill rows with proficiency bar -->
                    <div class="flex flex-col gap-3">
                        <div v-for="skill in category.skills" :key="skill.label" class="flex flex-col gap-1">
                            <div class="flex justify-between items-center">
                                <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ skill.label
                                    }}</span>
                                <span class="text-xs text-gray-400 dark:text-gray-500">{{ skill.level }}%</span>
                            </div>
                            <div class="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-700" :class="category.barColor"
                                    :style="{ width: isIntersecting ? skill.level + '%' : '0%' }" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- extra tools row -->
            <div
                class="mt-8 bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-gray-100 dark:border-slate-600">
                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Also
                    worked with</p>
                <div class="flex flex-wrap gap-2">
                    <span v-for="tool in extras" :key="tool"
                        class="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full">{{
                            tool }}</span>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useSectionsStore } from '@/stores/sections'
import type { SkillsContent } from '@/types/sections'

const { target, isIntersecting } = useIntersectionObserver({ threshold: 0.15, rootMargin: '50px' })

const store = useSectionsStore()
const skillsData = computed(() => store.byType<SkillsContent>('skills').value)
const categories = computed(() => skillsData.value?.categories ?? [])
const extras = computed(() => skillsData.value?.extras ?? [])
</script>

<style lang="scss" scoped></style>
