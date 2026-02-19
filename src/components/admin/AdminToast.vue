<script setup lang="ts">
import { useAdminToast } from '@/composables/admin/useAdminToast'
import { TransitionGroup } from 'vue'

const { toasts, dismiss } = useAdminToast()

const iconFor = (kind: string) => ({
    success: 'M5 13l4 4L19 7',
    error: 'M6 18L18 6M6 6l12 12',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
})[kind] ?? ''

const colorFor = (kind: string) => ({
    success: 'bg-green-500/10 border-green-500/20 text-green-300',
    error: 'bg-red-500/10 border-red-500/20 text-red-300',
    info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
})[kind] ?? ''

const iconColorFor = (kind: string) => ({
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-indigo-400',
})[kind] ?? ''
</script>

<template>
    <Teleport to="body">
        <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
            <TransitionGroup enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="translate-y-2 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
                leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <div v-for="toast in toasts" :key="toast.id"
                    class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-sm text-sm"
                    :class="colorFor(toast.kind)">
                    <svg class="w-4 h-4 shrink-0 mt-0.5" :class="iconColorFor(toast.kind)" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="iconFor(toast.kind)" />
                    </svg>
                    <span class="flex-1 leading-snug">{{ toast.message }}</span>
                    <button @click="dismiss(toast.id)"
                        class="text-current opacity-50 hover:opacity-100 transition-opacity leading-none ml-1">×</button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>
