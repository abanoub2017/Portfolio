<script setup lang="ts">
import { ref } from 'vue'
import { useImageUpload } from '@/composables/admin/useImageUpload'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { compress, isCompressing, error, sizeKB } = useImageUpload()
const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
        return
    }
    try {
        const base64 = await compress(file)
        emit('update:modelValue', base64)
    } catch {
        // error is already set in composable
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
                    <svg v-if="isCompressing" class="w-6 h-6 animate-spin text-indigo-400" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span class="text-sm" v-if="isCompressing">Compressing…</span>
                    <span class="text-sm" v-else>Drop image here or click to browse</span>
                    <span class="text-xs text-gray-600">Compressed to ≤ 80 KB · WebP · max 800 px</span>
                </div>
            </template>
        </div>

        <!-- Size badge -->
        <div v-if="sizeKB !== null && modelValue" class="flex items-center gap-1.5 text-xs text-gray-500">
            <svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Compressed to <span class="text-green-400 font-medium">{{ sizeKB }} KB</span>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-xs text-red-400">{{ error }}</p>

        <!-- Hidden file input -->
        <input ref="inputRef" type="file" accept="image/*" class="hidden" @change="onFileInput" />
    </div>
</template>
