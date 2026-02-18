import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createGtag } from 'vue-gtag'

import App from './App.vue'
import router from './router'

import { useSmoothScroll } from './composables/useSmoothScroll'
import { useMainHeadMeta } from './composables/useHead/useMainHeadMeta'

import './assets/scss/main.scss'
import './assets/css/tailwind.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
    createGtag({
        tagId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    })
)
useSmoothScroll(app)
useMainHeadMeta(app)

app.mount('#app')
