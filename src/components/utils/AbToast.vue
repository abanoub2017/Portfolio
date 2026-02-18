<template>
    <div id="toast-bottom-right" role="status" aria-live="polite"
        class="fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
        <!-- Icon -->
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg" :class="type === 'error'
            ? 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200'
            : 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200'">
            <!-- Success icon -->
            <svg v-if="type === 'success'" aria-hidden="true" class="w-5 h-5" focusable="false"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor"
                    d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z" />
            </svg>
            <!-- Error icon -->
            <svg v-else aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
            </svg>
            <span class="sr-only">{{ type === 'error' ? 'Error' : 'Success' }} icon</span>
        </div>

        <div class="ml-3 text-sm font-normal">{{ message }}</div>

        <button type="button" @click="$emit('closeToast')" aria-label="Close notification"
            class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
            <span class="sr-only">Close</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

type ToastType = 'success' | 'error'

const props = withDefaults(defineProps<{
    message?: string
    type?: ToastType
    duration?: number
}>(), {
    message: 'Message sent successfully',
    type: 'success',
    duration: 4000,
})

const emit = defineEmits<{ (e: 'closeToast'): void }>()

let timerId: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
    if (props.duration > 0) {
        timerId = setTimeout(() => emit('closeToast'), props.duration)
    }
})

onUnmounted(() => {
    if (timerId !== null) clearTimeout(timerId)
})
</script>

<style lang="scss" scoped></style>