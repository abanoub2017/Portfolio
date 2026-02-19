import type { RouteRecordRaw, Router } from 'vue-router'
import { watch } from 'vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/AdminLogin.vue'),
    meta: { requiresGuest: true }, // redirect away if already logged in
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboard.vue'),
      },
      {
        path: 'section/:id',
        name: 'admin-section-edit',
        component: () => import('../views/admin/AdminSectionEdit.vue'),
      },
    ],
  },
]

/**
 * Install the auth navigation guard.
 * Called from main.ts after ViteSSG creates the router instance.
 * Only runs on the client — SSG build skips this entirely.
 */
export function installRouterGuards(router: Router) {
  router.beforeEach(async (to) => {
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()

    // Wait for Firebase to restore the session before making any auth decision.
    if (!authStore.isReady) {
      await new Promise<void>((resolve) => {
        const stop = watch(
          () => authStore.isReady,
          (ready: boolean) => {
            if (ready) {
              stop()
              resolve()
            }
          },
          { immediate: true }
        )
      })
    }

    // Protect /admin/* — redirect to login if not authenticated
    if (to.meta.requiresAuth && !authStore.isAdmin) {
      return { name: 'admin-login' }
    }

    // Redirect already-logged-in admin away from the login page
    if (to.meta.requiresGuest && authStore.isAdmin) {
      return { name: 'admin-dashboard' }
    }
  })
}
