/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Analytics
    readonly VITE_GA_MEASUREMENT_ID: string

    // Web3Forms (contact form)
    readonly VITE_WEB3FORMS_KEY: string

    // Firebase
    readonly VITE_FIREBASE_API_KEY: string
    readonly VITE_FIREBASE_AUTH_DOMAIN: string
    readonly VITE_FIREBASE_PROJECT_ID: string
    readonly VITE_FIREBASE_STORAGE_BUCKET: string
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
    readonly VITE_FIREBASE_APP_ID: string
    readonly VITE_FIREBASE_MEASUREMENT_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
