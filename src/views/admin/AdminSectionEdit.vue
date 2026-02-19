<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSectionsStore } from '@/stores/sections'
import AdminAboutEditor from './editors/AdminAboutEditor.vue'
import AdminServicesEditor from './editors/AdminServicesEditor.vue'
import AdminSkillsEditor from './editors/AdminSkillsEditor.vue'
import AdminWorksEditor from './editors/AdminWorksEditor.vue'
import AdminContactEditor from './editors/AdminContactEditor.vue'

const route = useRoute()
const router = useRouter()
const store = useSectionsStore()

// Start listener here so the editor works when navigated to directly
// (e.g. page refresh on /admin/section/works, or opening URL directly).
// If AdminDashboard already started it, stopListener + restart is safe — store
// is a singleton, the old snapshot is replaced immediately.
onMounted(() => {
    if (store.sections.length === 0) {
        store.startAdminListener()
    }
})
onUnmounted(() => {
    // Only stop if we are the one who started it (AdminDashboard will restart when
    // navigating back anyway via its own onMounted).
    // We leave the listener running so navigating back to AdminDashboard is instant.
})

const sectionId = computed(() => route.params.id as string)
const section = computed(() => store.sections.find(s => s.id === sectionId.value))

const editorMap: Record<string, unknown> = {
    about: AdminAboutEditor,
    services: AdminServicesEditor,
    skills: AdminSkillsEditor,
    works: AdminWorksEditor,
    contact: AdminContactEditor,
}

const editor = computed(() => section.value ? editorMap[section.value.type] ?? null : null)
</script>

<template>
    <div>
        <!-- Back button + header -->
        <div class="mb-8 flex items-center gap-4">
            <button @click="router.push({ name: 'admin-dashboard' })"
                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>
            <div class="h-4 w-px bg-gray-700" />
            <div>
                <h1 class="text-2xl font-bold text-white capitalize">Edit · {{ sectionId }}</h1>
                <p class="text-gray-400 text-sm mt-0.5">Changes save to Firestore and reflect on the live site
                    instantly.</p>
            </div>
        </div>

        <!-- Loading skeletons — shown only when we have no section data yet.
             Deliberately NOT wrapping <component :is="editor"> in v-if so the
             editor component stays mounted while Firestore snapshots arrive,
             preventing _initialized from being reset on each data update. -->
        <template v-if="store.isLoading && !section">
            <div class="flex flex-col gap-4">
                <div v-for="n in 3" :key="n"
                    class="h-32 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />
            </div>
        </template>

        <!-- Section not found (only after loading is done) -->
        <div v-else-if="!store.isLoading && !section"
            class="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <p class="text-red-400">Section <code class="bg-gray-800 px-1.5 rounded">{{ sectionId }}</code> not found.
            </p>
        </div>

        <!-- No editor yet for this type -->
        <div v-else-if="!editor"
            class="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-2xl">🚧</div>
            <div>
                <h2 class="text-white font-semibold capitalize">{{ section.type }} Editor</h2>
                <p class="text-gray-500 text-sm mt-1">Editor for this section type is coming soon.</p>
            </div>
        </div>

        <!-- Dynamic editor -->
        <component v-else :is="editor" :section-id="sectionId" />
    </div>
</template>
