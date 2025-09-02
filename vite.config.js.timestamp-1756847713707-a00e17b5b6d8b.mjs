// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/abanoubgeorgefawzy/Documents/perosnal_projects/Portfolio/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/abanoubgeorgefawzy/Documents/perosnal_projects/Portfolio/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///Users/abanoubgeorgefawzy/Documents/perosnal_projects/Portfolio/node_modules/unplugin-vue-components/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///Users/abanoubgeorgefawzy/Documents/perosnal_projects/Portfolio/vite.config.js";
var vite_config_default = defineConfig({
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
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWJhbm91Ymdlb3JnZWZhd3p5L0RvY3VtZW50cy9wZXJvc25hbF9wcm9qZWN0cy9Qb3J0Zm9saW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hYmFub3ViZ2VvcmdlZmF3enkvRG9jdW1lbnRzL3Blcm9zbmFsX3Byb2plY3RzL1BvcnRmb2xpby92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYWJhbm91Ymdlb3JnZWZhd3p5L0RvY3VtZW50cy9wZXJvc25hbF9wcm9qZWN0cy9Qb3J0Zm9saW8vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbi8vIFRlbXBvcmFyaWx5IHJlbW92ZSBVbmhlYWRWaXRlIHRvIHJlc29sdmUgY29tcGF0aWJpbGl0eSBpc3N1ZXNcbi8vIGltcG9ydCBVbmhlYWRWaXRlIGZyb20gJ0B1bmhlYWQvYWRkb25zL3ZpdGUnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgLy8gVW5oZWFkVml0ZSgpLFxuICAgIC8qKlxuICAgICAqIHVucGx1Z2luLXZ1ZS1jb21wb25lbnRzIHBsdWdpbiBpcyByZXNwb25zaWJsZSBvZiBhdXRvbG9hZGluZyBjb21wb25lbnRzXG4gICAgICogZG9jdW1lbnRhdGlvbiBhbmQgbWQgZmlsZSBhcmUgbG9hZGVkIGZvciBlbGVtZW50cyBhbmQgY29tcG9uZW50cyBzZWN0aW9uc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICAgKi9cbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGRpcnM6IFtcInNyYy9jb21wb25lbnRzXCIsIFwic3JjL2xheW91dHNcIiwgXCJzcmMvdmlld3NcIl0sXG4gICAgICBleHRlbnNpb25zOiBbXCJ2dWVcIiwgXCJtZFwiXSxcbiAgICAgIGR0czogdHJ1ZSxcbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXG4gICAgfSksXG4gIF0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYXBpOiBcIm1vZGVybi1jb21waWxlclwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStXLFNBQVMsZUFBZSxXQUFXO0FBRWxaLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUorTSxJQUFNLDJDQUEyQztBQVN2UixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVFKLFdBQVc7QUFBQSxNQUNULE1BQU0sQ0FBQyxrQkFBa0IsZUFBZSxXQUFXO0FBQUEsTUFDbkQsWUFBWSxDQUFDLE9BQU8sSUFBSTtBQUFBLE1BQ3hCLEtBQUs7QUFBQSxNQUNMLFNBQVMsQ0FBQyxVQUFVLGNBQWMsT0FBTztBQUFBLElBQzNDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
