# Folder Structure

---

## Full Annotated Structure

```
Portfolio/
│
├── docs/                            ← Project documentation (YOU ARE HERE)
│   ├── README.md
│   ├── StyleGuide/
│   ├── DesignSystem/
│   ├── Architecture/
│   ├── Tasks/
│   └── Components/
│
├── public/                          ← Static assets served as-is
│   ├── favicon.ico
│   ├── sitemap.xml
│   ├── robots.txt
│   └── googleb7f7baa765e12bfe.html ← Google Search Console verification
│
├── src/
│   ├── main.ts                      ← App bootstrap. Order matters:
│   │                                  createApp → Pinia → router → vue-gtag
│   │                                  → useSmoothScroll → useMainHeadMeta → mount
│   │
│   ├── App.vue                      ← Root shell
│   │                                  - Loading screen (fixed overlay)
│   │                                  - <ANav> + <RouterView> + <AFooter>
│   │                                  - Global SCSS transitions
│   │
│   ├── router/
│   │   └── index.ts                 ← Single route: / → HomeView (lazy)
│   │
   ├── firebase.ts                  ← initializeApp, getFirestore, getAuth exports
   │
   ├── types/
   │   └── sections.ts              ← SectionType union + all content interfaces
   │
   ├── services/
   │   ├── index.ts                 ← Barrel re-export
   │   ├── auth.service.ts          ← signInWithEmail, signOut, onAuthChange
   │   └── sections.service.ts      ← Firestore CRUD: fetch, subscribe, upsert, patch, reorder
   │
   ├── views/
   │   ├── HomeView.vue             ← Pure composition, reads Firestore via sectionsStore
   │   └── admin/
   │       ├── AdminLogin.vue       ← Email/password login form
   │       ├── AdminLayout.vue      ← Collapsible sidebar shell for all admin routes
   │       ├── AdminDashboard.vue   ← Section list with drag-and-drop reorder
   │       ├── AdminSectionEdit.vue ← Dynamic editor router (maps type → editor)
   │       └── editors/
   │           ├── AdminAboutEditor.vue
   │           ├── AdminServicesEditor.vue
   │           ├── AdminSkillsEditor.vue
   │           ├── AdminWorksEditor.vue
   │           └── AdminContactEditor.vue
│   │
│   ├── components/
│   │   ├── base/                    ← A-prefix section components
│   │   │   ├── ANav.vue
│   │   │   ├── AHero.vue
│   │   │   ├── AAbout.vue
│   │   │   ├── AServices.vue
│   │   │   ├── ASkills.vue
│   │   │   ├── AWorks.vue
│   │   │   ├── ATestimonials.vue
│   │   │   ├── AContact.vue
│   │   │   └── AFooter.vue
│   │   │
│   │   └── utils/                   ← Ab-prefix reusable atoms
│   │       ├── AbCard.vue           ← Project card
│   │       ├── AbCardSkeleton.vue   ← Card loading placeholder
│   │       ├── AbAnimatedPlaceholder.vue  ← Generic loading bar
│   │       ├── AbDarkMode.vue       ← Dark/light toggle
│   │       ├── AbHamburger.vue      ← Mobile menu
│   │       ├── AbTextModel.vue      ← Hero CTA card
│   │       ├── AbToast.vue          ← Notification toast
│   │       └── AbTypewriter.vue     ← Typewriter animation
│   │
│   ├── composables/
│   │   ├── useHead/
│   │   │   ├── useGlobalHeadMeta.ts ← SEO: title, OG, JSON-LD (called in App.vue)
│   │   │   └── useMainHeadMeta.ts   ← Installs unhead instance (called in main.ts)
│   │   ├── useAnalytics.ts          ← GA4 event wrappers
│   │   ├── useGlobalLoading.ts      ← Loading screen coordination (singleton ref)
│   │   ├── useIntersectionObserver.ts ← Per-component observer factory
│   │   └── useSmoothScroll.ts       ← vue3-smooth-scroll plugin installer
│   │
│   ├── stores/                      ← Pinia stores (currently empty)
│   │   └── (add {feature}.ts here)
│   │
│   ├── data/
│   │   └── works.ts                 ← WorkItem[] project list
│   │   └── (add {section}.ts here for future sections)
│   │
│   └── assets/
│       ├── css/
│       │   └── tailwind.css         ← @tailwind base/components/utilities
│       ├── scss/
│       │   ├── main.scss            ← Global utilities: .container, .section-*
│       │   ├── variables.scss       ← SCSS design tokens (currently empty — use!)
│       │   └── AbTypeWriter.scss    ← .typed-cursor blink animation
│       └── img/
│           ├── man2.png             ← Hero photo
│           ├── profile.png          ← Nav/loading logo
│           ├── social/              ← Social media images (if any)
│           └── work/                ← Project screenshot images
│               ├── kemitt.png
│               ├── Nabd.png
│               └── ...
│
├── cypress/
│   ├── e2e/
│   │   └── example.cy.js            ← ⚠️ REPLACE with real specs
│   ├── fixtures/
│   └── support/
│       ├── commands.js
│       └── e2e.js
│
├── index.html                       ← Entry HTML (Nunito font, meta tags)
├── vite.config.ts                   ← Vite + unplugin-vue-components + @ alias
├── vitest.config.js                 ← Vitest (⚠️ imports vite.config.mjs — verify)
├── cypress.config.js                ← Cypress baseUrl: localhost:4173
├── tailwind.config.js               ← Custom screens, spacing.big, darkMode: class
├── postcss.config.js                ← tailwindcss + autoprefixer
├── tsconfig.json                    ← Project references root
├── tsconfig.app.json                ← extends @vue/tsconfig/tsconfig.dom.json
├── tsconfig.node.json               ← Node/Vite config type-checking
├── components.d.ts                  ← Auto-generated by unplugin-vue-components
├── package.json
└── .env                             ← ⚠️ NOT committed. Contains VITE_* vars
```

---

## Folder Growth Rules

### Adding a new page section

→ `src/components/base/A{Name}.vue`

### Adding a reusable UI atom

→ `src/components/utils/Ab{Name}.vue`  
→ Document it in `docs/Components/BaseComponents.md`

### Adding static data for a section

→ `src/data/{sectionName}.ts`  
→ Export a typed interface + array constant

### Adding a Pinia store

→ `src/stores/{featureName}.ts`  
→ Use `defineStore('{featureName}', () => { ... })` — composition API style

### Adding a composable

→ Public: `src/composables/use{FeatureName}.ts`  
→ Admin-only: `src/composables/admin/use{FeatureName}.ts`

### Adding an admin editor

→ `src/views/admin/editors/Admin{Type}Editor.vue`  
→ Accept `sectionId: string` prop, read from `useSectionsStore().byType<T>()`, save via `store.saveContent()`  
→ Register in `editorMap` inside `AdminSectionEdit.vue`

### Adding an admin UI component

→ `src/components/admin/Admin{Name}.vue`

### Adding project screenshots

→ `src/assets/img/work/{ProjectName}.png` (or `.webp`)  
→ Add entry to `src/data/works.ts`

### Adding a new task doc

→ `docs/Tasks/FeatureSpecific/{FeatureName}.md`
