<template>
  <!-- contact -->
  <div id="contact" class="dark:bg-slate-900">
    <div class="container mx-auto">
      <!-- top -->
      <div class="flex flex-col gap-3 items-center">
        <h1 class="text-indigo-600 font-bold">CONTACT</h1>
        <h1 class="text-3xl dark:text-white">Have a Question?</h1>
        <p class="w-1/2 text-center text-gray-400">
          Do you have an idea? Let's discuss it and see what we can do
          together.
        </p>
      </div>
      <!-- bottom -->



      <form ref="form" @submit.prevent="sendEmail" class="mt-5 p-8 flex flex-col gap-5 items-center">
        <input class="p-2 w-full md:w-1/2 ring-1 ring-indigo-300 rounded-sm dark:bg-slate-800 dark:ring-0 dark:text-white"
          type="text" placeholder="Name Surname" name="user_name" v-model="userName" />
        <input class="p-2 w-full md:w-1/2 ring-1 ring-indigo-300 rounded-sm dark:bg-slate-800 dark:ring-0 dark:text-white"
          type="email" placeholder="Email" name="user_email" v-model="userEmail" />
        <textarea
          class="p-2 w-full md:w-1/2 ring-1 ring-indigo-300 rounded-sm dark:bg-slate-800 dark:ring-0 dark:text-white"
          cols="30" rows="10" placeholder="Message..." name="message" v-model="userMessgae"></textarea>
        <button type="submit" value="Send" :disabled="loading"
          class="w-1/2 bg-indigo-600 text-white font-medium px-3 py-2 text-center rounded-md cursor-pointer">
          <template v-if="loading">

            <svg aria-hidden="true" class="w-8 h-8 m-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
            Processing...
          </template>
          <template v-else>
            Submit
          </template>
        </button>
      </form>


      <div id="toast-bottom-left" v-if="loadingToast"
        class="fixed  bottom-5 right-5 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
        role="alert">
        <div
          class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
          <svg aria-hidden="true" class="w-5 h-5 text-blue-600 dark:text-blue-500" focusable="false" data-prefix="fas"
            data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor"
              d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z">
            </path>
          </svg>
          <span class="sr-only">Fire icon</span>
        </div>
        <div class="ml-3 text-sm font-normal">Message sent successfully.</div>
        <button type="button" @click="closeToast()"
          class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-default" aria-label="Close">
          <span class="sr-only">Close</span>
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser';
const form = ref(null)
const userEmail = ref(''),
  userName = ref(''),
  userMessgae = ref('')
const loading = ref(false)
const loadingToast = ref(false)
const sendEmail = () => {
  loading.value = true
  emailjs.sendForm('service_h0symdr', 'template_mfzvaqf', form.value, '48F8J9YCdoTb1s9A-')
    .then((result) => {
      loading.value = false
      userEmail.value = ''
      userName.value = ''
      userMessgae.value = ''
      loadingToast.value = true
    }, (error) => {
      loading.value = false

      console.log('FAILED...', error.text);
    });
}

const closeToast = () => {
  loadingToast.value = false
}

</script>
  
<style lang="scss" scoped></style>