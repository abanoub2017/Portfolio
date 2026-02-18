export interface WorkItem {
  link: string
  img: string
  content: string
  tag?: string
}

/** Portfolio work/project list. Add or remove entries here to update the Works section. */
export const workList: WorkItem[] = [
  { link: 'https://www.kemitt.com/', img: 'kemitt.png', content: 'Kemitt', tag: 'E-Commerce' },
  { link: 'https://ads.nabd.com/', img: 'Nabd.png', content: 'Nabd', tag: 'Ad Platform' },
  { link: 'https://deals.nabd.com/', img: 'NabdDeals.png', content: 'Nabd Deals', tag: 'E-Commerce' },
  { link: 'https://www.mcdougallinsurance.com/', img: 'Mc.png', content: 'McDougall Insurance', tag: 'Insurance' },
  { link: 'https://dgsmithinsurance.com/', img: 'Dg.png', content: 'DG Smith Insurance', tag: 'Insurance' },
  { link: 'https://platform.we.care/', img: 'weCare.png', content: 'We Care', tag: 'Healthcare' },
  { link: 'https://www.ccvinsurance.com/', img: 'CCV.png', content: 'CCV Insurance', tag: 'Insurance' },
  { link: 'https://www.rogersinsurance.ca/', img: 'rog.png', content: 'Rogers Insurance', tag: 'Insurance' },
  { link: 'https://sharpinsurance.ca/', img: 'sharp.png', content: 'Sharp Insurance', tag: 'Insurance' },
  { link: 'https://trudocgroup.com', img: 'trudoc.png', content: 'Trudoc Group', tag: 'Healthcare' },
  { link: 'https://sobekit.co.za/', img: 'sobek.png', content: 'Sobekit', tag: 'E-Commerce' },
]
