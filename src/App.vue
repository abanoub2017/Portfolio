<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useGlobalHeadMeta } from './composables/useHead/useGlobalHeadMeta';

useGlobalHeadMeta('Abanoub - Portfolio Website',
  "Welcome to my portfolio website! I am a Software Engineer with experience in Front End ,Vue.js . Here you can find examples of my work and learn more about my background and qualifications.",
  "Abanoub, portfolio, Software Engineer,  Front End, Vue.js, Nuxt.js, Html5 , CSS3, Scss , Javacript, Js , Typescript"
)

// Simple loading state
const isLoading = ref(true)

onMounted(() => {
  // Hide loading screen after initial mount and a small delay
  setTimeout(() => {
    isLoading.value = false
  }, 500) // Adjust this timing as needed
})
</script>

<template>
  <!-- Loading Screen -->
  <Transition name="loading-fade" appear>
    <div v-if="isLoading" class="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex items-center justify-center">
      <div class="text-center">
        <!-- Logo/Brand -->
        <div class="flex items-center gap-2 justify-center mb-6">
          <img class="w-12 rounded-lg" src="@/assets/img/profile.png" alt="logo" />
          <span class="text-3xl font-bold text-indigo-900 dark:text-white">Banoub.</span>
        </div>

        <!-- Loading Animation -->
        <div class="relative">
          <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <div class="mt-4 text-gray-600 dark:text-gray-300 text-sm">Loading Portfolio...</div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Main App Content -->
  <Transition name="content-fade" appear>
    <div v-if="!isLoading">
      <ANav />
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <div :key="route.name">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
      <AFooter />
    </div>
  </Transition>
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

/* Content transitions */
.content-fade-enter-active {
  transition: opacity 0.5s ease;
}

.content-fade-enter-from {
  opacity: 0;
}
</style>
