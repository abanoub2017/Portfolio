import { initializeApp, type FirebaseApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// ─── Lazy singletons (SSR-safe) ──────────────────────────────────────────────
// Firebase requires browser APIs (indexedDB, window) and cannot be initialised
// during the SSG build which runs in Node without a DOM.  These getter functions
// defer initialisation until the first real client-side call.

let _app: FirebaseApp | null = null
let _db: Firestore | null = null
let _auth: Auth | null = null

export function getFirebaseApp(): FirebaseApp {
    if (!_app) _app = initializeApp(firebaseConfig)
    return _app
}

export function getDb(): Firestore {
    if (!_db) {
        _db = initializeFirestore(getFirebaseApp(), {
            cache: persistentLocalCache({
                tabManager: persistentMultipleTabManager(),
            }),
        })
    }
    return _db
}

export function getFirebaseAuth(): Auth {
    if (!_auth) _auth = getAuth(getFirebaseApp())
    return _auth
}

