<template>
  <!-- works -->
  <div id="works" class="py-40 dark:bg-slate-900" ref="target">
    <div class="container mx-auto">
      <!-- top -->
      <div class="flex flex-col gap-3 items-center">
        <h1 class="text-indigo-600 font-bold">PORTFOLIO</h1>
        <h1 class="text-3xl dark:text-white">Works & Projects</h1>
        <p class="w-1/2 text-center text-gray-400">
          I help designers, small agencies and businesses bring their ideas to
          life. Powered by Figma, VS Code and coffee, I turn your requirements
          into a well-designed websites
        </p>
      </div>

      <!-- bottom -->
      <div class="p-5 sm:p-0 flex flex-wrap justify-between">
        <!-- Loading state -->
        <template v-if="!isIntersecting">
          <AbCardSkeleton v-for="n in 8" :key="n" />
        </template>

        <!-- Actual content when visible -->
        <template v-else>
          <template v-for="work in workList" :key="work.content">
            <AbCard :link="work.link" :img="getImageUrl(work.img)">
              <template #content>
                {{ work.content }}
              </template>
            </AbCard>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useIntersectionObserver } from '@/composables/useIntersectionObserver';

const { target, isIntersecting } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: '100px'
});

const workList = ref([
  {
    link: 'https://www.kemitt.com/',
    // img:'@/src/img/work/Mc.png',
    img: 'kemitt.png',
    content: 'kemitt'
  },
  {
    link: 'https://ads.nabd.com/',
    // img:'@/src/img/work/Mc.png',
    img: 'Nabd.png',
    content: 'Nabd'
  },
  {
    link: 'https://www.mcdougallinsurance.com/',
    // img:'@/src/img/work/Mc.png',
    img: 'Mc.png',
    content: 'mcdougallinsurance'
  },
  {
    link: 'https://dgsmithinsurance.com/',
    img: 'Dg.png',
    content: 'dgsmithinsurance'
  },
  {
    link: 'https://platform.we.care/',
    img: 'weCare.png',
    content: 'We Care'
  },
  {
    link: 'https://www.ccvinsurance.com/',
    img: 'CCV.png',
    content: 'ccvinsurance'
  },
  {
    link: 'https://www.rogersinsurance.ca/',
    img: 'rog.png',
    content: 'rogersinsurance'
  },
  {
    link: 'https://sharpinsurance.ca/',
    img: 'sharp.png',
    content: 'sharpinsurance'
  },
  {
    link: 'https://trudocgroup.com',
    img: 'trudoc.png',
    content: 'trudocgroup'
  },
  {
    link: 'https://sobekit.co.za/',
    img: 'sobek.png',
    content: 'sobekit'
  },
  //  {
  //   link:'https://reach.link/',
  //   img:'reach.png',
  //   content:'Reach Link'
  //  },
  //  {
  //   link:'https://www.axa-egypt.com/',
  //   img:'axa.png',
  //   content:'Axa Egypt'
  //  },
]
)

const getImageUrl = (name) => {
  return new URL(`../../assets/img/work/${name}`, import.meta.url).href
}
</script>

<style lang="scss" scoped></style>