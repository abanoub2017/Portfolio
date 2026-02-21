import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
// Temporarily remove UnheadVite to resolve compatibility issues
// import UnheadVite from '@unhead/addons/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars so we can use them in ssgOptions at build time
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      // UnheadVite(),
      /**
       * unplugin-vue-components plugin is responsible of autoloading components
       * documentation and md file are loaded for elements and components sections
       *
       * @see https://github.com/antfu/unplugin-vue-components
       */
      Components({
        dirs: ["src/components", "src/layouts", "src/views"],
        extensions: ["vue", "md"],
        dts: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),
    ],

    // ─── SSG (Static Site Generation) ───────────────────────────────────────
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      // Pre-render all public pages + every published blog slug at build time.
      // A dedicated Firebase app is initialised here (no IndexedDB/persistent
      // cache) purely to fetch the slug list during the Node build process.
      async includedRoutes(paths) {
        const publicPaths = paths.filter((p) => !p.startsWith('/admin'))

        // Only attempt Firestore fetch when env vars are present (i.e. CI build)
        if (!env.VITE_FIREBASE_PROJECT_ID || !env.VITE_FIREBASE_API_KEY) {
          console.warn('[SSG] Firebase env vars missing — skipping blog slug pre-render')
          return publicPaths
        }

        try {
          const { initializeApp, deleteApp } = await import('firebase/app')
          const { getFirestore, getDocs, collection, query, where } = await import('firebase/firestore')

          // Use a unique app name so it never conflicts with the runtime app
          const buildApp = initializeApp(
            {
              apiKey: env.VITE_FIREBASE_API_KEY,
              authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
              projectId: env.VITE_FIREBASE_PROJECT_ID,
              storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
              messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
              appId: env.VITE_FIREBASE_APP_ID,
            },
            'ssg-build',
          )

          const db = getFirestore(buildApp)
          const snap = await getDocs(
            query(collection(db, 'blogPosts'), where('isPublished', '==', true)),
          )

          const slugRoutes = snap.docs
            .map((d) => d.data()['slug'] as string)
            .filter(Boolean)
            .map((slug) => `/blog/${slug}`)

          console.log(`[SSG] Pre-rendering ${slugRoutes.length} blog post(s):`, slugRoutes)

          await deleteApp(buildApp)
          return [...publicPaths, ...slugRoutes]
        } catch (err) {
          console.error('[SSG] Failed to fetch blog slugs — falling back to client-side only:', err)
          return publicPaths
        }
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  }
})
