/**
 * src/services/auth.service.ts
 *
 * All Firebase Auth operations.
 * The auth store consumes this — no component touches Firebase Auth directly.
 */

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
    type Unsubscribe,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/firebase'

/**
 * Sign in with email and password.
 * Throws a FirebaseError on failure — catch and map the error code in the UI.
 */
export async function signInWithEmail(
    email: string,
    password: string,
): Promise<User> {
    const { user } = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
    return user
}

/**
 * Sign out the current user.
 */
export async function signOutUser(): Promise<void> {
    await signOut(getFirebaseAuth())
}

/**
 * Subscribe to auth state changes.
 * Fires immediately with the current user (or null).
 * Returns the unsubscribe function.
 */
export function onAuthChange(
    callback: (user: User | null) => void,
): Unsubscribe {
    return onAuthStateChanged(getFirebaseAuth(), callback)
}
