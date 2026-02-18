<template>
  <section id="contact" class="bg-gray-50 dark:bg-slate-900 section-spacing" ref="target">
    <div class="container mx-auto">

      <div class="section-header mb-14">
        <span class="section-label">Contact</span>
        <h2 class="section-title">Let's Work Together</h2>
        <p class="section-subtitle">Have a project in mind? I'd love to hear about it.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        <!-- LEFT: info -->
        <div class="flex flex-col gap-6">
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            I'm currently open to new opportunities — freelance projects, full-time roles, or just a friendly chat
            about frontend architecture. Drop me a message and I'll get back to you within 24 hours.
          </p>

          <div class="flex flex-col gap-4">
            <a :href="'mailto:' + email"
              class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group">
              <span
                class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Email</p>
                <p class="text-sm font-semibold text-gray-700 dark:text-white">{{ email }}</p>
              </div>
            </a>

            <a :href="'tel:' + phone"
              class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group">
              <span
                class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </span>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Phone</p>
                <p class="text-sm font-semibold text-gray-700 dark:text-white">{{ phone }}</p>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/abanoub-george-9235b1160/" target="_blank" rel="noopener noreferrer"
              class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group">
              <span
                class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">LinkedIn</p>
                <p class="text-sm font-semibold text-gray-700 dark:text-white">linkedin.com/in/abanoub-george</p>
              </div>
            </a>
          </div>
        </div>

        <!-- RIGHT: form -->
        <div v-if="isIntersecting"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 shadow-sm">
          <form @submit.prevent="sendEmail" class="flex flex-col gap-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <label for="contact-name"
                  class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full
                  Name</label>
                <input id="contact-name" type="text" name="name" v-model="userName" required
                  placeholder="Abanoub George"
                  class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="contact-email"
                  class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email
                  Address</label>
                <input id="contact-email" type="email" name="email" v-model="userEmail" required
                  placeholder="you@example.com"
                  class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="contact-message"
                class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Message</label>
              <textarea id="contact-message" name="message" v-model="userMessage" required rows="6"
                placeholder="Tell me about your project..."
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
            </div>
            <input type="text" name="botcheck" class="hidden" v-model="botcheck" />
            <button type="submit" :disabled="loading"
              class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              {{ loading ? 'Sending…' : 'Send Message' }}
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
        <div v-else
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 h-96 animate-pulse" />
      </div>

      <AbToast v-if="toast.show" @closeToast="toast.show = false" :message="toast.message" :type="toast.type" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { useAnalytics } from '@/composables/useAnalytics'

type ToastType = 'success' | 'error'
interface Toast { show: boolean; message: string; type: ToastType }

const { target, isIntersecting } = useIntersectionObserver({ threshold: 0.1, rootMargin: '100px' })
const { trackContactSubmit } = useAnalytics()

const phone: string = ['010', '156', '314', '74'].join('')
const email: string = ['abanoubgeorge136', '@', 'gmail.com'].join('')

const userName = ref('')
const userEmail = ref('')
const userMessage = ref('')
const botcheck = ref('')
const loading = ref(false)
const toast = reactive<Toast>({ show: false, message: '', type: 'success' })

const sendEmail = async (): Promise<void> => {
  if (botcheck.value) return
  loading.value = true
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
        name: userName.value,
        email: userEmail.value,
        message: userMessage.value,
      }),
    })
    const data = await res.json()
    if (data.success) {
      toast.message = "Message sent! I'll get back to you within 24 hours."
      toast.type = 'success'
      userName.value = ''
      userEmail.value = ''
      userMessage.value = ''
      trackContactSubmit()
    } else {
      throw new Error(data.message)
    }
  } catch {
    toast.message = 'Something went wrong. Please email me directly.'
    toast.type = 'error'
  } finally {
    loading.value = false
    toast.show = true
  }
}
</script>

<style lang="scss" scoped></style>