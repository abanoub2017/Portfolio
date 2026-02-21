<template>
    <nav class="nav">
        <div class="nav__container">
            <RouterLink to="/" class="flex items-center gap-1 px-1">
                <img class="w-8 rounded-lg" src="@/assets/img/profile.png" alt="logo" />
                <span class="text-2xl font-bold text-indigo-900 dark:text-white">Banoub.</span>
            </RouterLink>
            <ul class="nav__main-menu">
                <li v-for="item in navItems" :key="item.id" class="nav__main-menu__link"
                    :class="{ 'nav__main-menu__link--active': isHomePage && activeSection === item.id }">
                    <a v-if="isHomePage" v-smooth-scroll :href="`#${item.id}`" @click="activeSection = item.id">{{
                        item.label }}</a>
                    <a v-else href="javascript:void(0)" @click="onNavClick(item.id)">{{ item.label }}</a>
                </li>
                <li class="nav__main-menu__link"
                    :class="{ 'nav__main-menu__link--active': route.path.startsWith('/blog') }">
                    <RouterLink to="/blog">Blog</RouterLink>
                </li>
            </ul>
            <div class="flex items-center justify-center gap-5">
                <!-- Dark Mode -->
                <AbDarkMode />
                <!-- Hamburger Menu -->
                <AbHamburger />
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface NavItem {
    id: string
    label: string
}

const navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About me' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'works', label: 'Works' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
]

const activeSection = ref<string>('home')
const route = useRoute()
const router = useRouter()
const isHomePage = computed(() => route.path === '/')

function onNavClick(id: string) {
    router.push({ path: '/', hash: `#${id}` })
}
let observer: IntersectionObserver | null = null

function setupObserver(): number {
    observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeSection.value = entry.target.id
                }
            })
        },
        { threshold: 0, rootMargin: '-20% 0px -75% 0px' }
    )

    let observedCount = 0
    navItems.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) {
            observer!.observe(el)
            observedCount++
        }
    })
    return observedCount
}

onMounted(() => {
    // Sections render inside a lazy-loaded RouterView, so they may not
    // be in the DOM yet when ANav mounts. Retry until all sections are found.
    const trySetup = (): void => {
        const count = setupObserver()
        if (count < navItems.length) {
            observer?.disconnect()
            setTimeout(trySetup, 200)
        }
    }
    trySetup()

    // If the page loaded with a hash, set the active section immediately
    if (window.location.hash) {
        const hashId = window.location.hash.slice(1)
        const match = navItems.find((item) => item.id === hashId)
        if (match) activeSection.value = match.id
    }
})

onUnmounted(() => {
    observer?.disconnect()
})
</script>

<style lang="scss" scoped>
.nav__main-menu__link--active a {
    color: #4f46e5;
    /* indigo-600 */
    font-weight: 700;
    border-bottom: 2px solid #4f46e5;
    padding-bottom: 2px;
}
</style>