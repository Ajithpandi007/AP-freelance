import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBEdZqwigRyKWRQ1OU5z-tcVSadP5rJT9o",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "freelancing-54747.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "freelancing-54747",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "freelancing-54747.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "529134820081",
  appId: process.env.FIREBASE_APP_ID || "1:529134820081:web:1bd428cb74d0d533eee750",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-2C2NLCBWRY"
};

// Initialize Firebase App
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(firebaseApp);

// Initialize Analytics asynchronously for browser runtime
export let analytics = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }).catch(() => {
    // Analytics optional fallback
  });
}
