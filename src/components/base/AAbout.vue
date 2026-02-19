<template>
  <section id="about" class="bg-white dark:bg-slate-900 section-spacing">
    <div class="container mx-auto">

      <!-- header -->
      <div class="section-header mb-14">
        <p class="section-label">About Me</p>
        <h2 class="section-title">Passionate About Crafting<br class="hidden sm:block" /> Great Web Experiences</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        <!-- LEFT: stat cards -->
        <div class="grid grid-cols-2 gap-5">
          <div v-for="stat in stats" :key="stat.label"
            class="bg-indigo-50 dark:bg-slate-800 rounded-2xl p-6 flex flex-col gap-2 border border-indigo-100 dark:border-slate-700">
            <span class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{{ stat.value }}</span>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ stat.label }}</span>
          </div>

          <!-- tech stack tags -->
          <div
            class="col-span-2 bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Core Stack
            </p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in stack" :key="tech"
                class="text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT: bio + contact -->
        <div class="flex flex-col gap-6">
          <p v-for="(para, i) in bio" :key="i" class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ para }}
          </p>

          <!-- contact links -->
          <div class="flex flex-col gap-3 pt-2">
            <a :href="'tel:' + phone"
              class="group flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span
                class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2 6.5A2.5 2.5 0 014.5 4h.75a1 1 0 01.98.8l.72 3.6a1 1 0 01-.29.95L5.1 10.4a11.05 11.05 0 005.5 5.5l1.05-1.57a1 1 0 01.95-.29l3.6.72a1 1 0 01.8.98v.75A2.5 2.5 0 0114.5 19C7.596 19 2 13.404 2 6.5z" />
                </svg>
              </span>
              <span class="text-sm font-medium">{{ phone }}</span>
            </a>
            <a :href="'mailto:' + email"
              class="group flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span
                class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span class="text-sm font-medium">{{ email }}</span>
            </a>
            <a :href="github" target="_blank" rel="noopener noreferrer"
              class="group flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span
                class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              <span class="text-sm font-medium">github.com/abanoub2017</span>
            </a>
            <a :href="linkedin" target="_blank" rel="noopener noreferrer"
              class="group flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span
                class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              <span class="text-sm font-medium">linkedin.com/in/abanoub-george</span>
            </a>
          </div>

          <div class="pt-2">
            <a href="#contact"
              class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Get In Touch
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSectionsStore } from '@/stores/sections'
import type { AboutContent } from '@/types/sections'

const store = useSectionsStore()
const data = computed(() => store.byType<AboutContent>('about').value)

const stats = computed(() => data.value?.stats ?? [])
const stack = computed(() => data.value?.stack ?? [])
const phone = computed(() => data.value?.phone ?? '')
const email = computed(() => data.value?.email ?? '')
const github = computed(() => data.value?.github ?? 'https://github.com/abanoub2017')
const linkedin = computed(() => data.value?.linkedin ?? 'https://www.linkedin.com/in/abanoub-george')
const bio = computed(() => data.value?.bio ?? [])
</script>

<style lang="scss" scoped></style>