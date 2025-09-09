
"use client";

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
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

// This function ensures Firebase is initialized only once on the client-side.
const initializeFirebaseServices = () => {
    if (typeof window !== 'undefined') {
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApp();
        }
        auth = getAuth(app);
        firestore = getFirestore(app);
    }
};

// Call the function to initialize services. 
// "use client" ensures this module-level code runs only in the browser.
initializeFirebaseServices();

// Export the initialized services.
// On the server, these will be undefined, which is safe.
// On the client, they will be the initialized instances.
export { app, auth, firestore };

// A utility function for components to get the services.
// This is an alternative to direct imports if needed, but direct imports are fine in client components.
export const getFirebaseServices = () => {
    if (!app) {
        initializeFirebaseServices();
    }
    return { app, auth, firestore };
};
