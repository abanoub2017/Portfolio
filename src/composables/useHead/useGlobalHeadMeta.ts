import { computed } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useSeoStore } from '@/stores/seo'

/**
 * Sets all global head/SEO tags reactively from the Firestore-backed SEO store.
 * Call once in App.vue. Tags auto-update when the store is loaded or edited.
 */
export function useGlobalHeadMeta() {
  const store = useSeoStore()

  const title = computed(() => store.config.title)
  const description = computed(() => store.config.description)
  const keywords = computed(() => store.config.keywords)
  const siteUrl = computed(() => store.config.siteUrl)
  const ogImage = computed(() => store.config.ogImage)
  const authorName = computed(() => store.config.authorName)

  const jsonLd = computed(() =>
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: authorName.value,
      url: siteUrl.value,
      image: ogImage.value,
      jobTitle: 'Frontend Developer',
      description: description.value,
      sameAs: [
        'https://www.linkedin.com/in/abanoub-george-9235b1160/',
        'https://github.com/abanoub2017',
      ],
      knowsAbout: keywords.value.split(',').map((k) => k.trim()),
      offers: {
        '@type': 'Offer',
        itemOffered: [
          { '@type': 'Service', name: 'UI / UX Design' },
          { '@type': 'Service', name: 'Frontend Development' },
          { '@type': 'Service', name: 'Performance Optimization' },
        ],
      },
    }),
  )

  useHead({
    title,
    script: [{ type: 'application/ld+json', innerHTML: jsonLd }],
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: authorName },
      { property: 'og:image', content: ogImage },
    ],
  })

  useSeoMeta({
    title,
    description,
    ogDescription: description,
    ogTitle: title,
    ogImage,
    ogUrl: siteUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
  })
}
