import type { RouteRecordRaw, Router } from 'vue-router'
import { watch } from 'vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogListView.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('../views/BlogPostView.vue'),
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
      {
        path: 'seo',
        name: 'admin-seo',
        component: () => import('../views/admin/AdminSeoSettings.vue'),
      },
      {
        path: 'blog',
        name: 'admin-blog',
        component: () => import('../views/admin/AdminBlogList.vue'),
      },
      {
        path: 'blog/new',
        name: 'admin-blog-new',
        component: () => import('../views/admin/AdminBlogEditor.vue'),
      },
      {
        path: 'blog/:id/edit',
        name: 'admin-blog-edit',
        component: () => import('../views/admin/AdminBlogEditor.vue'),
      },
      {
        path: 'blog/:id/preview',
        name: 'admin-blog-preview',
        component: () => import('../views/admin/AdminBlogPreview.vue'),
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
