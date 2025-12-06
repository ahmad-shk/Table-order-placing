import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isFirebaseConfigured = () => {
  return !!(firebaseConfig.projectId && firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.appId)
}

if (!isFirebaseConfigured()) {
  console.warn(
    "[Firebase] Environment variables not fully configured. Please set all Firebase credentials in your Vercel project settings.",
  )
}

let app: ReturnType<typeof initializeApp> | null = null
let db: ReturnType<typeof getFirestore> | null = null

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    console.log("[Firebase] Successfully initialized with project:", firebaseConfig.projectId)
  } else {
    console.warn("[Firebase] Skipping initialization - missing required configuration")
  }
} catch (error) {
  console.error("[Firebase] Initialization error:", error)
}

export { db, app, isFirebaseConfigured }
