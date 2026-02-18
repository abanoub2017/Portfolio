<template>
    <div
        class="absolute top-1/3 left-5 text-xl sm:left-10 sm:text-4xl md:left-1/4 md:text-6xl lg:left-5 xl:left-48 xl:text-7xl font-bold">
        <span class="text-gray-600">Front End </span>
        <p class="typed-text text-red-500">{{ typeValue }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const typeValue = ref<string>('')
const displayTextArray: string[] = ['Developer', 'Blogger', 'Designer', 'Freelancer']
const typingSpeed = 100
const erasingSpeed = 100
const newTextDelay = 2000
let displayTextArrayIndex = 0
let charIndex = 0
let timerId: ReturnType<typeof setTimeout> | null = null

function typeText() {
    if (charIndex < displayTextArray[displayTextArrayIndex].length) {
        typeValue.value += displayTextArray[displayTextArrayIndex].charAt(charIndex)
        charIndex++
        timerId = setTimeout(typeText, typingSpeed)
    } else {
        timerId = setTimeout(eraseText, newTextDelay)
    }
}

function eraseText() {
    if (charIndex > 0) {
        typeValue.value = displayTextArray[displayTextArrayIndex].substring(0, charIndex - 1)
        charIndex--
        timerId = setTimeout(eraseText, erasingSpeed)
    } else {
        displayTextArrayIndex = (displayTextArrayIndex + 1) % displayTextArray.length
        timerId = setTimeout(typeText, typingSpeed + 1000)
    }
}

onMounted(() => {
    timerId = setTimeout(typeText, newTextDelay + 200)
})

onUnmounted(() => {
    clearTimeout(timerId)
})
</script>

<style lang="scss" scoped>
@use '@/assets/scss/AbTypeWriter.scss';
</style>