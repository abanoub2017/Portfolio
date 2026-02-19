import type { Timestamp } from 'firebase/firestore'

// ─── Shared ──────────────────────────────────────────────────────────────────

export type SectionType =
    | 'hero'
    | 'about'
    | 'services'
    | 'skills'
    | 'works'
    | 'testimonials'
    | 'contact'

// ─── Content shapes per section ──────────────────────────────────────────────

export interface HeroContent {
    name: string
    title: string
    roles: string[]
    bio: string
    photoBase64: string
    ctaPrimary: { label: string; href: string }
    ctaSecondary: { label: string; href: string }
}

export interface AboutContent {
    bio: string[]
    stats: { value: string; label: string }[]
    stack: string[]
    phone: string
    email: string
    github: string
    linkedin: string
}

export interface ServicesContent {
    items: {
        icon: string
        title: string
        description: string
        tags: string[]
    }[]
}

export interface SkillsContent {
    categories: {
        title: string
        icon: string
        iconBg: string
        barColor: string
        skills: { label: string; level: number }[]
    }[]
    extras: string[]
}

export interface WorksContent {
    items: {
        id: string
        title: string
        link: string
        tag: string
        imageBase64: string
    }[]
}

export interface TestimonialsContent {
    items: {
        id: string
        name: string
        role: string
        company: string
        avatarBase64: string
        quote: string
    }[]
}

export interface ContactContent {
    email: string
    phone: string
    github: string
    linkedin: string
}

// ─── Section document ─────────────────────────────────────────────────────────

export type SectionContent =
    | HeroContent
    | AboutContent
    | ServicesContent
    | SkillsContent
    | WorksContent
    | TestimonialsContent
    | ContactContent

export interface Section {
    id: string
    type: SectionType
    order: number
    isActive: boolean
    createdAt: Timestamp | null
    updatedAt: Timestamp | null
    content: SectionContent
}
