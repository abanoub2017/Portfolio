import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueSmoothScroll from 'vue3-smooth-scroll'

import App from './App.vue'
import router from './router'

import './assets/scss/main.scss'
import './assets/css/tailwind.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueSmoothScroll, {
    duration: 400,
    updateHistory: false
  })
app.mount('#app')
