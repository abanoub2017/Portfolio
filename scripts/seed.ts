/**
 * scripts/seed.ts
 *
 * One-time seed: pushes all current static portfolio data into Firestore.
 *
 * Run with:
 *   npx tsx scripts/seed.ts
 *
 * Requirements:
 *   - .env must be present with all VITE_FIREBASE_* values
 *   - tsx must be available: npm install -D tsx (already in devDeps if not, it installs fine)
 */

import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

// ─── Bootstrap Firebase (read env directly so seed works outside Vite) ────────

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ─── Seed data (mirrors current static content) ───────────────────────────────

const sections = [
    // ── About ──────────────────────────────────────────────────────────────────
    {
        id: 'about',
        type: 'about',
        order: 1,
        isActive: true,
        content: {
            bio: [
                "I'm a Senior Frontend Engineer with 5+ years of experience building fast, accessible, and scalable web products. My work spans from pixel-perfect UIs to full frontend architecture — always with a focus on performance, clean code, and user experience.",
                "I specialize in Vue 3 / Nuxt, TypeScript, and Tailwind CSS, and I'm experienced with Agile workflows, cross-functional teams, and delivery at scale. I care deeply about accessibility, core web vitals, and maintainability.",
                "I actively leverage AI tools (GitHub Copilot, ChatGPT, Cursor) to boost productivity and code quality. I also have solid knowledge of CI/CD pipelines and GitHub Actions — automating builds, tests, and deployments to keep delivery fast and reliable.",
            ],
            stats: [
                { value: '5+', label: 'Years of Experience' },
                { value: '30+', label: 'Projects Delivered' },
                { value: '10+', label: 'Happy Clients' },
                { value: '100%', label: 'Commitment to Quality' },
            ],
            stack: [
                'Vue 3', 'Nuxt 3', 'Nuxt 4', 'TypeScript', 'HTML5', 'CSS3',
                'Bootstrap', 'Tailwind CSS', 'Pinia', 'Vite', 'Angular',
                'REST APIs', 'Git', 'GitHub Actions', 'CI/CD', 'AI Tools',
            ],
            phone: '01015631474',
            email: 'abanoubgeorge136@gmail.com',
            github: 'https://github.com/abanoub2017',
            linkedin: 'https://www.linkedin.com/in/abanoub-george',
        },
    },

    // ── Services ───────────────────────────────────────────────────────────────
    {
        id: 'services',
        type: 'services',
        order: 2,
        isActive: true,
        content: {
            items: [
                {
                    icon: '🏗️',
                    title: 'Frontend Architecture',
                    description: 'Designing scalable component systems, feature-based folder structures, and module boundaries using Vue 3 or Angular — built to grow with your team and survive long-term.',
                    tags: ['Vue 3', 'Nuxt', 'Angular', 'TypeScript', 'Monorepo'],
                },
                {
                    icon: '🎨',
                    title: 'UI / UX Engineering',
                    description: 'Translating Figma designs into pixel-perfect, accessible, and responsive interfaces with smooth micro-animations and consistent design tokens across the whole product.',
                    tags: ['Figma', 'Tailwind CSS', 'SCSS', 'Animations', 'Design Systems'],
                },
                {
                    icon: '⚡',
                    title: 'Performance Optimization',
                    description: 'Auditing and improving Core Web Vitals — lazy loading, code splitting, tree-shaking, bundle analysis, image optimization, and HTTP caching for perfect Lighthouse scores.',
                    tags: ['Lighthouse', 'Vite', 'Lazy Loading', 'Bundle Analysis', 'Web Vitals'],
                },
                {
                    icon: '♿',
                    title: 'Accessibility (WCAG)',
                    description: 'Building inclusive products with semantic HTML, correct ARIA roles, keyboard navigation, focus management, and screen-reader testing to meet WCAG 2.1 AA standards.',
                    tags: ['ARIA', 'WCAG 2.1', 'Semantic HTML', 'Keyboard Nav', 'a11y'],
                },
                {
                    icon: '🧪',
                    title: 'Testing & Code Quality',
                    description: 'Setting up unit, component, and E2E test suites with Vitest and Cypress. ESLint, Prettier, and CI/CD pipelines to keep code clean and deployments safe.',
                    tags: ['Vitest', 'Cypress', 'ESLint', 'Prettier', 'CI/CD'],
                },
                {
                    icon: '🔗',
                    title: 'API Integration & State',
                    description: 'Seamless integration with REST and GraphQL APIs using fully typed data flows, error boundaries, optimistic updates, and efficient state management with Pinia or NgRx.',
                    tags: ['REST', 'GraphQL', 'Pinia', 'NgRx', 'TanStack Query'],
                },
            ],
        },
    },

    // ── Skills ─────────────────────────────────────────────────────────────────
    {
        id: 'skills',
        type: 'skills',
        order: 3,
        isActive: true,
        content: {
            categories: [
                {
                    title: 'Frontend Core',
                    icon: '🌐',
                    iconBg: 'bg-orange-50 dark:bg-orange-900/30',
                    barColor: 'bg-orange-400',
                    skills: [
                        { label: 'HTML5', level: 98 },
                        { label: 'CSS3 / SASS', level: 95 },
                        { label: 'JavaScript (ES6+)', level: 92 },
                        { label: 'TypeScript', level: 88 },
                    ],
                },
                {
                    title: 'Frameworks',
                    icon: '⚡',
                    iconBg: 'bg-indigo-50 dark:bg-indigo-900/30',
                    barColor: 'bg-indigo-500',
                    skills: [
                        { label: 'Vue 3', level: 95 },
                        { label: 'Nuxt 3 / 4', level: 90 },
                        { label: 'Angular', level: 80 },
                        { label: 'Bootstrap 4/5', level: 90 },
                    ],
                },
                {
                    title: 'Tooling & DevOps',
                    icon: '🔧',
                    iconBg: 'bg-teal-50 dark:bg-teal-900/30',
                    barColor: 'bg-teal-500',
                    skills: [
                        { label: 'Git / GitHub', level: 92 },
                        { label: 'GitHub Actions / CI-CD', level: 82 },
                        { label: 'Vite / Webpack', level: 85 },
                        { label: 'AI Tools (Copilot, GPT)', level: 90 },
                    ],
                },
                {
                    title: 'Design & UX',
                    icon: '🎨',
                    iconBg: 'bg-purple-50 dark:bg-purple-900/30',
                    barColor: 'bg-purple-500',
                    skills: [
                        { label: 'Tailwind CSS', level: 93 },
                        { label: 'Figma', level: 78 },
                        { label: 'Adobe XD', level: 72 },
                        { label: 'Responsive Design', level: 96 },
                    ],
                },
            ],
            extras: ['jQuery', 'Pinia', 'Vuex', 'REST APIs', 'GraphQL', 'Jira', 'Trello', 'Agile / Scrum', 'Jest', 'Vitest'],
        },
    },

    // ── Works ──────────────────────────────────────────────────────────────────
    {
        id: 'works',
        type: 'works',
        order: 4,
        isActive: true,
        content: {
            items: [
                { id: 'kemitt', title: 'Kemitt', link: 'https://www.kemitt.com/', tag: 'E-Commerce', imageBase64: '' },
                { id: 'nabd', title: 'Nabd', link: 'https://ads.nabd.com/', tag: 'Ad Platform', imageBase64: '' },
                { id: 'nabd-deals', title: 'Nabd Deals', link: 'https://deals.nabd.com/', tag: 'E-Commerce', imageBase64: '' },
                { id: 'mcdougall', title: 'McDougall Insurance', link: 'https://www.mcdougallinsurance.com/', tag: 'Insurance', imageBase64: '' },
                { id: 'dgsmith', title: 'DG Smith Insurance', link: 'https://dgsmithinsurance.com/', tag: 'Insurance', imageBase64: '' },
                { id: 'wecare', title: 'We Care', link: 'https://platform.we.care/', tag: 'Healthcare', imageBase64: '' },
                { id: 'ccv', title: 'CCV Insurance', link: 'https://www.ccvinsurance.com/', tag: 'Insurance', imageBase64: '' },
                { id: 'rogers', title: 'Rogers Insurance', link: 'https://www.rogersinsurance.ca/', tag: 'Insurance', imageBase64: '' },
                { id: 'sharp', title: 'Sharp Insurance', link: 'https://sharpinsurance.ca/', tag: 'Insurance', imageBase64: '' },
                { id: 'trudoc', title: 'Trudoc Group', link: 'https://trudocgroup.com', tag: 'Healthcare', imageBase64: '' },
                { id: 'sobekit', title: 'Sobekit', link: 'https://sobekit.co.za/', tag: 'E-Commerce', imageBase64: '' },
            ],
        },
    },
]

// ─── Write to Firestore ───────────────────────────────────────────────────────

async function seed() {
    console.log('🌱  Seeding Firestore sections...\n')

    for (const section of sections) {
        const ref = doc(db, 'sections', section.id)
        await setDoc(ref, {
            ...section,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        console.log(`  ✅  sections/${section.id}`)
    }

    console.log('\n✨  Seed complete!')
    process.exit(0)
}

seed().catch((err) => {
    console.error('❌  Seed failed:', err)
    process.exit(1)
})
