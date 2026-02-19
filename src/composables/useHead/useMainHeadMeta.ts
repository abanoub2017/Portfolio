// No longer needed — vite-ssg installs @unhead/vue automatically.
// Kept as an empty re-export so any existing import doesn't break.
import type { App } from 'vue'

export function useMainHeadMeta(_app: App): void {
  // noop — head is now managed by vite-ssg + @unhead/vue
}
