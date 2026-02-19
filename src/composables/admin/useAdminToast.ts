import { ref } from 'vue'

export type ToastKind = 'success' | 'error' | 'info'

export interface Toast {
    id: number
    message: string
    kind: ToastKind
}

const toasts = ref<Toast[]>([])
let _seq = 0

export function useAdminToast() {
    function push(message: string, kind: ToastKind = 'info', duration = 4000) {
        const id = ++_seq
        toasts.value.push({ id, message, kind })
        setTimeout(() => dismiss(id), duration)
    }

    function dismiss(id: number) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const success = (msg: string) => push(msg, 'success')
    const error = (msg: string) => push(msg, 'error', 6000)
    const info = (msg: string) => push(msg, 'info')

    return { toasts, push, dismiss, success, error, info }
}
