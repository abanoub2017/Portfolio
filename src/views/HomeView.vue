<template>
  <!-- into section -->
  <div id="home"
    class="h-[50vh] lg:h-screen bg-gradient-to-t from-indigo-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
    <!-- image with lazy loading -->
    <div
      class="absolute bottom-0 right-0 lg:left-0 mx-auto h-5/6 w-full flex items-end justify-center lg:justify-start">
      <img class="h-full object-cover transition-opacity duration-500"
        :class="{ 'opacity-0': !heroImageLoaded, 'opacity-100': heroImageLoaded }" src="@/assets/img/man2.png"
        alt="Portfolio Hero" @load="onHeroImageLoad" loading="eager" />
      <!-- Loading placeholder for hero image -->
      <div v-if="!heroImageLoaded" class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
      </div>
    </div>
    <!-- circle -->
    <div
      class="hidden lg:block absolute -bottom-1/4 right-0 left-0 mx-auto w-big h-big bg-indigo-900 rounded-full -z-10">
    </div>
    <!-- animated text -->
    <AbTypewriter />
    <!-- texts -->
    <AbTextModel />
  </div>
  <!-- About -->
  <AAbout />
  <!-- Services -->
  <AServices />
  <!-- Skills -->
  <ASkills />
  <!-- Works -->
  <AWorks />
  <!-- Testimonials -->
  <ATestimonials />
  <!-- Contact -->
  <AContact />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobalLoading } from '@/composables/useGlobalLoading'

const heroImageLoaded = ref<boolean>(false)
const { markHeroImageReady, markInitialContentReady } = useGlobalLoading()

const onHeroImageLoad = (): void => {
  heroImageLoaded.value = true
  markHeroImageReady()
}

onMounted(() => {
  setTimeout(() => {
    markInitialContentReady()
  }, 100)
})
</script>

<style lang="scss" scoped></style>