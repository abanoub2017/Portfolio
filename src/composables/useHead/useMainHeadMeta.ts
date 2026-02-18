import type { App } from 'vue'
import { createHead } from 'unhead'

export function useMainHeadMeta(app: App): void {
  app.use(createHead())
}
