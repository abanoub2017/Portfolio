<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSectionsStore } from '@/stores/sections'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import type { ContactContent } from '@/types/sections'

const props = defineProps<{ sectionId: string }>()

const store = useSectionsStore()
const toast = useAdminToast()
const saving = ref(false)
const saved = ref(false)
let _saveTimer: ReturnType<typeof setTimeout> | null = null

const source = computed(() =>
    store.sections.find(s => s.id === props.sectionId)?.content as ContactContent | undefined
)

const form = ref<ContactContent>({ email: '', phone: '', github: '', linkedin: '' })

// { once: true } stops the watcher automatically after the first non-undefined
// value arrives from Firestore — subsequent snapshots never touch the form.
watch(source, (val) => {
    if (val) form.value = JSON.parse(JSON.stringify(val))
}, { immediate: true, once: true })

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
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 class="text-white font-semibold mb-4">Contact Details</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="field in (['email', 'phone', 'github', 'linkedin'] as const)" :key="field">
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 capitalize">{{ field
                        }}</label>
                    <input v-model="form[field]"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
            </div>
        </div>

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
