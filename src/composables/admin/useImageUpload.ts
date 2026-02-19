import { ref } from 'vue'
import imageCompression from 'browser-image-compression'

export function useImageUpload() {
    const isCompressing = ref(false)
    const error = ref<string | null>(null)
    const sizeKB = ref<number | null>(null)

    async function compress(file: File): Promise<string> {
        isCompressing.value = true
        error.value = null
        sizeKB.value = null

        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.35,          // ~350 KB → ~465 KB base64; well within Firestore 1 MB doc limit
                maxWidthOrHeight: 1400,   // wide enough for featured 21:9 hero without upscaling
                useWebWorker: true,
                fileType: 'image/webp',   // ~30% smaller than jpeg at same quality
                initialQuality: 0.85,
            })

            sizeKB.value = Math.round(compressed.size / 1024)

            if (compressed.size > 900 * 1024) {
                throw new Error(`Compressed file is still ${sizeKB.value} KB — please use a smaller source image.`)
            }

            return await imageCompression.getDataUrlFromFile(compressed)
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Compression failed'
            throw e
        } finally {
            isCompressing.value = false
        }
    }

    return { compress, isCompressing, error, sizeKB }
}
