<template>
    <div id="home" class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">

        <!-- two-column grid -->
        <div class="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">

            <!-- LEFT: photo -->
            <div class="relative flex items-end justify-center order-2 lg:order-1">
                <img class="w-full max-w-sm lg:max-w-none lg:w-auto lg:h-full object-contain object-bottom transition-opacity duration-500"
                    :class="{ 'opacity-0': !heroImageLoaded, 'opacity-100': heroImageLoaded }"
                    src="@/assets/img/man2.png" alt="Abanoub George — Senior Frontend Developer" @load="onHeroImageLoad"
                    loading="eager" />
                <!-- fade right edge so image blends into bg -->
                <div
                    class="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-slate-800 pointer-events-none" />
                <!-- fade bottom -->
                <div
                    class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
                <div v-if="!heroImageLoaded" class="absolute inset-0 bg-slate-800 animate-pulse" />
            </div>

            <!-- RIGHT: typewriter + card -->
            <div class="flex flex-col justify-center gap-8 px-8 py-16 lg:py-0 lg:px-16 order-1 lg:order-2">
                <AbTypewriter />
                <AbTextModel />
            </div>
        </div>

        <!-- decorative circle -->
        <div class="absolute -bottom-32 -left-32 w-big h-big bg-indigo-900/20 rounded-full pointer-events-none" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGlobalLoading } from '@/composables/useGlobalLoading'
import AbTypewriter from '@/components/utils/AbTypewriter.vue'
import AbTextModel from '@/components/utils/AbTextModel.vue'

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
