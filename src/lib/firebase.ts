// src/lib/firebase.ts
"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration - remains the same
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Interface for type safety, making Firestore optional here
interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore | null; // Firestore can be null initially
}

// A private variable to hold the initialized core services
let services: Omit<FirebaseServices, 'firestore'> | null = null;

/**
 * Initializes and returns the core Firebase services (App and Auth) instance (singleton).
 * This function ensures that Firebase App and Auth are initialized only once.
 * Firestore is explicitly excluded here to avoid server-side execution.
 */
export const getCoreFirebaseServices = (): Omit<FirebaseServices, 'firestore'> => {
  // If the services have not been initialized yet
  if (!services) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    services = { app, auth };
  }
  return services;
};
