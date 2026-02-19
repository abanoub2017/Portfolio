/**
 * src/services/seo.service.ts
 *
 * Firestore operations for the `seo/main` singleton document.
 * Stores SEO metadata that is editable from the admin dashboard.
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getDb } from '@/firebase'
import type { SeoConfig } from '@/types/seo'

// ─── Defaults (used when the doc doesn't exist yet) ──────────────────────────

export const DEFAULT_SEO: SeoConfig = {
    title: 'Abanoub George — Front-End Developer & Vue.js Specialist',
    description:
        'Portfolio of Abanoub George, a Front-End Developer with 4+ years of experience building fast, responsive web apps with Vue.js, Nuxt.js and modern CSS.',
    keywords:
        'Abanoub George, portfolio, Front-End Developer, Vue.js, Nuxt.js, HTML5, CSS3, SCSS, JavaScript, TypeScript',
    siteUrl: 'https://abanoubgeorge.net',
    ogImage: 'https://abanoubgeorge.net/img/profile.png',
    authorName: 'Abanoub George',
}

const docRef = () => doc(getDb(), 'seo', 'main')

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * Load SEO config from Firestore.
 * Returns defaults if the document does not exist yet.
 */
export async function fetchSeoConfig(): Promise<SeoConfig> {
    const snap = await getDoc(docRef())
    if (!snap.exists()) return { ...DEFAULT_SEO }
    const data = snap.data()
    // Merge with defaults so new fields are always present
    return { ...DEFAULT_SEO, ...data } as SeoConfig
}

// ─── Save ─────────────────────────────────────────────────────────────────────

/**
 * Persist SEO config to Firestore (merge so other fields are preserved).
 */
export async function saveSeoConfig(config: SeoConfig): Promise<void> {
    await setDoc(
        docRef(),
        { ...config, updatedAt: serverTimestamp() },
        { merge: true },
    )
}
