<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useSectionsStore } from '@/stores/sections'
import AdminSectionRow from '@/components/admin/AdminSectionRow.vue'
import type { Section } from '@/types/sections'

const router = useRouter()
const store = useSectionsStore()

onMounted(() => store.startAdminListener())
onUnmounted(() => store.stopListener())

// ─── Drag & drop ─────────────────────────────────────────────────────────────
const [listRef, orderedSections] = useDragAndDrop<Section>([], {
    dragHandle: '.drag-handle',
    onDragend: async () => {
        // Persist new order to Firestore
        await store.reorder(
            orderedSections.value.map((s, i) => ({ id: s.id, order: i }))
        )
    },
})

// Keep orderedSections in sync when Firestore snapshot arrives
watch(
    () => store.sections,
    (incoming) => { orderedSections.value = [...incoming] },
    { immediate: true },
)

function handleEdit(id: string) {
    router.push({ name: 'admin-section-edit', params: { id } })
}
</script>

<template>
    <div>
        <!-- Page header -->
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-white">Sections</h1>
                <p class="text-gray-400 text-sm mt-1">
                    Manage and reorder your portfolio sections. Changes reflect on the live site immediately.
                </p>
            </div>
            <!-- Section count badge -->
            <span class="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs font-medium">
                {{ store.sections.length }} sections
            </span>
        </div>

        <!-- Loading state -->
        <div v-if="store.isLoading" class="flex flex-col gap-3">
            <div v-for="n in 4" :key="n" class="h-16 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />
        </div>

        <!-- Error state -->
        <div v-else-if="store.error"
            class="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 text-sm">
            Failed to load sections: {{ store.error }}
        </div>

        <!-- Section list -->
        <ul v-else ref="listRef" class="flex flex-col gap-3">
            <AdminSectionRow v-for="section in orderedSections" :key="section.id" :section="section"
                @edit="handleEdit" />
        </ul>

        <!-- Empty state -->
        <div v-if="!store.isLoading && store.sections.length === 0"
            class="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 mt-3">
            <div class="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-2xl">📭</div>
            <div>
                <h2 class="text-white font-semibold">No sections found</h2>
                <p class="text-gray-500 text-sm mt-1">Run <code
                        class="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">npx tsx scripts/seed.ts</code> to
                    populate Firestore.</p>
            </div>
        </div>
    </div>
</template>
