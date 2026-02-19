<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSectionsStore } from '@/stores/sections'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import type { ServicesContent } from '@/types/sections'

const props = defineProps<{ sectionId: string }>()

const store = useSectionsStore()
const toast = useAdminToast()
const saving = ref(false)
const saved = ref(false)
let _saveTimer: ReturnType<typeof setTimeout> | null = null

const source = computed(() =>
    store.sections.find(s => s.id === props.sectionId)?.content as ServicesContent | undefined
)

const form = ref<ServicesContent>({ items: [] })

// { once: true } stops the watcher automatically after the first non-undefined
// value arrives from Firestore — subsequent snapshots never touch the form.
watch(source, (val) => {
    if (val) form.value = JSON.parse(JSON.stringify(val))
}, { immediate: true, once: true })

function addService() {
    form.value.items.push({ icon: '🔧', title: '', description: '', tags: [] })
}

function removeService(i: number) { form.value.items.splice(i, 1) }

function addTag(i: number, tag: string) {
    const t = tag.trim()
    if (t && !form.value.items[i].tags.includes(t)) form.value.items[i].tags.push(t)
}

function removeTag(i: number, j: number) { form.value.items[i].tags.splice(j, 1) }

const tagInputs = ref<string[]>([])

function scheduleSave() {
    if (_saveTimer) clearTimeout(_saveTimer)
    _saveTimer = setTimeout(() => save(), 500)
}

async function save() {
    saving.value = true
    try {
        await store.saveContent(props.sectionId, form.value)
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

        <!-- Service cards -->
        <div v-for="(service, i) in form.items" :key="i"
            class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <span class="text-gray-500 text-xs font-mono">#{{ i + 1 }}</span>
                <button @click="removeService(i)" class="text-gray-600 hover:text-red-400 transition-colors text-sm">
                    Remove
                </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <!-- Icon -->
                <div>
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Icon (emoji)</label>
                    <input v-model="service.icon"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-center text-2xl focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <!-- Title -->
                <div class="sm:col-span-3">
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Title</label>
                    <input v-model="service.title" placeholder="Service title"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
            </div>

            <!-- Description -->
            <div>
                <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5">Description</label>
                <textarea v-model="service.description" rows="3"
                    class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 resize-none transition-colors" />
            </div>

            <!-- Tags -->
            <div>
                <label class="text-xs text-gray-500 uppercase tracking-widest block mb-2">Tags</label>
                <div class="flex flex-wrap gap-2 mb-2">
                    <span v-for="(tag, j) in service.tags" :key="j"
                        class="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/10 border border-indigo-600/20 text-indigo-300 text-xs rounded-full">
                        {{ tag }}
                        <button @click="removeTag(i, j)" class="hover:text-red-400 transition-colors">×</button>
                    </span>
                </div>
                <div class="flex gap-2">
                    <input v-model="tagInputs[i]" @keydown.enter.prevent="addTag(i, tagInputs[i]); tagInputs[i] = ''"
                        placeholder="Tag + Enter"
                        class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                    <button @click="addTag(i, tagInputs[i]); tagInputs[i] = ''"
                        class="px-3 py-2 bg-gray-800 border border-gray-700 hover:border-indigo-500 text-gray-300 text-xs rounded-xl transition-colors">
                        Add
                    </button>
                </div>
            </div>
        </div>

        <!-- Add service -->
        <button @click="addService"
            class="w-full py-3 border border-dashed border-gray-700 hover:border-indigo-500 text-gray-500 hover:text-indigo-400 rounded-2xl text-sm transition-all duration-150 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Service
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
