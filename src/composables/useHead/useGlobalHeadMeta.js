import { useHead, useServerHead, useServerSeoMeta, useSeoMeta } from "unhead";
// title: 'My Page',
// meta: [
//   {
//     name: 'description',
//     content: 'My page description',
//   },
// ],
export function useGlobalHeadMeta(title , description , keywords) {
  const globalHead = useHead({
    title: title,
    meta: [
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content: keywords,
        }
      ],
      
  });
  const globalSeoHead = useSeoMeta({
    title: title,
    description: description,
    ogDescription:description,
    ogTitle: title,
    ogImage: 'https://abanoubgeorge.info/img/profile.png',
  });

  return {
    globalHead,
    globalSeoHead,
  };
}
