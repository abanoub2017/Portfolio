<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'

useHead({
    title: 'Admin Login — Portfolio CMS',
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const errorMessage = computed(() => {
    const map: Record<string, string> = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with that email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many failed attempts. Try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
    }
    return map[error.value] ?? 'Something went wrong. Please try again.'
})

async function handleLogin(): Promise<void> {
    if (!email.value || !password.value) return
    error.value = ''
    loading.value = true
    try {
        await authStore.signIn(email.value, password.value)
        router.push({ name: 'admin-dashboard' })
    } catch (err: unknown) {
        error.value = (err as { code?: string }).code ?? 'unknown'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div class="w-full max-w-sm">
            <!-- Logo / Title -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p class="text-gray-400 text-sm mt-1">Sign in to manage your portfolio</p>
            </div>

            <!-- Card -->
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                <form @submit.prevent="handleLogin" novalidate>
                    <!-- Email -->
                    <div class="mb-5">
                        <label for="email" class="block text-sm font-medium text-gray-300 mb-1.5">
                            Email address
                        </label>
                        <input id="email" v-model="email" type="email" autocomplete="email"
                            placeholder="you@example.com" required class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition duration-150" />
                    </div>

                    <!-- Password -->
                    <div class="mb-6">
                        <label for="password" class="block text-sm font-medium text-gray-300 mb-1.5">
                            Password
                        </label>
                        <input id="password" v-model="password" type="password" autocomplete="current-password"
                            placeholder="••••••••" required class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition duration-150" />
                    </div>

                    <!-- Error message -->
                    <div v-if="error"
                        class="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                        <svg class="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-red-400 text-sm">{{ errorMessage }}</p>
                    </div>

                    <!-- Submit -->
                    <button type="submit" :disabled="loading"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500
                   disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl
                   transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                        <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
                    </button>
                </form>
            </div>

            <!-- Back link -->
            <p class="text-center mt-6">
                <router-link to="/" class="text-sm text-gray-500 hover:text-gray-300 transition">
                    ← Back to portfolio
                </router-link>
            </p>
        </div>
    </div>
</template>
