<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSectionsStore } from '@/stores/sections'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import type { SkillsContent } from '@/types/sections'

const props = defineProps<{ sectionId: string }>()

const store = useSectionsStore()
const toast = useAdminToast()
const saving = ref(false)
const saved = ref(false)
let _saveTimer: ReturnType<typeof setTimeout> | null = null

const source = computed(() =>
    store.sections.find(s => s.id === props.sectionId)?.content as SkillsContent | undefined
)

const form = ref<SkillsContent>({ categories: [], extras: [] })

// { once: true } stops the watcher automatically after the first non-undefined
// value arrives from Firestore — subsequent snapshots never touch the form.
watch(source, (val) => {
    if (val) form.value = JSON.parse(JSON.stringify(val))
}, { immediate: true, once: true })

function addCategory() {
    form.value.categories.push({
        title: '', icon: '🔧',
        iconBg: 'bg-gray-50 dark:bg-gray-900/30',
        barColor: 'bg-indigo-500',
        skills: [],
    })
}
function removeCategory(i: number) { form.value.categories.splice(i, 1) }
function addSkill(i: number) { form.value.categories[i].skills.push({ label: '', level: 80 }) }
function removeSkill(i: number, j: number) { form.value.categories[i].skills.splice(j, 1) }

const newExtra = ref('')
function addExtra() {
    const t = newExtra.value.trim()
    if (t && !form.value.extras.includes(t)) form.value.extras.push(t)
    newExtra.value = ''
}
function removeExtra(i: number) { form.value.extras.splice(i, 1) }

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

        <!-- Categories -->
        <div v-for="(cat, i) in form.categories" :key="i"
            class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">

            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 flex-1">
                    <input v-model="cat.icon"
                        class="w-12 text-center bg-gray-800 border border-gray-700 rounded-lg py-1.5 text-xl focus:outline-none focus:border-indigo-500" />
                    <input v-model="cat.title" placeholder="Category title"
                        class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <button @click="removeCategory(i)"
                    class="ml-4 text-gray-600 hover:text-red-400 transition-colors text-sm shrink-0">Remove</button>
            </div>

            <!-- Bar color picker -->
            <div class="flex items-center gap-3">
                <label class="text-xs text-gray-500 uppercase tracking-widest shrink-0">Bar color class</label>
                <input v-model="cat.barColor" placeholder="bg-indigo-500"
                    class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-300 font-mono focus:outline-none focus:border-indigo-500 transition-colors" />
                <span class="w-6 h-6 rounded-full shrink-0" :class="cat.barColor" />
            </div>

            <!-- Skills -->
            <div class="flex flex-col gap-2">
                <label class="text-xs text-gray-500 uppercase tracking-widest">Skills</label>
                <div v-for="(skill, j) in cat.skills" :key="j" class="flex items-center gap-3">
                    <input v-model="skill.label" placeholder="Skill name"
                        class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                    <div class="flex items-center gap-2 shrink-0">
                        <input v-model.number="skill.level" type="range" min="0" max="100"
                            class="w-28 accent-indigo-500" />
                        <span class="text-gray-400 text-xs w-8 text-right">{{ skill.level }}%</span>
                    </div>
                    <button @click="removeSkill(i, j)" class="text-gray-600 hover:text-red-400 transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <button @click="addSkill(i)"
                    class="mt-1 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add skill
                </button>
            </div>
        </div>

        <!-- Add category -->
        <button @click="addCategory"
            class="w-full py-3 border border-dashed border-gray-700 hover:border-indigo-500 text-gray-500 hover:text-indigo-400 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
        </button>

        <!-- Extras -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 class="text-white font-semibold mb-4">Also Worked With (extras)</h3>
            <div class="flex flex-wrap gap-2 mb-3">
                <span v-for="(tag, i) in form.extras" :key="i"
                    class="flex items-center gap-1 px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-full">
                    {{ tag }}
                    <button @click="removeExtra(i)" class="hover:text-red-400 transition-colors">×</button>
                </span>
            </div>
            <div class="flex gap-2">
                <input v-model="newExtra" @keydown.enter.prevent="addExtra" placeholder="Add tool + Enter"
                    class="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                <button @click="addExtra"
                    class="px-4 py-2 bg-gray-800 border border-gray-700 hover:border-indigo-500 text-gray-300 text-sm rounded-xl transition-colors">Add</button>
            </div>
        </div>

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
