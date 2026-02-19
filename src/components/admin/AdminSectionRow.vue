<script setup lang="ts">
import { ref } from 'vue'
import { useSectionsStore } from '@/stores/sections'
import type { Section } from '@/types/sections'

const props = defineProps<{ section: Section }>()
const emit = defineEmits<{ edit: [id: string] }>()

const store = useSectionsStore()
const toggling = ref(false)

const sectionMeta: Record<string, { label: string; icon: string; color: string }> = {
    hero: { label: 'Hero', icon: '🏠', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    about: { label: 'About', icon: '👤', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    services: { label: 'Services', icon: '⚙️', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    skills: { label: 'Skills', icon: '📊', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    works: { label: 'Works', icon: '🖼️', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    testimonials: { label: 'Testimonials', icon: '💬', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    contact: { label: 'Contact', icon: '✉️', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
}

const meta = sectionMeta[props.section.type] ?? { label: props.section.type, icon: '📄', color: 'bg-gray-700 text-gray-400 border-gray-600' }

async function toggleActive() {
    toggling.value = true
    try {
        await store.toggleSection(props.section.id, !props.section.isActive)
    } finally {
        toggling.value = false
    }
}
</script>

<template>
    <li
        class="group flex items-center gap-4 px-5 py-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors duration-150">

        <!-- Drag handle -->
        <span
            class="drag-handle text-gray-600 group-hover:text-gray-400 transition-colors cursor-grab active:cursor-grabbing select-none text-lg shrink-0">
            ⠿
        </span>

        <!-- Order badge -->
        <span
            class="w-7 h-7 rounded-lg bg-gray-800 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
            {{ section.order + 1 }}
        </span>

        <!-- Section type badge -->
        <span class="flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold shrink-0"
            :class="meta.color">
            {{ meta.icon }} {{ meta.label }}
        </span>

        <!-- Section id -->
        <span class="text-gray-500 text-xs font-mono hidden sm:block">{{ section.id }}</span>

        <!-- Spacer -->
        <span class="flex-1" />

        <!-- Active toggle -->
        <button @click="toggleActive" :disabled="toggling"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 disabled:opacity-50"
            :class="section.isActive
                ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400 border border-green-500/20 hover:border-red-500/20'
                : 'bg-gray-800 text-gray-500 hover:bg-green-500/10 hover:text-green-400 border border-gray-700 hover:border-green-500/20'">
            <span v-if="toggling"
                class="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span v-else-if="section.isActive" class="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span v-else class="w-1.5 h-1.5 rounded-full bg-gray-500" />
            {{ section.isActive ? 'Visible' : 'Hidden' }}
        </button>

        <!-- Edit button -->
        <button @click="emit('edit', section.id)"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-600/20 hover:border-indigo-500/40 transition-all duration-150">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
        </button>
    </li>
</template>
