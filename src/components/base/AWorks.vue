<template>
  <!-- works -->
  <section id="works" class="bg-white dark:bg-slate-900 section-spacing" ref="target">
    <div class="container mx-auto">

      <!-- header -->
      <div class="section-header mb-14">
        <span class="section-label">Portfolio</span>
        <h2 class="section-title">Works &amp; Projects</h2>
        <p class="section-subtitle">
          A selection of real-world products I've helped design and build.
        </p>
      </div>

      <!-- grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        <!-- skeletons -->
        <template v-if="!isIntersecting">
          <AbCardSkeleton v-for="n in 8" :key="n" />
        </template>

        <!-- cards -->
        <template v-else>
          <AbCard v-for="work in workList" :key="work.id" :link="work.link" :img="work.imageBase64" :title="work.title"
            :tag="work.tag" />
        </template>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useSectionsStore } from '@/stores/sections'
import type { WorksContent } from '@/types/sections'

const { target, isIntersecting } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: '100px',
})

const store = useSectionsStore()
const workList = computed(() => store.byType<WorksContent>('works').value?.items ?? [])
</script>

<style lang="scss" scoped></style>