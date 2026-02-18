<template>
    <div id="services" class="dark:bg-slate-900 section-spacing">
        <div class="container mx-auto px-5">
            <div class="section-header mb-12">
                <span class="section-label">Services</span>
                <h2 class="section-title">What do I offer?</h2>
                <p class="section-subtitle">
                    From pixel-perfect UI to production-grade architecture —
                    here's what I bring as a senior frontend engineer.
                </p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="service in services" :key="service.title"
                    class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div
                        class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-2xl select-none">
                        {{ service.icon }}
                    </div>
                    <h3 class="font-semibold text-lg text-gray-900 dark:text-white">
                        {{ service.title }}
                    </h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">
                        {{ service.description }}
                    </p>
                    <ul class="flex flex-wrap gap-2 pt-1">
                        <li v-for="tag in service.tags" :key="tag"
                            class="text-xs bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full font-medium">
                            {{ tag }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Service {
    icon: string
    title: string
    description: string
    tags: string[]
}

const services: Service[] = [
    {
        icon: '🏗️',
        title: 'Frontend Architecture',
        description: 'Designing scalable component systems, feature-based folder structures, and module boundaries using Vue 3 or Angular — built to grow with your team and survive long-term.',
        tags: ['Vue 3', 'Nuxt', 'Angular', 'TypeScript', 'Monorepo'],
    },
    {
        icon: '🎨',
        title: 'UI / UX Engineering',
        description: 'Translating Figma designs into pixel-perfect, accessible, and responsive interfaces with smooth micro-animations and consistent design tokens across the whole product.',
        tags: ['Figma', 'Tailwind CSS', 'SCSS', 'Animations', 'Design Systems'],
    },
    {
        icon: '⚡',
        title: 'Performance Optimization',
        description: 'Auditing and improving Core Web Vitals — lazy loading, code splitting, tree-shaking, bundle analysis, image optimization, and HTTP caching for perfect Lighthouse scores.',
        tags: ['Lighthouse', 'Vite', 'Lazy Loading', 'Bundle Analysis', 'Web Vitals'],
    },
    {
        icon: '♿',
        title: 'Accessibility (WCAG)',
        description: 'Building inclusive products with semantic HTML, correct ARIA roles, keyboard navigation, focus management, and screen-reader testing to meet WCAG 2.1 AA standards.',
        tags: ['ARIA', 'WCAG 2.1', 'Semantic HTML', 'Keyboard Nav', 'a11y'],
    },
    {
        icon: '🧪',
        title: 'Testing & Code Quality',
        description: 'Setting up unit, component, and E2E test suites with Vitest and Cypress. ESLint, Prettier, and CI/CD pipelines to keep code clean and deployments safe.',
        tags: ['Vitest', 'Cypress', 'ESLint', 'Prettier', 'CI/CD'],
    },
    {
        icon: '🔗',
        title: 'API Integration & State',
        description: 'Seamless integration with REST and GraphQL APIs using fully typed data flows, error boundaries, optimistic updates, and efficient state management with Pinia or NgRx.',
        tags: ['REST', 'GraphQL', 'Pinia', 'NgRx', 'TanStack Query'],
    },
]
</script>

<style lang="scss" scoped></style>