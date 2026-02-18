# Abanoub George — Portfolio Documentation

> **Last updated:** February 2026  
> **Stack:** Vue 3 · TypeScript · Vite · Tailwind CSS · SCSS · Pinia · vue-router · unhead · vue-gtag

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Quick Start](#2-quick-start)
3. [Development Workflow](#3-development-workflow)
4. [Design System](#4-design-system)
5. [Component Architecture](#5-component-architecture)
6. [Folder Structure](#6-folder-structure)
7. [Environment Variables](#7-environment-variables)
8. [Testing](#8-testing)
9. [Deployment](#9-deployment)
10. [Docs Folder Guide](#10-docs-folder-guide)

---

## 1. Project Overview

A personal developer portfolio SPA (Single Page Application) for **Abanoub George**, a Senior Frontend Engineer.

- **Type:** Static SPA — no backend, no auth
- **Live URL:** https://abanoubgeorge.net
- **Purpose:** Showcase projects, services, skills, and provide a contact channel
- **Routing:** Single route `/` — all sections are anchor-scroll

**Sections (in order):**

- Hero — AHero
- About — AAbout
- Services — AServices
- Skills — ASkills
- Works — AWorks
- Testimonials — ATestimonials
- Contact — AContact

---

## 2. Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install

```bash
npm install
```

### Create environment file

```bash
cp .env.example .env
# Fill in VITE_GA_MEASUREMENT_ID
```

### Run dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 3. Development Workflow

### Before starting any task

1. Read [`docs/Tasks/Template.md`](Tasks/Template.md)
2. Check the relevant section in [`docs/DesignSystem/Components.md`](DesignSystem/Components.md)
3. Verify naming conventions in [`docs/Architecture/NamingConventions.md`](Architecture/NamingConventions.md)

### Adding a new section

1. Create `src/components/base/A{SectionName}.vue`
2. Add section to `src/views/HomeView.vue`
3. Add nav entry in `src/components/base/ANav.vue` `navItems` array **and** `src/components/utils/AbHamburger.vue` links
4. Add `id="{sectionName}"` on the root element
5. Use `.section-spacing`, `.section-header`, `.section-label`, `.section-title`, `.section-subtitle` SCSS utilities
6. Document in `docs/Tasks/FeatureSpecific/{FeatureName}.md`

### Adding a new utility component

1. Create `src/components/utils/Ab{ComponentName}.vue`
2. Document props/emits in [`docs/Components/BaseComponents.md`](Components/BaseComponents.md)

### Adding new project to Works

1. Add entry to `src/data/works.ts`
2. Add image to `src/assets/img/work/`

---

## 4. Design System

See the full design system in [`docs/StyleGuide/`](StyleGuide/) and [`docs/DesignSystem/`](DesignSystem/).

**Quick reference — design tokens:**

| Token              | Value         | Tailwind           |
| ------------------ | ------------- | ------------------ |
| Primary            | `#4f46e5`     | `indigo-600`       |
| Primary Dark       | `#6366f1`     | `indigo-500`       |
| Background Light   | `#f9fafb`     | `gray-50`          |
| Background Dark    | `#0f172a`     | `slate-900`        |
| Surface Light      | `#ffffff`     | `white`            |
| Surface Dark       | `#1e293b`     | `slate-800`        |
| Text Primary Light | `#111827`     | `gray-900`         |
| Text Primary Dark  | `#f9fafb`     | `gray-50`          |
| Text Muted         | `#6b7280`     | `gray-500`         |
| Border Light       | `#f3f4f6`     | `gray-100`         |
| Border Dark        | `#334155`     | `slate-700`        |
| Border Radius      | `1rem`        | `rounded-2xl`      |
| Section Padding    | `5rem / 6rem` | `.section-spacing` |

---

## 5. Component Architecture

See [`docs/Architecture/ComponentArchitecture.md`](Architecture/ComponentArchitecture.md) for the full breakdown.

**Component naming:**

- `A{Name}.vue` — Page section components (in `src/components/base/`)
- `Ab{Name}.vue` — Reusable utility/atom components (in `src/components/utils/`)

**Composable naming:**

- `use{Name}.ts` — All composables in `src/composables/`

---

## 6. Folder Structure

```
src/
├── main.ts                  ← App bootstrap
├── App.vue                  ← Root shell (loading + layout)
├── router/index.ts          ← Single route
├── views/HomeView.vue       ← Assembles all sections
├── components/
│   ├── base/                ← A-prefix: page sections
│   └── utils/               ← Ab-prefix: reusable atoms
├── composables/
│   ├── useHead/             ← SEO meta management
│   ├── useAnalytics.ts      ← GA4 events
│   ├── useGlobalLoading.ts  ← Loading screen coordination
│   ├── useIntersectionObserver.ts
│   └── useSmoothScroll.ts
├── data/
│   └── works.ts             ← Project list (typed)
├── stores/                  ← Pinia stores (currently empty)
└── assets/
    ├── css/tailwind.css
    └── scss/
        ├── main.scss        ← Global utilities
        ├── variables.scss   ← Design tokens (SCSS vars)
        └── AbTypeWriter.scss
docs/                        ← ← ← You are here
public/
├── favicon.ico
├── sitemap.xml
├── robots.txt
└── googleb7f7baa765e12bfe.html
```

---

## 7. Environment Variables

Create a `.env` file at the project root:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> All `VITE_` prefixed variables are exposed to the client bundle. Do not put secrets here.

---

## 8. Testing

### Unit tests (Vitest)

```bash
npm run test:unit
```

Tests live in `src/**/__tests__/` as `*.spec.ts` files.

### E2E tests (Cypress)

```bash
# Against production preview build
npm run test:e2e

# Against dev server (interactive)
npm run test:e2e:dev
```

> ⚠️ The default `example.cy.js` is a placeholder and must be replaced before running CI.

---

## 9. Deployment

The build outputs to `dist/` with `--base=./` for relative asset paths — compatible with:

- GitHub Pages (subdirectory deploy)
- Netlify / Vercel (drop `dist/` folder)
- Any static host

```bash
npm run build
# Upload dist/ to your host
```

---

## 10. Docs Folder Guide

```
docs/
├── README.md                          ← This file. Start here.
├── StyleGuide/
│   ├── Colors.md                      ← Color palette & usage rules
│   ├── Typography.md                  ← Font scales, weights, line-heights
│   ├── Spacing.md                     ← Spacing scale & section layout rules
│   ├── BorderRadius.md                ← Radius tokens per component type
│   └── Shadows.md                     ← Shadow tokens & usage context
├── DesignSystem/
│   ├── Components.md                  ← All reusable components catalog
│   ├── Layouts.md                     ← Grid, section, and responsive rules
│   └── InteractionPatterns.md         ← Hover, focus, transitions, animations
├── Architecture/
│   ├── FolderStructure.md             ← Full annotated folder map
│   ├── ComponentArchitecture.md       ← Component hierarchy & responsibilities
│   ├── NamingConventions.md           ← All naming rules
│   └── APIIntegrationGuide.md         ← How to add external integrations
├── Tasks/
│   ├── Template.md                    ← REQUIRED reading before every task
│   └── FeatureSpecific/               ← One file per feature/task
└── Components/
    ├── BaseComponents.md              ← Documented props/emits for all Ab* components
    └── ReusableComponentsRules.md     ← Rules for building new reusable components
```

**Daily use:**

- Starting a task? → `docs/Tasks/Template.md`
- Adding UI? → `docs/StyleGuide/` + `docs/DesignSystem/Components.md`
- New component? → `docs/Components/ReusableComponentsRules.md`
- New folder/file? → `docs/Architecture/NamingConventions.md`
- New integration? → `docs/Architecture/APIIntegrationGuide.md`
