<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSeoStore } from '@/stores/seo'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import type { SeoConfig } from '@/types/seo'

const router = useRouter()
const seoStore = useSeoStore()
const toast = useAdminToast()
const saving = ref(false)
const saved = ref(false)

// Local editable copy — initialised from store (defaults until Firestore loads)
const form = ref<SeoConfig>({ ...seoStore.config })

// If navigated directly (page refresh), load from Firestore first
onMounted(async () => {
    if (!seoStore.isLoading) {
        await seoStore.load()
    }
    form.value = { ...seoStore.config }
})

// ─── Description indicator ────────────────────────────────────────────────────

const descLength = computed(() => form.value.description.length)
const descStatus = computed(() => {
    if (descLength.value === 0) return 'empty'
    if (descLength.value < 50) return 'short'
    if (descLength.value <= 160) return 'good'
    return 'long'
})
const descHint = computed(() => ({
    empty: 'No description — search engines will use page content',
    short: 'Too short — aim for 50–160 characters',
    good: 'Good length for search engines',
    long: 'Too long — search engines will truncate at ~160 characters',
}[descStatus.value]))
const descColor = computed(() => ({
    empty: 'text-gray-500',
    short: 'text-yellow-400',
    good: 'text-green-400',
    long: 'text-red-400',
}[descStatus.value]))

// ─── Save ─────────────────────────────────────────────────────────────────────

async function handleSave() {
    saving.value = true
    // Derive ogImage automatically from the canonical site URL
    form.value.ogImage = `${form.value.siteUrl.replace(/\/$/, '')}/img/profile.png`
    try {
        await seoStore.save(form.value)
        saved.value = true
        toast.success('SEO settings saved successfully!')
        setTimeout(() => { saved.value = false }, 2500)
    } catch (e) {
        toast.error('Failed to save SEO settings. Please try again.')
    } finally {
        saving.value = false
    }
}
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
                <h1 class="text-2xl font-bold text-white">SEO Settings</h1>
                <p class="text-gray-400 text-sm mt-0.5">Manage page title, meta description, keywords and social
                    sharing.</p>
            </div>
        </div>

        <!-- Loading state -->
        <template v-if="seoStore.isLoading">
            <div class="flex flex-col gap-4">
                <div v-for="n in 3" :key="n"
                    class="h-28 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />
            </div>
        </template>

        <template v-else>
            <div class="flex flex-col gap-5">

                <!-- Page Title -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-2">
                    <h3 class="text-white font-semibold">Page Title</h3>
                    <p class="text-gray-500 text-xs">Appears in the browser tab and Google results. Aim for 50–60
                        characters.</p>
                    <input v-model="form.title" type="text" placeholder="Your Name — Job Title & Speciality"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>

                <!-- Meta Description -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <h3 class="text-white font-semibold">Meta Description</h3>
                        <span class="text-xs font-mono" :class="descColor">{{ descLength }} / 160</span>
                    </div>
                    <p class="text-gray-500 text-xs">Shown beneath your title in search results. Aim for 50–160
                        characters.</p>
                    <textarea v-model="form.description" rows="3"
                        placeholder="Short summary of what you do and who you help..."
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
                    <!-- Progress bar -->
                    <div class="flex items-center gap-3">
                        <div class="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-300" :class="{
                                'bg-gray-600': descStatus === 'empty',
                                'bg-yellow-400': descStatus === 'short',
                                'bg-green-400': descStatus === 'good',
                                'bg-red-400': descStatus === 'long',
                            }" :style="{ width: `${Math.min((descLength / 160) * 100, 100)}%` }" />
                        </div>
                        <p class="text-xs shrink-0" :class="descColor">{{ descHint }}</p>
                    </div>
                </div>

                <!-- Keywords -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-2">
                    <h3 class="text-white font-semibold">Keywords</h3>
                    <p class="text-gray-500 text-xs">Comma-separated. Used in <code
                            class="bg-gray-800 px-1 rounded text-gray-400">JSON-LD</code> structured data.</p>
                    <input v-model="form.keywords" type="text" placeholder="Vue.js, TypeScript, Frontend Developer, ..."
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>

                <!-- Author Name -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-2">
                    <h3 class="text-white font-semibold">Author Name</h3>
                    <p class="text-gray-500 text-xs">Used in the <code
                            class="bg-gray-800 px-1 rounded text-gray-400">author</code> meta tag and JSON-LD.</p>
                    <input v-model="form.authorName" type="text" placeholder="Your Full Name"
                        class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>

                <!-- Social Sharing -->
                <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">
                    <div>
                        <h3 class="text-white font-semibold">Social Sharing</h3>
                        <p class="text-gray-500 text-xs mt-1">These settings control how your site appears when shared
                            on Twitter, LinkedIn, etc.</p>
                    </div>

                    <!-- Site URL -->
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-medium text-gray-400 uppercase tracking-wide">Site URL</label>
                        <input v-model="form.siteUrl" type="url" placeholder="https://yoursite.com"
                            class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                        <p class="text-xs text-gray-600">Canonical URL — no trailing slash.</p>
                    </div>

                    <!-- OG Image — auto-derived from siteUrl -->
                    <div class="flex items-start gap-3 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3">
                        <svg class="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                        </svg>
                        <p class="text-xs text-gray-400 leading-relaxed">
                            The social preview image is automatically set to your profile photo
                            (<code class="bg-gray-700 px-1 rounded text-gray-300">/img/profile.png</code>).
                            To change it, replace that file in your project.
                        </p>
                    </div>
                </div>

                <!-- Save button -->
                <div class="flex justify-end">
                    <button @click="handleSave" :disabled="saving"
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
    </div>
</template>
