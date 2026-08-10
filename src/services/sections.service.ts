/**
 * src/services/sections.service.ts
 *
 * All Firestore operations for the `sections` collection.
 * Consumers (stores, components) import from here — never touch `db` directly.
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    type Unsubscribe,
    type DocumentData,
    type QuerySnapshot,
} from 'firebase/firestore'
import { getDb } from '@/firebase'
import type { Section, SectionContent, SectionType } from '@/types/sections'

const COLLECTION = 'sections'
const col = () => collection(getDb(), COLLECTION)
const sectionDoc = (id: string) => doc(getDb(), COLLECTION, id)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function snapToSection(snap: DocumentData): Section {
    const d = snap.data()
    return {
        id: snap.id,
        type: d.type as SectionType,
        order: d.order ?? 0,
        isActive: d.isActive ?? true,
        createdAt: d.createdAt ?? null,
        updatedAt: d.updatedAt ?? null,
        content: d.content as SectionContent,
    }
}

function snapshotToSections(snapshot: QuerySnapshot): Section[] {
    return snapshot.docs.map(snapToSection)
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * One-time fetch of ALL sections (admin use).
 */
export async function fetchAllSections(): Promise<Section[]> {
    const q = query(col(), orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    return snapshotToSections(snapshot)
}

/**
 * One-time fetch of only ACTIVE sections (public portfolio use).
 * Filtering and sorting done client-side to avoid requiring a composite Firestore index.
 */
export async function fetchActiveSections(): Promise<Section[]> {
    const q = query(col(), orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    return snapshotToSections(snapshot).filter(s => s.isActive)
}

/**
 * Fetch a single section by ID.
 */
export async function fetchSection(id: string): Promise<Section | null> {
    const snap = await getDoc(sectionDoc(id))
    if (!snap.exists()) return null
    return snapToSection(snap)
}

/**
 * Real-time listener — active sections only (public portfolio).
 * Filtering done client-side to avoid requiring a composite Firestore index.
 * Returns the unsubscribe function.
 */
export function subscribeActiveSections(
    callback: (sections: Section[]) => void,
): Unsubscribe {
    const q = query(col(), orderBy('order', 'asc'))
    return onSnapshot(q, (snapshot) => {
        callback(snapshotToSections(snapshot).filter(s => s.isActive))
    })
}

/**
 * Real-time listener — ALL sections (admin dashboard).
 * Returns the unsubscribe function.
 */
export function subscribeAllSections(
    callback: (sections: Section[]) => void,
): Unsubscribe {
    const q = query(col(), orderBy('order', 'asc'))
    return onSnapshot(q, (snapshot) => {
        callback(snapshotToSections(snapshot))
    })
}

/**
 * Create or fully replace a section document.
 */
export async function upsertSection(
    id: string,
    type: SectionType,
    order: number,
    content: SectionContent,
    isActive = true,
): Promise<void> {
    await setDoc(sectionDoc(id), {
        id,
        type,
        order,
        isActive,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
}

/**
 * Partial update (e.g. toggle isActive, change order, update content).
 */
export async function patchSection(
    id: string,
    patch: Partial<Pick<Section, 'isActive' | 'order' | 'content'>>,
): Promise<void> {
    await updateDoc(sectionDoc(id), {
        ...patch,
        updatedAt: serverTimestamp(),
    })
}

/**
 * Update only the content field of a section.
 */
export async function updateSectionContent(
    id: string,
    content: SectionContent,
): Promise<void> {
    await updateDoc(sectionDoc(id), {
        content,
        updatedAt: serverTimestamp(),
    })
}

/**
 * Delete a section document.
 */
export async function deleteSection(id: string): Promise<void> {
    await deleteDoc(sectionDoc(id))
}

/**
 * Batch-update the `order` field for multiple sections at once (drag-and-drop reorder).
 * Accepts an array of { id, order } pairs.
 */
export async function reorderSections(
    items: { id: string; order: number }[],
): Promise<void> {
    await Promise.all(
        items.map(({ id, order }) =>
            updateDoc(sectionDoc(id), {
                order,
                updatedAt: serverTimestamp(),
            }),
        ),
    )
}
