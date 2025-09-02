<template>
    <template v-if="img">
        <a :href="link" target="_blank"
            class="w-full md:w-5/12 lg:w-1/5  mb-12 shadow-xl rounded-lg my-3 md:my-10 m-1 transition-all hover:scale-110">
            <div class="relative overflow-hidden rounded-t-lg">
                <img :src="img" class="object-cover h-[150px] w-full transition-opacity duration-300"
                    :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }" @load="imageLoaded = true"
                    @error="imageError = true" loading="lazy" />
                <!-- Loading skeleton while image loads -->
                <div v-if="!imageLoaded && !imageError"
                    class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                <!-- Error state -->
                <div v-if="imageError"
                    class="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                    <span class="text-sm">Failed to load</span>
                </div>
            </div>
            <p class="dark:text-white text-center capitalize py-3">
                <slot name="content" />
            </p>
        </a>
    </template>
    <template v-else>
        <AbCardSkeleton v-for="item in 8" />
    </template>
</template>

<script setup>
import { ref } from 'vue'

const imageLoaded = ref(false)
const imageError = ref(false)

const props = defineProps({
    link: {
        type: String,
        // default:''
    },
    img: {
        type: String,
        // default:''
    },
})

</script>

<style lang="scss" scoped></style>