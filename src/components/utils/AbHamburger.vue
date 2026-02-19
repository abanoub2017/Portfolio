<template>
    <!-- Hamburger button -->
    <button ref="hamburgerRef" class="nav__hamburger lg:hidden relative z-50" :aria-expanded="openMenu"
        aria-controls="mobile-menu" :aria-label="openMenu ? 'Close menu' : 'Open menu'" @click="toggleMenu">
        <!-- Animated bars → X -->
        <span class="block w-6 h-0.5 transition-all duration-300 origin-center"
            :class="openMenu ? 'rotate-45 translate-y-[3px] bg-white' : 'bg-black dark:bg-white'" />
        <span class="block w-6 h-0.5 my-1.5 transition-all duration-300"
            :class="openMenu ? 'opacity-0 scale-x-0 bg-white' : 'bg-black dark:bg-white'" />
        <span class="block w-6 h-0.5 transition-all duration-300 origin-center"
            :class="openMenu ? '-rotate-45 -translate-y-[9px] bg-white' : 'bg-black dark:bg-white'" />
    </button>

    <!-- Backdrop -->
    <Transition name="fade">
        <div v-if="openMenu" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" @click="closeMenu" />
    </Transition>

    <!-- Slide-down menu panel -->
    <Transition name="slide">
        <nav v-if="openMenu" id="mobile-menu" role="navigation"
            class="fixed top-0 left-0 right-0 z-40 lg:hidden bg-indigo-950/95 backdrop-blur-md pt-16 pb-8 px-6 rounded-b-3xl shadow-2xl border-b border-indigo-800/50">

            <ul class="flex flex-col gap-1">
                <!-- Section links -->
                <li v-for="item in navItems" :key="item.id">
                    <a class="mobile-link" :class="{ 'mobile-link--active': isHomePage && activeSection === item.id }"
                        :href="isHomePage ? `#${item.id}` : 'javascript:void(0)'"
                        v-bind="isHomePage ? { 'v-smooth-scroll': '' } : {}" @click="handleNavClick(item.id)">
                        {{ item.label }}
                    </a>
                </li>

                <!-- Divider -->
                <li class="my-2">
                    <div class="h-px bg-indigo-800/60" />
                </li>

                <!-- Blog link -->
                <li>
                    <RouterLink to="/blog" class="mobile-link"
                        :class="{ 'mobile-link--active': route.path.startsWith('/blog') }" @click="closeMenu">
                        Blog
                        <span
                            class="ml-auto text-[10px] font-semibold tracking-widest uppercase bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full">
                            New
                        </span>
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface NavItem { id: string; label: string }

const navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About me' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'works', label: 'Works' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
]

const openMenu = ref(false)
const hamburgerRef = ref<HTMLElement | null>(null)
const activeSection = ref('home')
const route = useRoute()
const router = useRouter()
const isHomePage = computed(() => route.path === '/')

const toggleMenu = () => { openMenu.value = !openMenu.value }
const closeMenu = () => { openMenu.value = false }

function handleNavClick(id: string) {
    closeMenu()
    if (isHomePage.value) {
        // smooth-scroll handles it via href
        activeSection.value = id
    } else {
        router.push({ path: '/', hash: `#${id}` })
    }
}
</script>

<style lang="scss" scoped>
.mobile-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.875rem 1rem;
    border-radius: 0.75rem;
    font-size: 1.0625rem;
    font-weight: 500;
    color: #c7d2fe;
    /* indigo-200 */
    transition: background 0.15s, color 0.15s;

    &:hover {
        background: rgba(99, 102, 241, 0.15);
        color: #fff;
    }

    &--active {
        background: rgba(99, 102, 241, 0.25);
        color: #fff;
        font-weight: 700;
    }
}

/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Panel slide */
.slide-enter-active {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.slide-leave-active {
    transition: transform 0.2s ease-in, opacity 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}
</style>