/**
 * src/services/storage.service.ts
 *
 * Cover image uploads via Cloudinary (free tier — 25 GB storage/bandwidth).
 *
 * Uses an UNSIGNED upload preset — no API secret needed in the browser.
 * Preset "blog_covers" must be created in:
 *   Cloudinary Console → Settings → Upload → Upload Presets
 *   Signing mode: Unsigned, Folder: blog-covers
 *
 * Env var required: VITE_CLOUDINARY_CLOUD_NAME (set in .env)
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = 'blog_covers'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME ? CLOUD_NAME : `profile-img`}/image/upload`

/**
 * Upload a cover image file to Cloudinary and return its public https:// URL.
 * The returned URL can be used directly as og:image (LinkedIn, WhatsApp, etc.)
 *
 * @param file  The image File selected by the user (jpg, png, webp, etc.)
 * @returns     Public https:// URL to the uploaded image
 */
export async function uploadCoverImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message ?? `Cloudinary upload failed (${res.status})`)
    }

    const data = await res.json()
    return data.secure_url as string  // always https://
}

/**
 * Deletion from the browser requires a signed request (server-side only).
 * For a personal blog it's fine to leave old images in Cloudinary — the free
 * tier gives 25 GB. Clean up manually via:
 *   https://console.cloudinary.com → Media Library → blog-covers
 *
 * This no-op keeps call sites forward-compatible if a server route is added later.
 */
export async function deleteCoverImage(_url: string): Promise<void> {
    // no-op — see comment above
}
