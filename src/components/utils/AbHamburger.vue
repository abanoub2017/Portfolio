<template>
    <button id="hamburger" ref="hamburgerRef" class="nav__hamburger lg:hidden" :aria-expanded="openMenu"
        aria-controls="mobile-menu" :aria-label="openMenu ? 'Close menu' : 'Open menu'" @click="toggleMenu()">
        <template v-if="!openMenu">
            <div class="w-6 h-0.5 bg-black dark:bg-white"></div>
            <div class="w-6 h-0.5 bg-black dark:bg-white"></div>
            <div class="w-6 h-0.5 bg-black dark:bg-white"></div>
        </template>
        <template v-else>
            <div class="w-6 h-0.5 transform rotate-45 bg-white"></div>
            <div class="w-6 h-0.5 transform rotate-[130deg] translate-y-[-6px] bg-white"></div>
        </template>
    </button>

    <ul id="mobile-menu" role="navigation" :class="openMenu ? '' : 'hidden'"
        class="bg-indigo-900 absolute left-0 top-0 w-full p-10 rounded-b-3xl space-y-10 text-white text-center z-40">
        <li>
            <a @click="closeMenu()" v-smooth-scroll href="#home">Home</a>
        </li>
        <li>
            <a @click="closeMenu()" v-smooth-scroll href="#about">About me</a>
        </li>
        <li>
            <a @click="closeMenu()" v-smooth-scroll href="#skills">Skills</a>
        </li>
        <li>
            <a @click="closeMenu()" v-smooth-scroll href="#works">Works</a>
        </li>
        <li>
            <a @click="closeMenu()" v-smooth-scroll href="#contact">Contact</a>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const openMenu = ref<boolean>(false)
const hamburgerRef = ref<HTMLElement | null>(null)

const toggleMenu = () => {
    openMenu.value = !openMenu.value
}
const closeMenu = () => {
    openMenu.value = false
}

// Close when clicking anywhere outside the hamburger button
onClickOutside(hamburgerRef, () => {
    if (openMenu.value) closeMenu()
})
</script>

<style lang="scss" scoped></style>