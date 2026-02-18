<template>
    <!-- Skills -->
    <div id="skills" class="dark:bg-slate-900 section-spacing" ref="target">
        <div class="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-20">
            <!-- left -->
            <div class="relative hidden md:block">
                <img class="h-1/4 absolute top-0 left-0 -z-10" src="@/assets/img/dots.png" alt="" loading="lazy" />
                <div class="h-full rounded-full overflow-hidden">
                    <img src="@/assets/img/soft-skills.png" alt="Skills illustration" loading="lazy"
                        class="transition-opacity duration-300"
                        :class="{ 'opacity-0': !isIntersecting, 'opacity-100': isIntersecting }" />
                </div>
            </div>
            <!-- right -->
            <div class="my-auto   gap-3">
                <h2 class="section-label">Areas of Expertise</h2>
                <p class="text-gray-400">
                    As a web developer and graphic designer Take a look at some of my key skills below:
                </p>
                <div class="flex justify-start flex-wrap gap-4 my-3 w-full md:w-3/4 ">
                    <span v-for="skill in skills" :key="skill.label" :style="{ backgroundColor: skill.color }"
                        class="text-white rounded-xl cursor-pointer shadow-sm p-2 hover:shadow-lg transition-all">
                        {{ skill.label }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

interface Skill {
    label: string
    color: string
}

const { target, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '50px',
})

const skills: Skill[] = [
    { label: 'HTML5', color: '#fc657e' },
    { label: 'CSS3', color: '#fc657e' },
    { label: 'SASS', color: '#fc657e' },
    { label: 'Bootstrap 4/5', color: '#70d6f9' },
    { label: 'JavaScript', color: '#fc657e' },
    { label: 'jQuery', color: '#fc657e' },
    { label: 'TypeScript', color: '#3178c6' },
    { label: 'Git', color: '#f5c84c' },
    { label: 'GitHub', color: '#f5c84c' },
    { label: 'Vue.js', color: '#87d147' },
    { label: 'Nuxt.js', color: '#87d147' },
    { label: 'Angular', color: '#dd1b16' },
    { label: 'Figma', color: '#a259ff' },
    { label: 'Adobe XD', color: '#ff61f6' },
]
</script>

<style lang="scss" scoped></style>