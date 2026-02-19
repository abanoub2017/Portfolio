<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSectionsStore } from '@/stores/sections'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import type { AboutContent } from '@/types/sections'

const props = defineProps<{ sectionId: string }>()

const store = useSectionsStore()
const toast = useAdminToast()
const saving = ref(false)
const saved = ref(false)
let _saveTimer: ReturnType<typeof setTimeout> | null = null

const source = computed(() =>
    store.sections.find(s => s.id === props.sectionId)?.content as AboutContent | undefined
)

// Local editable copy
const form = ref<AboutContent>({
    bio: [],
    stats: [],
    stack: [],
    phone: '',
    email: '',
    github: '',
    linkedin: '',
})

// { once: true } stops the watcher automatically after the first non-undefined
// value arrives from Firestore — subsequent snapshots never touch the form.
watch(source, (val) => {
    if (val) form.value = JSON.parse(JSON.stringify(val))
}, { immediate: true, once: true })

// ─── Bio paragraphs ───────────────────────────────────────────────────────────
function addPara() { form.value.bio.push('') }
function removePara(i: number) { form.value.bio.splice(i, 1) }

// ─── Stats ────────────────────────────────────────────────────────────────────
function addStat() { form.value.stats.push({ value: '', label: '' }) }
function removeStat(i: number) { form.value.stats.splice(i, 1) }

// ─── Stack tags ───────────────────────────────────────────────────────────────
const newTag = ref('')
function addTag() {
    const t = newTag.value.trim()
    if (t && !form.value.stack.includes(t)) form.value.stack.push(t)
    newTag.value = ''
}
function removeTag(i: number) { form.value.stack.splice(i, 1) }

// ─── Save (debounced 500ms) ───────────────────────────────────────────────────
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

        <!-- Bio paragraphs -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-white font-semibold">Bio Paragraphs</h3>
                <button @click="addPara"
                    class="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add paragraph
                </button>
            </div>
            <div class="flex flex-col gap-3">
                <div v-for="(_, i) in form.bio" :key="i" class="flex gap-2">
                    <textarea v-model="form.bio[i]" rows="3"
                        class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none transition-colors" />
                    <button @click="removePara(i)"
                        class="shrink-0 text-gray-600 hover:text-red-400 transition-colors mt-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-white font-semibold">Stats</h3>
                <button @click="addStat"
                    class="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add stat
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="(stat, i) in form.stats" :key="i"
                    class="flex gap-2 bg-gray-800 border border-gray-700 rounded-xl p-3">
                    <div class="flex flex-col gap-2 flex-1">
                        <input v-model="stat.value" placeholder="5+"
                            class="bg-transparent border-b border-gray-600 focus:border-indigo-500 text-white text-sm w-full outline-none pb-1 transition-colors" />
                        <input v-model="stat.label" placeholder="Years of Experience"
                            class="bg-transparent border-b border-gray-600 focus:border-indigo-500 text-gray-400 text-xs w-full outline-none pb-1 transition-colors" />
                    </div>
                    <button @click="removeStat(i)" class="text-gray-600 hover:text-red-400 transition-colors shrink-0">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Stack tags -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 class="text-white font-semibold mb-4">Core Stack Tags</h3>
            <div class="flex flex-wrap gap-2 mb-3">
                <span v-for="(tag, i) in form.stack" :key="i"
                    class="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 text-indigo-300 text-xs rounded-full">
                    {{ tag }}
                    <button @click="removeTag(i)" class="hover:text-red-400 transition-colors">×</button>
                </span>
            </div>
            <div class="flex gap-2">
                <input v-model="newTag" @keydown.enter.prevent="addTag" placeholder="Add tag + Enter"
                    class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                <button @click="addTag"
                    class="px-4 py-2 bg-gray-800 border border-gray-700 hover:border-indigo-500 text-gray-300 text-sm rounded-xl transition-colors">
                    Add
                </button>
            </div>
        </div>

        <!-- Contact details -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 class="text-white font-semibold mb-4">Contact Details</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="field in (['phone', 'email', 'github', 'linkedin'] as const)" :key="field">
                    <label class="text-xs text-gray-500 uppercase tracking-widest block mb-1.5 capitalize">{{ field
                        }}</label>
                    <input v-model="form[field]"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
            </div>
        </div>

        <!-- Save button -->
        <div class="flex justify-end">
            <button @click="save" :disabled="saving"
                class="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-60"
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
