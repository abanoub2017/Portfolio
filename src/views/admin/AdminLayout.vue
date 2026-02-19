<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AdminToast from '@/components/admin/AdminToast.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(true)

// Dynamic title per admin sub-page; noindex keeps it out of search engines
const pageTitle = computed(() => {
    const name = route.name as string | undefined
    const map: Record<string, string> = {
        'admin-dashboard': 'Dashboard',
        'admin-section-edit': 'Edit Section',
        'admin-seo': 'SEO Settings',
        'admin-login': 'Admin Login',
    }
    const label = name ? (map[name] ?? 'Admin') : 'Admin'
    return `${label} — Portfolio CMS`
})

useHead({
    title: pageTitle,
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

async function handleSignOut(): Promise<void> {
    await authStore.signOut()
    router.push({ name: 'admin-login' })
}
</script>

<template>
    <div class="min-h-screen bg-gray-950 flex">

        <!-- ─── Sidebar ─────────────────────────────────────────────────────────── -->
        <aside class="flex flex-col shrink-0 bg-gray-900 border-r border-gray-800 transition-all duration-300"
            :class="sidebarOpen ? 'w-60' : 'w-16'">
            <!-- Brand -->
            <div class="flex items-center h-16 border-b border-gray-800 shrink-0 transition-all duration-300"
                :class="sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span v-if="sidebarOpen" class="text-white font-semibold text-sm truncate">Portfolio CMS</span>
            </div>

            <!-- Nav links -->
            <nav class="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                <!-- Sections -->
                <router-link :to="{ name: 'admin-dashboard' }"
                    class="flex items-center py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-150"
                    :class="sidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'"
                    exact-active-class="!bg-indigo-600/20 !text-indigo-400">
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span v-if="sidebarOpen">Sections</span>
                </router-link>

                <!-- SEO Settings -->
                <router-link :to="{ name: 'admin-seo' }"
                    class="flex items-center py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-150"
                    :class="sidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'"
                    active-class="!bg-indigo-600/20 !text-indigo-400">
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                    </svg>
                    <span v-if="sidebarOpen">SEO Settings</span>
                </router-link>
            </nav>

            <!-- Footer: toggle + sign out -->
            <div class="border-t border-gray-800 p-2 space-y-1 shrink-0">
                <!-- Collapse toggle -->
                <button @click="sidebarOpen = !sidebarOpen"
                    class="w-full flex items-center py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
                    :class="sidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'">
                    <svg class="w-5 h-5 shrink-0 transition-transform duration-300"
                        :class="{ 'rotate-180': !sidebarOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    <span v-if="sidebarOpen">Collapse</span>
                </button>

                <!-- Sign out -->
                <button @click="handleSignOut"
                    class="w-full flex items-center py-2 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    :class="sidebarOpen ? 'gap-3 px-3' : 'justify-center px-2'">
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span v-if="sidebarOpen">Sign out</span>
                </button>
            </div>
        </aside>

        <!-- ─── Main content ──────────────────────────────────────────────────────── -->
        <div class="flex-1 flex flex-col min-w-0 relative">
            <!-- Top bar -->
            <header class="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
                <h2 class="text-white font-semibold text-sm">
                    Portfolio Admin
                </h2>
                <div class="flex items-center gap-3">
                    <!-- Live site link -->
                    <a href="/" target="_blank" rel="noopener"
                        class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View site
                    </a>
                    <!-- Admin badge -->
                    <div class="flex items-center gap-2 pl-3 border-l border-gray-800">
                        <div class="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span class="text-white text-xs font-bold">A</span>
                        </div>
                        <span class="text-gray-300 text-xs font-medium">Admin</span>
                    </div>
                </div>
            </header>

            <!-- Page outlet -->
            <main class="flex-1 overflow-y-auto p-6">
                <RouterView />
            </main>
        </div>
    </div>

    <!-- Global toast notifications -->
    <AdminToast />
</template>
