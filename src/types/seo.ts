/**
 * src/types/seo.ts
 *
 * Shape of the `seo/main` Firestore document.
 */

export interface SeoConfig {
    /** Browser tab title + og:title + twitter:title */
    title: string
    /** Meta description + og:description + twitter:description (aim for 50–160 chars) */
    description: string
    /** Comma-separated meta keywords */
    keywords: string
    /** Canonical site URL (no trailing slash), e.g. https://abanoubgeorge.net */
    siteUrl: string
    /** Absolute URL of the OG / Twitter card image */
    ogImage: string
    /** Author name used in meta and JSON-LD */
    authorName: string
}
