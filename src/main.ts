import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createGtag } from 'vue-gtag'

import App from './App.vue'
import { routes, installRouterGuards } from './router'

import './assets/scss/main.scss'
import './assets/css/tailwind.css'

export const createApp = ViteSSG(
    App,
    // vue-router options — ViteSSG creates the router internally
    {
        routes,
        base: import.meta.env.BASE_URL,
    },
    // Setup callback — runs for both SSG build and client hydration
    ({ app, router, isClient }) => {
        app.use(createPinia())

        // Register a no-op smooth-scroll directive for SSR
        // (the real one will be installed below on the client)
        if (!isClient) {
            app.directive('smooth-scroll', {})
        }

        // ─── Client-only plugins ────────────────────────────────────────────────
        if (isClient) {
            // Vue-gtag (Google Analytics)
            const gtagPlugin = import.meta.env.VITE_GA_MEASUREMENT_ID
                ? createGtag({ tagId: import.meta.env.VITE_GA_MEASUREMENT_ID })
                : null
            if (gtagPlugin) app.use(gtagPlugin)

            // Smooth scroll plugin (needs DOM)
            import('./composables/useSmoothScroll').then(({ useSmoothScroll }) => {
                useSmoothScroll(app)
            })

            // Auth navigation guards (Firebase is client-only)
            installRouterGuards(router)
        }
    },
)
