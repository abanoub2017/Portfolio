<template>
  <AHero />
  <AAbout />
  <AServices />
  <ASkills />
  <AWorks />
  <ATestimonials />
  <AContact />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AHero from '@/components/base/AHero.vue'
import AAbout from '@/components/base/AAbout.vue'
import AServices from '@/components/base/AServices.vue'
import ASkills from '@/components/base/ASkills.vue'
import AWorks from '@/components/base/AWorks.vue'
import ATestimonials from '@/components/base/ATestimonials.vue'
import AContact from '@/components/base/AContact.vue'
import { useSectionsStore } from '@/stores/sections'

const sectionsStore = useSectionsStore()

onMounted(() => sectionsStore.startPublicListener())
onUnmounted(() => sectionsStore.stopListener())
</script>

<style lang="scss" scoped></style>