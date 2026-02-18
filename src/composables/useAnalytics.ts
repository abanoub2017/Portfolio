import { event } from 'vue-gtag'

export function useAnalytics() {
    /** Fired when a portfolio card (project link) is clicked */
    function trackCard(projectLink: string): void {
        event('portfolio_card_click', {
            event_category: 'portfolio',
            event_label: projectLink,
        })
    }

    /** Fired when the contact form is submitted successfully */
    function trackContactSubmit(): void {
        event('generate_lead', {
            event_category: 'contact',
            method: 'contact_form',
        })
    }

    /** Fired when the "Hire Me" hero button is clicked */
    function trackHireMe(): void {
        event('hire_me_click', {
            event_category: 'cta',
            event_label: 'hero_hire_me',
        })
    }

    return { trackCard, trackContactSubmit, trackHireMe }
}
