<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, watch, onMounted, computed } from 'vue'
import { useGlobalHeadMeta } from './composables/useHead/useGlobalHeadMeta'
import { useGlobalLoading } from './composables/useGlobalLoading'
import { useSeoStore } from './stores/seo'

// Registers reactive head/SEO tags — updates automatically when the store loads
useGlobalHeadMeta()

const seoStore = useSeoStore()
const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const { isReady } = useGlobalLoading()
const isLoading = ref<boolean>(true)
const minTimeElapsed = ref<boolean>(false)

// Only the home page (/) has components that signal heroImage + initialContent ready.
// All other routes should resolve the loading screen immediately.
const isHomePage = computed(() => route.path === '/')

onMounted(() => {
  // Load SEO config from Firestore (non-blocking, head tags update reactively)
  seoStore.load()

  // Non-home routes don't have hero/content loading signals — bypass the spinner
  if (!isHomePage.value) {
    isLoading.value = false
    return
  }

  setTimeout(() => {
    minTimeElapsed.value = true
    if (isReady.value) isLoading.value = false
  }, 400)
})

watch(isLoading, (loading: boolean) => {
  if (!loading && window.location.hash) {
    const el = document.querySelector(window.location.hash)
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }
})

watch(isReady, (ready: boolean) => {
  if (ready && minTimeElapsed.value && isHomePage.value) {
    isLoading.value = false
  }
})
</script>

<template>
  <!-- ─── Admin routes: render directly, no loading screen or nav ─────────── -->
  <div v-if="isAdminRoute">
    <RouterView />
  </div>

  <!-- ─── Portfolio routes ──────────────────────────────────────────────────── -->
  <template v-else>
    <!-- Loading Screen -->
    <Transition name="loading-fade" appear>
      <div v-if="isLoading" class="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex items-center justify-center">
        <div class="text-center">
          <div class="flex items-center gap-2 justify-center mb-6">
            <img class="w-12 rounded-lg" src="@/assets/img/profile.png" alt="logo" />
            <span class="text-3xl font-bold text-indigo-900 dark:text-white">Banoub.</span>
          </div>
          <div class="relative">
            <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto">
            </div>
            <div class="mt-4 text-gray-600 dark:text-gray-300 text-sm">Loading Portfolio...</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main content -->
    <main class="portfolio-body" :class="{ 'invisible': isLoading }">
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
