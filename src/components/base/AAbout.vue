<template>
  <!-- about -->
  <div id="about" class="dark:bg-slate-900 section-spacing">
    <div class="container mx-auto w-full md:w-[70%] m-auto">
      <div class="my-auto flex flex-col gap-3">
        <h2 class="section-label">ABOUT ME</h2>
        <h3 class="section-title">Better Design, Better Experience</h3>
        <p class="text-gray-500 text-base">
          I'm Abanoub, a skilled front-end developer with over four years of experience creating user-friendly and
          responsive websites. My passion for design and user experience drives me to create visually appealing websites
          that are easy to navigate and engage with.

          With expertise in programming languages such as HTML5, CSS3, Vue.js, PHP, Nuxt.js, and Angular.js, I can
          develop
          new user-facing features, optimize web pages for maximum speed and scalability, and maintain brand consistency
          throughout the design. I have experience working with Agile management and using project management tools like
          Jira and Trello.

          If you have a project you'd like to discuss, feel free to reach out to me directly at:
        </p>
        <ul class="flex justify-start flex-wrap gap-5 dark:text-white">
          <li>
            <span class="font-bold">Phone: </span>
            <a :href="'tel:' + phone" class="text-blue-500 hover:underline">{{ phone }}</a>
          </li>
          <li>
            <span class="font-bold">Email: </span>
            <a :href="'mailto:' + email" class="text-blue-500 hover:underline">{{ email }}</a>
          </li>
          <li>
            <span class="font-bold">GitHub: </span>
            <a href="https://github.com/abanoub2017" class="text-blue-500 hover:underline" target="_blank"
              rel="noopener noreferrer">github.com/abanoub2017</a>
          </li>
          <li>
            <span class="font-bold">LinkedIn: </span>
            <a href="https://www.linkedin.com/in/abanoub-george-9235b1160/" class="text-blue-500 hover:underline"
              target="_blank" rel="noopener noreferrer">linkedin.com/in/abanoub-george</a>
          </li>
        </ul>
        <p class="text-gray-500">
          Thank you for taking the time to learn more about me and my work. I look forward to hearing from you soon.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Split to avoid plain-text scraping by bots
const phone: string = ['010', '156', '314', '74'].join('')
const email: string = ['abanoubgeorge136', '@', 'gmail.com'].join('')
</script>

<style lang="scss" scoped></style>