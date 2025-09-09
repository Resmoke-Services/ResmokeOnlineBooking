
"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern to ensure single instance of app
const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

const app: FirebaseApp = getFirebaseApp();

// Lazy initialization for Firebase services
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

const getAuthInstance = (): Auth => {
  if (typeof window !== 'undefined') {
    if (!authInstance) {
      authInstance = getAuth(app);
    }
    return authInstance;
  }
  // Return a mock or null object on the server
  return null as unknown as Auth;
};

const getFirestoreInstance = (): Firestore => {
  if (typeof window !== 'undefined') {
    if (!firestoreInstance) {
      firestoreInstance = getFirestore(app);
    }
    return firestoreInstance;
  }
  // Return a mock or null object on the server
  return null as unknown as Firestore;
};

// Export functions that lazily initialize and return the services
export const auth = getAuthInstance();
export const firestore = getFirestoreInstance();
export { app };
