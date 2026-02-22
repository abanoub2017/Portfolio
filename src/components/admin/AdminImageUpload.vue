<script setup lang="ts">
import { ref } from 'vue'
import { uploadCoverImage } from '@/services/storage.service'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isDragging = ref(false)
const isUploading = ref(false)
const error = ref<string | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    isUploading.value = true
    error.value = null
    try {
        const url = await uploadCoverImage(file)
        emit('update:modelValue', url)
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Upload failed'
    } finally {
        isUploading.value = false
    }
}

function onFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) handleFile(file)
}

function onDrop(e: DragEvent) {
    isDragging.value = false
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
}

function clear() {
    emit('update:modelValue', '')
    if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <!-- Drop zone / preview -->
        <div class="relative w-full rounded-xl border-2 transition-all overflow-hidden" :class="[
            isDragging
                ? 'border-indigo-500 bg-indigo-500/10'
                : modelValue
                    ? 'border-gray-700'
                    : 'border-dashed border-gray-700 hover:border-indigo-500 hover:bg-gray-800/50 cursor-pointer',
        ]" style="min-height: 8rem" @dragenter.prevent="isDragging = true" @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false" @drop.prevent="onDrop" @click="!modelValue && inputRef?.click()">
            <!-- Existing image preview -->
            <template v-if="modelValue">
                <img :src="modelValue" class="w-full h-32 object-cover" />
                <div
                    class="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
                    <button type="button" @click.stop="inputRef?.click()"
                        class="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-xs rounded-lg transition-colors">Replace</button>
                    <button type="button" @click.stop="clear()"
                        class="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 backdrop-blur text-red-300 text-xs rounded-lg transition-colors">Remove</button>
                </div>
            </template>

            <!-- Empty state -->
            <template v-else>
                <div
                    class="h-32 flex flex-col items-center justify-center gap-2 text-gray-500 select-none pointer-events-none">
                    <svg v-if="isUploading" class="w-6 h-6 animate-spin text-indigo-400" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span class="text-sm" v-if="isUploading">Uploading…</span>
                    <span class="text-sm" v-else>Drop image here or click to browse</span>
                    <span class="text-xs text-gray-600">Uploaded to Cloudinary · served as WebP</span>
                </div>
            </template>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>

        <!-- Hidden file input -->
        <input ref="inputRef" type="file" accept="image/*" class="hidden" @change="onFileInput" />
    </div>
</template>
