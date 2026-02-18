<template>
    <section id="testimonials" class="bg-white dark:bg-slate-900 section-spacing">
        <div class="container mx-auto">

            <!-- header -->
            <div class="section-header mb-14">
                <span class="section-label">Testimonials</span>
                <h2 class="section-title">What Clients Say</h2>
                <p class="section-subtitle">Feedback from people I've had the pleasure of working with</p>
            </div>

            <!-- cards grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="testimonial in testimonials" :key="testimonial.name"
                    class="relative flex flex-col gap-5 bg-gray-50 dark:bg-slate-800 rounded-2xl p-7 border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
                    role="article" :aria-label="`Testimonial from ${testimonial.name}`">
                    <!-- decorative quote mark -->
                    <span
                        class="absolute top-5 right-7 text-6xl font-serif leading-none text-indigo-100 dark:text-indigo-900/60 select-none"
                        aria-hidden="true">"</span>

                    <!-- stars -->
                    <div class="flex gap-0.5" aria-label="5 out of 5 stars">
                        <span v-for="n in 5" :key="n" class="text-yellow-400 text-lg" aria-hidden="true">★</span>
                    </div>

                    <!-- quote -->
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">
                        "{{ testimonial.quote }}"
                    </p>

                    <!-- divider -->
                    <div class="border-t border-gray-200 dark:border-slate-700" />

                    <!-- author -->
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 ring-2 ring-indigo-200 dark:ring-indigo-800"
                            :class="testimonial.avatarBg">
                            {{ testimonial.name.charAt(0) }}
                        </div>
                        <div>
                            <p class="font-semibold text-sm text-gray-800 dark:text-white">{{ testimonial.name }}</p>
                            <p class="text-indigo-500 dark:text-indigo-400 text-xs font-medium">{{ testimonial.role }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup lang="ts">
interface Testimonial {
    name: string
    role: string
    quote: string
    avatarBg: string
}

const testimonials: Testimonial[] = [
    {
        name: 'Ahmed Hassan',
        role: 'Product Manager · Kemitt',
        quote: 'Abanoub delivered a clean, fast, and accessible interface on time. His attention to detail and proactive communication made the whole process smooth.',
        avatarBg: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300',
    },
    {
        name: 'Sara Khaled',
        role: 'CEO · WeCare',
        quote: 'Working with Abanoub was a great experience. He translated our vision into a beautiful product and optimized it for speed and SEO from day one.',
        avatarBg: 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300',
    },
    {
        name: 'Mohamed Fawzy',
        role: 'Tech Lead · Nabd',
        quote: 'Exceptional Vue 3 skills. Abanoub refactored our legacy code to TypeScript and significantly improved our Core Web Vitals scores.',
        avatarBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
    },
]
</script>

<style lang="scss" scoped></style>
