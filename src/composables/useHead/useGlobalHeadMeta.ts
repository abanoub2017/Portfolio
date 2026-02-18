import { useHead, useServerHead, useServerSeoMeta, useSeoMeta } from "unhead";

const SITE_URL = 'https://abanoubgeorge.net'
const OG_IMAGE = `${SITE_URL}/img/profile.png`

export function useGlobalHeadMeta(title: string, description: string, keywords: string) {
  const globalHead = useHead({
    title: title,
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Abanoub George',
          url: SITE_URL,
          image: OG_IMAGE,
          jobTitle: 'Frontend Developer',
          description: description,
          sameAs: [
            'https://www.linkedin.com/in/abanoub-george-9235b1160/',
            'https://github.com/abanoub2017',
          ],
          knowsAbout: keywords.split(',').map((k) => k.trim()),
          offers: {
            '@type': 'Offer',
            itemOffered: [
              { '@type': 'Service', name: 'UI / UX Design' },
              { '@type': 'Service', name: 'Frontend Development' },
              { '@type': 'Service', name: 'Performance Optimization' },
            ],
          },
        }),
      },
    ],
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: 'Abanoub George' },
      { property: 'og:image', content: OG_IMAGE },
    ],
  });
  const globalServerHead = useServerHead({
    title: title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: 'Abanoub George' },
      { property: 'og:image', content: OG_IMAGE },
    ],
  });
  const globalSeoHead = useSeoMeta({
    title: title,
    description: description,
    ogDescription: description,
    ogTitle: title,
    ogImage: OG_IMAGE,
    ogUrl: SITE_URL,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: OG_IMAGE,
  });

  const globalServerSeoHead = useServerSeoMeta({
    title: title,
    description: description,
    ogDescription: description,
    ogTitle: title,
    ogImage: OG_IMAGE,
  });

  return {
    globalHead,
    globalServerHead,
    globalSeoHead,
    globalServerSeoHead,
  };
}
