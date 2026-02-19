import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type User } from 'firebase/auth'
import { signInWithEmail, signOutUser, onAuthChange } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isReady = ref(false) // true once Firebase has restored session from localStorage

    // Single source of truth — listens for auth state on every page load/refresh
    onAuthChange((firebaseUser) => {
        user.value = firebaseUser
        isReady.value = true
    })

    const isAdmin = computed(() => user.value !== null)

    async function signIn(email: string, password: string): Promise<void> {
        await signInWithEmail(email, password)
        // user.value is updated automatically by onAuthChange above
    }

    async function signOut(): Promise<void> {
        await signOutUser()
    }

    return { user, isAdmin, isReady, signIn, signOut }
})
