import type { App } from 'vue'
import VueSmoothScroll from 'vue3-smooth-scroll'

export function useSmoothScroll(app: App): void {
  app.use(VueSmoothScroll, {
    duration: 400,
    updateHistory: true,
  })
}