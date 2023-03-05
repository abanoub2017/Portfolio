<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <ANav />

  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <div :key="route.name">
        <component :is="Component" />
      </div>
    </Transition>
  </RouterView>
  <AFooter />
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
</style>
