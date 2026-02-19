/**
 * src/stores/sections.ts
 *
 * Pinia store for portfolio sections.
 *
 * - Public site:  calls `startPublicListener()` → real-time onSnapshot (active only)
 * - Admin panel:  calls `startAdminListener()`  → real-time onSnapshot (all sections)
 * - Always clean up with `stopListener()` in onUnmounted
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Unsubscribe } from 'firebase/firestore'
import {
    subscribeActiveSections,
    subscribeAllSections,
    patchSection,
    updateSectionContent,
    deleteSection,
    reorderSections,
} from '@/services/sections.service'
import type { Section, SectionContent, SectionType } from '@/types/sections'

export const useSectionsStore = defineStore('sections', () => {
    const sections = ref<Section[]>([])
    const isLoading = ref(true)
    const error = ref<string | null>(null)

    let _unsub: Unsubscribe | null = null

    // ─── Helpers ──────────────────────────────────────────────────────────────

    function _stopAndClear() {
        if (_unsub) { _unsub(); _unsub = null }
    }

    function _handleSnapshot(incoming: Section[]) {
        sections.value = incoming
        isLoading.value = false
    }

    function _handleError(err: unknown) {
        error.value = err instanceof Error ? err.message : 'Unknown error'
        isLoading.value = false
    }

    // ─── Listeners ────────────────────────────────────────────────────────────

    /** Start real-time listener for active sections (public portfolio). */
    function startPublicListener() {
        _stopAndClear()
        isLoading.value = true
        try {
            _unsub = subscribeActiveSections(_handleSnapshot)
        } catch (err) {
            _handleError(err)
        }
    }

    /** Start real-time listener for ALL sections (admin dashboard). */
    function startAdminListener() {
        _stopAndClear()
        isLoading.value = true
        try {
            _unsub = subscribeAllSections(_handleSnapshot)
        } catch (err) {
            _handleError(err)
        }
    }

    /** Unsubscribe from Firestore (call in onUnmounted). */
    function stopListener() {
        _stopAndClear()
    }

    // ─── Write operations ─────────────────────────────────────────────────────

    async function toggleSection(id: string, isActive: boolean) {
        await patchSection(id, { isActive })
    }

    async function saveContent(id: string, content: SectionContent) {
        await updateSectionContent(id, content)
    }

    async function removeSection(id: string) {
        await deleteSection(id)
    }

    async function reorder(items: { id: string; order: number }[]) {
        await reorderSections(items)
    }

    // ─── Computed ─────────────────────────────────────────────────────────────

    function byType<T extends SectionContent>(type: SectionType) {
        return computed(() =>
            sections.value.find((s) => s.type === type)?.content as T | undefined,
        )
    }

    return {
        sections,
        isLoading,
        error,
        startPublicListener,
        startAdminListener,
        stopListener,
        toggleSection,
        saveContent,
        removeSection,
        reorder,
        byType,
    }
})
