/**
 * scripts/generate-rss.ts
 *
 * Fetches all published blog posts from Firestore and writes public/rss.xml.
 * Run automatically as the `prebuild` npm script via tsx.
 *
 * Usage:  npx tsx scripts/generate-rss.ts
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// ─── Load .env so process.env has VITE_FIREBASE_* vars ───────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env') })

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

// ─── Config ──────────────────────────────────────────────────────────────────
const SITE_URL = 'https://abanoubgeorge.net'
const FEED_URL = `${SITE_URL}/rss.xml`
const OUT_PATH = resolve(__dirname, '../public/rss.xml')

// ─── Init Firebase (plain SDK, no persistence needed in Node) ────────────────
const firebaseConfig = {
    apiKey: process.env['VITE_FIREBASE_API_KEY'],
    authDomain: process.env['VITE_FIREBASE_AUTH_DOMAIN'],
    projectId: process.env['VITE_FIREBASE_PROJECT_ID'],
    storageBucket: process.env['VITE_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: process.env['VITE_FIREBASE_MESSAGING_SENDER_ID'],
    appId: process.env['VITE_FIREBASE_APP_ID'],
}

let app: FirebaseApp
try {
    app = initializeApp(firebaseConfig)
} catch {
    // Already initialised (e.g. running script twice in same process)
    app = initializeApp(firebaseConfig, 'rss-gen')
}

const db = getFirestore(app)

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Escape characters that are illegal inside XML text / attribute values. */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

/** Format a Date (or Firestore Timestamp) as RFC-822 for RSS <pubDate>. */
function toRfc822(value: unknown): string {
    let date: Date
    if (value instanceof Date) {
        date = value
    } else if (value && typeof (value as any).toDate === 'function') {
        date = (value as any).toDate()
    } else {
        date = new Date()
    }
    return date.toUTCString()
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log('📡 Fetching published posts from Firestore…')

    const snap = await getDocs(
        query(
            collection(db, 'blogPosts'),
            where('isPublished', '==', true),
        ),
    )

    const posts = (snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{
        id: string
        title: string
        slug: string
        excerpt: string
        category: string
        tags: string[]
        publishDate: unknown
        coverImageBase64: string
    }>).sort((a, b) => {
        const toMs = (v: unknown) => {
            if (v instanceof Date) return v.getTime()
            if (v && typeof (v as any).toDate === 'function') return (v as any).toDate().getTime()
            return 0
        }
        return toMs(b.publishDate) - toMs(a.publishDate)
    })

    console.log(`✅ ${posts.length} published post(s) found`)

    const buildDate = new Date().toUTCString()

    const items = posts
        .map((p) => {
            const url = `${SITE_URL}/blog/${encodeURIComponent(p.slug)}`
            const tags = (p.tags ?? []).map((t) => `    <category>${escapeXml(t)}</category>`).join('\n')
            return `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${toRfc822(p.publishDate)}</pubDate>
    <description>${escapeXml(p.excerpt)}</description>
    <category>${escapeXml(p.category)}</category>
${tags}
  </item>`
        })
        .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Abanoub George — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles on Vue.js, TypeScript, Firebase and front-end engineering by Abanoub George.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/img/profile.png</url>
      <title>Abanoub George — Blog</title>
      <link>${SITE_URL}/blog</link>
    </image>
${items}
  </channel>
</rss>
`

    writeFileSync(OUT_PATH, xml, 'utf-8')
    console.log(`📄 RSS feed written to public/rss.xml (${posts.length} items)`)
    process.exit(0)
}

main().catch((err) => {
    console.error('❌ RSS generation failed:', err)
    process.exit(1)
})
