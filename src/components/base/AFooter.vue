<template>
  <footer class="bg-slate-900 border-t border-slate-800">

    <!-- main footer content -->
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- brand -->
        <div class="flex flex-col gap-4">
          <span class="text-2xl font-extrabold text-white tracking-tight">Abanoub<span
              class="text-indigo-400">.</span></span>
          <p class="text-slate-400 text-sm leading-relaxed max-w-xs">
            Senior Frontend Engineer specializing in Vue 3, Nuxt, and TypeScript. Building fast, accessible, and
            beautiful web products.
          </p>
          <!-- social -->
          <div class="flex gap-3 mt-1">
            <a href="https://github.com/abanoub2017" target="_blank" rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/abanoub-george-9235b1160/" target="_blank" rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="LinkedIn">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- quick links -->
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-widest mb-5">Quick Links</h3>
          <ul class="flex flex-col gap-3">
            <li v-for="link in navLinks" :key="link.href">
              <a :href="link.href"
                class="text-slate-400 hover:text-indigo-400 text-sm transition-colors flex items-center gap-2 group">
                <span class="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- contact snippet -->
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-widest mb-5">Get In Touch</h3>
          <ul class="flex flex-col gap-3">
            <li>
              <a :href="'mailto:' + email" class="text-slate-400 hover:text-indigo-400 text-sm transition-colors">{{
                email }}</a>
            </li>
            <li>
              <a :href="'tel:' + phone" class="text-slate-400 hover:text-indigo-400 text-sm transition-colors">{{ phone
              }}</a>
            </li>
            <li>
              <a href="#contact"
                class="inline-flex items-center gap-2 mt-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors">
                Send a Message
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- bottom bar -->
    <div class="border-t border-slate-800">
      <div class="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-slate-500 text-xs">© {{ currentYear }} Abanoub George. All rights reserved.</p>
        <p class="text-slate-600 text-xs">Built with ❤️ by Abanoub George</p>
      </div>
    </div>

  </footer>
</template>

<script setup lang="ts">
const currentYear: number = new Date().getFullYear()
const phone: string = ['010', '156', '314', '74'].join('')
const email: string = ['abanoubgeorge136', '@', 'gmail.com'].join('')

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#skills', label: 'Skills' },
  { href: '#works', label: 'Works' },
  { href: '#contact', label: 'Contact' },
]
</script>

<style lang="scss" scoped></style>