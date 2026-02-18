<template>
  <!-- works -->
  <div id="works" class="dark:bg-slate-900 section-spacing" ref="target">
    <div class="container mx-auto">
      <!-- top -->
      <div class="section-header">
        <span class="section-label">Portfolio</span>
        <h2 class="section-title">Works &amp; Projects</h2>
        <p class="section-subtitle">
          I help designers, small agencies and businesses bring their ideas to
          life. Powered by Figma, VS Code and coffee, I turn your requirements
          into well-designed websites.
        </p>
      </div>

      <!-- bottom -->
      <div class="p-5 sm:p-0 flex flex-wrap justify-between">
        <!-- Loading state -->
        <template v-if="!isIntersecting">
          <AbCardSkeleton v-for="n in 8" :key="n" />
        </template>

        <!-- Actual content when visible -->
        <template v-else>
          <template v-for="work in workList" :key="work.content">
            <AbCard :link="work.link" :img="getImageUrl(work.img)">
              <template #content>
                {{ work.content }}
              </template>
            </AbCard>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { workList } from '@/data/works'

const { target, isIntersecting } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: '100px',
})

const getImageUrl = (name: string): string => {
  return new URL(`../../assets/img/work/${name}`, import.meta.url).href
}
</script>

<style lang="scss" scoped></style>