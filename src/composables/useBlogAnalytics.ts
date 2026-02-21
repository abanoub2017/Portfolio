/**
 * src/composables/useBlogAnalytics.ts
 *
 * Thin wrappers around vue-gtag's useGtag() for Blog Module events.
 * All functions are no-ops when GA is not loaded (dev / missing env var).
 *
 * Events
 * ──────────────────────────────────────────────────────────────────────────
 * blog_list_view       Fired once when /blog mounts
 * blog_post_view       Fired once when /blog/:slug finishes loading
 * blog_filter_applied  Fired whenever a search, category, or tag filter changes
 */

import { useGtag } from 'vue-gtag'

export function useBlogAnalytics() {
    // useGtag() is safe to call even when GA isn't initialised —
    // it returns no-op stubs, so we never need to guard the call site.
    const { event } = useGtag()

    /** Call once in BlogListView onMounted */
    function trackBlogListView() {
        event('blog_list_view')
    }

    /**
     * Call in BlogPostView once meta has loaded.
     * @param slug     The post slug, e.g. "what-is-nitro-in-nuxt-4"
     * @param title    Post display title
     * @param category Post category label, e.g. "Vue"
     */
    function trackBlogPostView(slug: string, title: string, category: string) {
        event('blog_post_view', {
            post_slug: slug,
            post_title: title,
            category,
        })
    }

    /**
     * Call whenever a filter value changes in BlogListView.
     * @param filterType  'search' | 'category' | 'tag'
     * @param filterValue The value the user applied (empty string = cleared)
     */
    function trackFilterApplied(filterType: 'search' | 'category' | 'tag', filterValue: string) {
        event('blog_filter_applied', {
            filter_type: filterType,
            filter_value: filterValue,
        })
    }

    return { trackBlogListView, trackBlogPostView, trackFilterApplied }
}
