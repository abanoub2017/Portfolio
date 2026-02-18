<template>
    <!-- testimonials -->
    <div id="testimonials" class="dark:bg-slate-900 section-spacing bg-indigo-50">
        <div class="container mx-auto px-5">
            <!-- top -->
            <div class="section-header mb-12">
                <span class="section-label">Testimonials</span>
                <h2 class="section-title">What clients say</h2>
            </div>
            <!-- cards -->
            <div class="flex flex-wrap justify-center gap-8">
                <div v-for="testimonial in testimonials" :key="testimonial.name"
                    class="w-full md:w-5/12 lg:w-3/12 bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 flex flex-col gap-4"
                    role="article" :aria-label="`Testimonial from ${testimonial.name}`">
                    <!-- stars -->
                    <div class="flex gap-1 text-yellow-400" aria-label="5 out of 5 stars">
                        <span v-for="n in 5" :key="n" aria-hidden="true">★</span>
                    </div>
                    <!-- quote -->
                    <p class="text-gray-500 dark:text-gray-300 text-sm leading-relaxed italic">
                        "{{ testimonial.quote }}"
                    </p>
                    <!-- author -->
                    <div class="flex items-center gap-3 mt-auto">
                        <div
                            class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {{ testimonial.name.charAt(0) }}
                        </div>
                        <div>
                            <p class="font-semibold text-sm dark:text-white">{{ testimonial.name }}</p>
                            <p class="text-gray-400 text-xs">{{ testimonial.role }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Testimonial {
    name: string
    role: string
    quote: string
}

// Replace these with real testimonials when available
const testimonials: Testimonial[] = [
    {
        name: 'Ahmed Hassan',
        role: 'Product Manager · Kemitt',
        quote: 'Abanoub delivered a clean, fast, and accessible interface on time. His attention to detail and proactive communication made the whole process smooth.',
    },
    {
        name: 'Sara Khaled',
        role: 'CEO · WeCare',
        quote: 'Working with Abanoub was a great experience. He translated our vision into a beautiful product and optimized it for speed and SEO from day one.',
    },
    {
        name: 'Mohamed Fawzy',
        role: 'Tech Lead · Nabd',
        quote: 'Exceptional Vue 3 skills. Abanoub refactored our legacy code to TypeScript and significantly improved our Core Web Vitals scores.',
    },
]
</script>

<style lang="scss" scoped></style>
