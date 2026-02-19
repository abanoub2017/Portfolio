/**
 * src/stores/seo.ts
 *
 * Pinia store for SEO configuration.
 *
 * - On app mount: call `load()` to pull from Firestore (falls back to defaults)
 * - Admin: call `save(config)` to persist edits
 * - `useGlobalHeadMeta` reads `config` reactively via computed refs
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchSeoConfig, saveSeoConfig, DEFAULT_SEO } from '@/services/seo.service'
import type { SeoConfig } from '@/types/seo'

export const useSeoStore = defineStore('seo', () => {
    const config = ref<SeoConfig>({ ...DEFAULT_SEO })
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    /** Fetch SEO config from Firestore. Safe to call on every page load. */
    async function load() {
        // Don't re-fetch if already loaded (title has been overwritten from defaults
        // only if a Firestore doc exists, so we always load once per session)
        isLoading.value = true
        error.value = null
        try {
            config.value = await fetchSeoConfig()
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to load SEO config'
        } finally {
            isLoading.value = false
        }
    }

    /** Persist updated SEO config to Firestore and update the local reactive state. */
    async function save(newConfig: SeoConfig) {
        await saveSeoConfig(newConfig)
        config.value = { ...newConfig }
    }

    return { config, isLoading, error, load, save }
})
