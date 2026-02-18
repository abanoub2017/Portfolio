# Components

> This is the living catalog of all components in the project. Update this file whenever a component is added, changed, or deprecated.

---

## Component Categories

| Prefix     | Location                | Role                                      |
| ---------- | ----------------------- | ----------------------------------------- |
| `A{Name}`  | `src/components/base/`  | Page section components — one per section |
| `Ab{Name}` | `src/components/utils/` | Reusable atom/molecule components         |

All components are **auto-imported** by `unplugin-vue-components`. Manual imports in templates are not required (though currently present in `HomeView.vue` — they are redundant).

---

## Section Components (`A` prefix)

### ANav

**File:** `src/components/base/ANav.vue`  
**Role:** Fixed top navigation bar  
**Features:** Active section highlight via IntersectionObserver, dark mode toggle, mobile hamburger  
**Props:** None  
**Emits:** None  
**Dependencies:** `AbDarkMode`, `AbHamburger`

---

### AHero

**File:** `src/components/base/AHero.vue`  
**Role:** Hero section (`#home`). 2-column grid — photo left, typewriter+CTA right  
**Features:** Hero image load detection → triggers loading screen dismiss  
**Props:** None  
**Emits:** None  
**Dependencies:** `AbTypewriter`, `AbTextModel`, `useGlobalLoading`

---

### AAbout

**File:** `src/components/base/AAbout.vue`  
**Role:** About section (`#about`). 2-column — stat cards left, bio+contact right  
**Features:** Inline stat data, tech stack chips, obfuscated email/phone  
**Props:** None  
**Emits:** None  
**Data:** `stats[]`, `stack[]` inline constants

---

### AServices

**File:** `src/components/base/AServices.vue`  
**Role:** Services section (`#services`). 3-column service card grid  
**Props:** None  
**Data:** `services[]` inline constant  
**Interface:** `Service { icon, title, description, tags[] }`

---

### ASkills

**File:** `src/components/base/ASkills.vue`  
**Role:** Skills section (`#skills`). 4-column category card grid with animated progress bars  
**Features:** Bars animate on scroll entry via `useIntersectionObserver`  
**Props:** None  
**Data:** `categories[]`, `extras[]` inline constants  
**Interface:** `Category { title, icon, iconBg, barColor, skills[] }`, `Skill { label, level }`

---

### AWorks

**File:** `src/components/base/AWorks.vue`  
**Role:** Works section (`#works`). Responsive card grid  
**Features:** Shows `AbCardSkeleton` until section enters viewport  
**Props:** None  
**Data:** `workList` from `src/data/works.ts`  
**Dependencies:** `AbCard`, `AbCardSkeleton`, `useIntersectionObserver`

---

### ATestimonials

**File:** `src/components/base/ATestimonials.vue`  
**Role:** Testimonials section (`#testimonials`). 3-column testimonial cards  
**Props:** None  
**Data:** inline testimonials array

---

### AContact

**File:** `src/components/base/AContact.vue`  
**Role:** Contact section (`#contact`). 2-column — info left, form right  
**Features:** Web3Forms POST submission, honeypot, `AbToast` feedback, GA4 event on success  
**Props:** None  
**Dependencies:** `AbToast`, `useIntersectionObserver`, `useAnalytics`  
**⚠️ Requires:** `VITE_WEB3FORMS_KEY` env var

---

### AFooter

**File:** `src/components/base/AFooter.vue`  
**Role:** Footer. 3-column grid — brand+socials, quick links, contact snippet  
**Props:** None

---

## Utility Components (`Ab` prefix)

### AbCard

**File:** `src/components/utils/AbCard.vue`  
**Role:** Portfolio project card with image, hover overlay, title, tag  
**Props:**

| Prop    | Type     | Required | Description                             |
| ------- | -------- | -------- | --------------------------------------- |
| `link`  | `string` | ✅       | External URL                            |
| `img`   | `string` | ✅       | Resolved image URL (via `new URL(...)`) |
| `title` | `string` | ✅       | Project name                            |
| `tag`   | `string` | ❌       | Category pill (e.g. "E-Commerce")       |

**Emits:** None (uses internal `@click` → `trackCard(link)`)

---

### AbCardSkeleton

**File:** `src/components/utils/AbCardSkeleton.vue`  
**Role:** Skeleton placeholder while works section is not yet visible  
**⚠️ Known issue:** Sizing classes are from old grid — needs update to match `AbCard`'s `aspect-[16/10]`  
**Props:** None

---

### AbAnimatedPlaceholder

**File:** `src/components/utils/AbAnimatedPlaceholder.vue`  
**Role:** Animated gradient loading bar  
**⚠️ Known issue:** Missing `to-*` color in gradient — animation is invisible  
**Props:** None (height set externally via class)

---

### AbTypewriter

**File:** `src/components/utils/AbTypewriter.vue`  
**Role:** Animated typewriter text cycling through role names  
**Features:** Fully self-contained, cleans up `setTimeout` on unmount  
**Props:** None  
**Config (inline):** `displayTextArray`, `typingSpeed`, `erasingSpeed`, `newTextDelay`

---

### AbTextModel

**File:** `src/components/utils/AbTextModel.vue`  
**Role:** Hero glassmorphism CTA card  
**Features:** "Hire Me" button fires GA4 `hire_me_click` event  
**Props:** None

---

### AbDarkMode

**File:** `src/components/utils/AbDarkMode.vue`  
**Role:** Dark/light mode toggle button  
**Features:** Uses `@vueuse/core useDark()` — persisted to localStorage  
**Props:** None

---

### AbHamburger

**File:** `src/components/utils/AbHamburger.vue`  
**Role:** Mobile nav menu toggle + overlay menu  
**Features:** `onClickOutside` closes menu, `v-smooth-scroll` on links  
**⚠️ Known issue:** Only 5 links (missing `services`, `testimonials`)  
**⚠️ Known issue:** `role="navigation"` on `<ul>` is incorrect ARIA (should be on `<nav>`)  
**Props:** None

---

### AbToast

**File:** `src/components/utils/AbToast.vue`  
**Role:** Fixed bottom-right notification  
**Props:**

| Prop       | Type                   | Default                       | Description              |
| ---------- | ---------------------- | ----------------------------- | ------------------------ |
| `message`  | `string`               | `'Message sent successfully'` | Notification text        |
| `type`     | `'success' \| 'error'` | `'success'`                   | Controls icon and color  |
| `duration` | `number`               | `4000`                        | Auto-dismiss delay in ms |

**Emits:** `closeToast` — fired after `duration` ms or on close button click
