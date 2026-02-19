import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
// Temporarily remove UnheadVite to resolve compatibility issues
// import UnheadVite from '@unhead/addons/vite'

// https://vitejs.dev/config/
export default defineConfig({
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
    // Only prerender public pages; admin stays as a client-side SPA
    includedRoutes(paths) {
      return paths.filter((p) => !p.startsWith('/admin'))
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
});
