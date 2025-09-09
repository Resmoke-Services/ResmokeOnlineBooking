
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

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// Initialize Firebase on the client side
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} else if (getApps().length) {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
}

// @ts-ignore - These will be initialized on the client
export { app, auth, firestore };
