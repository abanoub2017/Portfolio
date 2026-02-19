<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useSeoStore } from '@/stores/seo'
import { useAdminToast } from '@/composables/admin/useAdminToast'
import type { SeoConfig } from '@/types/seo'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const seoStore = useSeoStore()
const toast = useAdminToast()
const saving = ref(false)

const form = ref<SeoConfig>({ ...seoStore.config })

// Refresh form whenever the modal opens (picks up latest store values)
watch(
    () => props.open,
    (val) => {
        if (val) form.value = { ...seoStore.config }
    },
)

// ─── Indicators ───────────────────────────────────────────────────────────────

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
    try {
        await seoStore.save(form.value)
        toast.success('SEO settings saved successfully!')
        emit('close')
    } catch (e) {
        toast.error('Failed to save SEO settings. Please try again.')
    } finally {
        saving.value = false
    }
}

function handleCancel() {
    form.value = { ...seoStore.config }
    emit('close')
}
</script>

<template>
    <!-- Backdrop -->
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Overlay -->
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleCancel" />

                <!-- Panel -->
                <div
                    class="relative z-10 w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                    <!-- Header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
                        <div class="flex items-center gap-3">
                            <!-- SEO icon -->
                            <div
                                class="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                <svg class="w-4.5 h-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 class="text-white font-semibold text-sm">SEO Settings</h2>
                                <p class="text-gray-500 text-xs mt-0.5">Manage page title, meta description and social
                                    sharing</p>
                            </div>
                        </div>
                        <button @click="handleCancel"
                            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="overflow-y-auto px-6 py-5 flex flex-col gap-5">

                        <!-- Page Title -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Page Title
                            </label>
                            <input v-model="form.title" type="text" placeholder="Your Name — Job Title & Speciality"
                                class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                            <p class="text-xs text-gray-600">Appears in the browser tab and Google results. Aim for
                                50–60 characters.</p>
                        </div>

                        <!-- Meta Description -->
                        <div class="flex flex-col gap-1.5">
                            <div class="flex items-center justify-between">
                                <label class="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                    Meta Description
                                </label>
                                <span class="text-xs font-mono" :class="descColor">
                                    {{ descLength }} / 160
                                </span>
                            </div>
                            <textarea v-model="form.description" rows="3"
                                placeholder="Short summary of what you do and who you help..."
                                class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
                            <!-- Status bar -->
                            <div class="flex items-center gap-2">
                                <div class="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
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
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Keywords
                            </label>
                            <input v-model="form.keywords" type="text"
                                placeholder="Vue.js, TypeScript, Frontend Developer, ..."
                                class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                            <p class="text-xs text-gray-600">Comma-separated. Meta keywords have minimal ranking impact
                                but are used in JSON-LD.</p>
                        </div>

                        <!-- Author Name -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Author Name
                            </label>
                            <input v-model="form.authorName" type="text" placeholder="Your Full Name"
                                class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                        </div>

                        <!-- Divider: Social / OG -->
                        <div class="border-t border-gray-800 pt-1">
                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Social Sharing
                            </p>

                            <!-- Site URL -->
                            <div class="flex flex-col gap-1.5 mb-5">
                                <label class="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                    Site URL
                                </label>
                                <input v-model="form.siteUrl" type="url" placeholder="https://yoursite.com"
                                    class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                                <p class="text-xs text-gray-600">Canonical URL — no trailing slash.</p>
                            </div>

                            <!-- OG Image -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                    Social Preview Image URL
                                </label>
                                <input v-model="form.ogImage" type="url" placeholder="https://yoursite.com/img/og.png"
                                    class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors" />
                                <p class="text-xs text-gray-600">Shown when your link is shared on Twitter, LinkedIn,
                                    etc. Ideal size: 1200 × 630 px.</p>
                                <!-- Image preview -->
                                <div v-if="form.ogImage"
                                    class="mt-1 rounded-xl overflow-hidden border border-gray-700 aspect-video bg-gray-800 flex items-center justify-center">
                                    <img :src="form.ogImage" alt="OG image preview" class="w-full h-full object-cover"
                                        @error="($event.target as HTMLImageElement).style.display = 'none'" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 shrink-0">
                        <button @click="handleCancel"
                            class="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                            Cancel
                        </button>
                        <button @click="handleSave" :disabled="saving"
                            class="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            {{ saving ? 'Saving…' : 'Save Changes' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
    transform: scale(0.96) translateY(8px);
    opacity: 0;
}
</style>
