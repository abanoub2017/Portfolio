<template>
    <div class="font-bold">
        <span class="block text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">Front End</span>
        <span class="block text-3xl sm:text-4xl lg:text-5xl text-indigo-400 min-h-[1.2em]">{{ typeValue }}<span
                class="typed-cursor">|</span></span>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const typeValue = ref<string>('')
const displayTextArray: string[] = ['Developer', 'Engineer', 'Designer', 'Freelancer']
const typingSpeed = 100
const erasingSpeed = 100
const newTextDelay = 2000
let displayTextArrayIndex = 0
let charIndex = 0
let timerId: ReturnType<typeof setTimeout> | undefined = undefined

function typeText() {
    const current = displayTextArray[displayTextArrayIndex]
    if (!current) return
    if (charIndex < current.length) {
        typeValue.value += current.charAt(charIndex)
        charIndex++
        timerId = setTimeout(typeText, typingSpeed)
    } else {
        timerId = setTimeout(eraseText, newTextDelay)
    }
}

function eraseText() {
    const current = displayTextArray[displayTextArrayIndex]
    if (!current) return
    if (charIndex > 0) {
        typeValue.value = current.substring(0, charIndex - 1)
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