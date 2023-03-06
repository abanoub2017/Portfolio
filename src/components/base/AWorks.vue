<template>
  <!-- works -->
  <div id="works" class="py-40 dark:bg-slate-900">
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

        <!-- card -->
        <template v-if="workList">
          <template v-for="work in workList">
            <AbCard :link=work.link :img=work.img>
              <template #content>
                {{ work.content }}
              </template>
            </AbCard>
          </template>
        </template>
        <template v-else>
          <AbCardSkeleton v-for="item in 8"/>
        </template>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
const workList = ref(
  [
    {
      link: 'https://www.mcdougallinsurance.com/',
      img: '/src/assets/img/work/Mc.png',
      content: 'mcdougallinsurance'
    },
    {
      link: 'https://dgsmithinsurance.com/',
      img: '/src/assets/img/work/Dg.png',
      content: 'dgsmithinsurance'
    },
    {
      link: 'https://platform.we.care/',
      img: '/src/assets/img/work/weCare.png',
      content: 'We Care'
    },
    {
      link: 'https://www.ccvinsurance.com/',
      img: '/src/assets/img/work/CCV.png',
      content: 'ccvinsurance'
    },
    {
      link: 'https://www.rogersinsurance.ca/',
      img: '/src/assets/img/work/rog.png',
      content: 'rogersinsurance'
    },
    {
      link: 'https://sharpinsurance.ca/',
      img: '/src/assets/img/work/sharp.png',
      content: 'sharpinsurance'
    },
    {
      link: 'https://trudocgroup.com',
      img: '/src/assets/img/work/trudoc.png',
      content: 'trudocgroup'
    },
    {
      link: 'https://sobekit.co.za/',
      img: '/src/assets/img/work/sobek.png',
      content: 'sobekit'
    },
    //  {
    //   link:'https://reach.link/',
    //   img:'/src/assets/img/work/reach.png',
    //   content:'Reach Link'
    //  },
    //  {
    //   link:'https://www.axa-egypt.com/',
    //   img:'/src/assets/img/work/axa.png',
    //   content:'Axa Egypt'
    //  },
  ]
)
</script>
  
<style lang="scss" scoped></style>