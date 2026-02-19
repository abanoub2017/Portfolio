import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { watch } from 'vue'

const routes: RouteRecordRaw[] = [
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ─── Navigation Guard ────────────────────────────────────────────────────────
// Lazily import to avoid circular dependency (store uses router, router uses store)
router.beforeEach(async (to) => {
  const { useAuthStore } = await import('../stores/auth')
  const authStore = useAuthStore()

  // Wait for Firebase to restore the session before making any auth decision.
  // Without this, a page refresh always redirects to /admin/login incorrectly.
  if (!authStore.isReady) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => authStore.isReady,
        (ready) => {
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

export default router
