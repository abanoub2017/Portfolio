<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { useSectionsStore } from '@/stores/sections'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import type { WorksContent } from '@/types/sections'
import AdminImageUpload from '@/components/admin/AdminImageUpload.vue'

const props = defineProps<{ sectionId: string }>()

const store = useSectionsStore()
const toast = useAdminToast()
const saving = ref(false)
const saved = ref(false)

type WorkItem = WorksContent['items'][number]

const [listRef, orderedItems] = useDragAndDrop<WorkItem>([], {
    dragHandle: '.work-drag-handle',
})

const source = computed(() =>
    store.sections.find(s => s.id === props.sectionId)?.content as WorksContent | undefined
)

const initialized = ref(false)

// Populate once after Firestore returns data. Later snapshots must not overwrite
// edits or a reordered list that has not been saved yet.
watch(source, (val) => {
    if (val && !initialized.value) {
        // Firestore values are wrapped in Vue reactive proxies. structuredClone()
        // cannot clone proxies, while WorkItem only contains primitive fields.
        orderedItems.value = val.items.map(item => ({ ...item }))
        initialized.value = true
    }
}, { immediate: true })

function addWork() {
    orderedItems.value = [
        ...orderedItems.value,
        { id: crypto.randomUUID(), title: '', link: '', tag: '', imageBase64: '' },
    ]
}

function removeWork(i: number) {
    orderedItems.value = orderedItems.value.filter((_, index) => index !== i)
}

function moveWork(i: number, direction: -1 | 1) {
    const target = i + direction
    if (target < 0 || target >= orderedItems.value.length) return

    const items = [...orderedItems.value]
    const current = items[i]
    const adjacent = items[target]
    if (!current || !adjacent) return

    items[i] = adjacent
    items[target] = current
    orderedItems.value = items
}

async function save() {
    saving.value = true
    try {
        await store.saveContent(props.sectionId, { items: orderedItems.value })
        saved.value = true
        setTimeout(() => { saved.value = false }, 2500)
    } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to save — check your connection.')
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">

        <div class="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-300">
            <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 8h16M4 16h16M8 4l-4 4 4 4m8 0 4 4-4 4" />
            </svg>
            Drag projects by the handle, or use the arrow buttons, then save to publish the new order.
        </div>

        <div ref="listRef" class="flex flex-col gap-6">
            <div v-for="(work, i) in orderedItems" :key="work.id"
                class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button type="button" aria-label="Drag to reorder project"
                            class="work-drag-handle cursor-grab touch-none rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-800 hover:text-indigo-400 active:cursor-grabbing">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <circle cx="8" cy="6" r="1.5" />
                                <circle cx="16" cy="6" r="1.5" />
                                <circle cx="8" cy="12" r="1.5" />
                                <circle cx="16" cy="12" r="1.5" />
                                <circle cx="8" cy="18" r="1.5" />
                                <circle cx="16" cy="18" r="1.5" />
                            </svg>
                        </button>
                        <span class="text-gray-500 text-xs font-mono">Position #{{ i + 1 }}</span>
                        <button type="button" :disabled="i === 0" aria-label="Move project up"
                            class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            @click="moveWork(i, -1)">↑</button>
                        <button type="button" :disabled="i === orderedItems.length - 1"
                            aria-label="Move project down"
                            class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            @click="moveWork(i, 1)">↓</button>
                    </div>
                    <button type="button" @click="removeWork(i)"
                        class="text-gray-600 hover:text-red-400 transition-colors text-sm">Remove</button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Title</label>
                    <input v-model="work.title"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Tag</label>
                    <input v-model="work.tag" placeholder="E-Commerce"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Link URL</label>
                    <input v-model="work.link" placeholder="https://"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                </div>

                <!-- Image upload -->
                <div>
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Screenshot</label>
                    <AdminImageUpload v-model="work.imageBase64" />
                </div>
            </div>
        </div>

        <!-- Add work -->
        <button @click="addWork"
            class="w-full py-3 border border-dashed border-gray-700 hover:border-indigo-500 text-gray-500 hover:text-indigo-400 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Project
        </button>

        <!-- Save -->
        <div class="flex justify-end">
            <button @click="save" :disabled="saving"
                class="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
                :class="saved ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'">
                <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <svg v-else-if="saved" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes' }}
            </button>
        </div>
    </div>
</template>
