<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { useGlobalHeadMeta } from './composables/useHead/useGlobalHeadMeta'
import { useGlobalLoading } from './composables/useGlobalLoading'

useGlobalHeadMeta(
  'Abanoub George — Front-End Developer & Vue.js Specialist',
  'Portfolio of Abanoub George, a Front-End Developer with 4+ years of experience building fast, responsive web apps with Vue.js, Nuxt.js and modern CSS.',
  'Abanoub George, portfolio, Front-End Developer, Vue.js, Nuxt.js, HTML5, CSS3, SCSS, JavaScript, TypeScript'
)

const { isReady } = useGlobalLoading()
const isLoading = ref<boolean>(true)
const minTimeElapsed = ref<boolean>(false)

onMounted(() => {
  setTimeout(() => {
    minTimeElapsed.value = true
    if (isReady.value) isLoading.value = false
  }, 400)
})

watch(isLoading, (loading: boolean) => {
  if (!loading && window.location.hash) {
    // After the loading screen dismisses, restore scroll position to
    // the hashed section (browser's native scroll was blocked by the
    // invisible overlay during initial load).
    const el = document.querySelector(window.location.hash)
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }
})

watch(isReady, (ready: boolean) => {
  if (ready && minTimeElapsed.value) {
    isLoading.value = false
  }
})
</script>

<template>
  <!-- Loading Screen — rendered on top as a fixed overlay -->
  <Transition name="loading-fade" appear>
    <div v-if="isLoading" class="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="flex items-center gap-2 justify-center mb-6">
          <img class="w-12 rounded-lg" src="@/assets/img/profile.png" alt="logo" />
          <span class="text-3xl font-bold text-indigo-900 dark:text-white">Banoub.</span>
        </div>
        <div class="relative">
          <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <div class="mt-4 text-gray-600 dark:text-gray-300 text-sm">Loading Portfolio...</div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Main App Content — always in the DOM so hero image can load and mark isReady -->
  <main :class="{ 'invisible': isLoading }">
    <ANav />
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <div :key="route.name">
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
    <AFooter />
  </main>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading screen transitions */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.3s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
