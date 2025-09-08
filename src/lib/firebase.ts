
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Singleton holder for the Firebase app and service instances.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

// Firebase config read from environment variables
const firebaseConfig = {
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A function to initialize and get the Firebase app instance (client-side)
const getClientApp = (): FirebaseApp => {
    if (app) {
        return app; // Return the existing instance if it has been created.
    }

    // If no instance exists, check if one has been initialized by Firebase already.
    if (getApps().length > 0) {
        app = getApp();
        return app;
    }
    
    // Initialize the app and store it in the singleton variable.
    app = initializeApp(firebaseConfig);
    return app;
}

// A function to get the Auth instance (client-side)
const getClientAuth = (): Auth => {
    if (auth) {
        return auth;
    }
    auth = getAuth(getClientApp());
    return auth;
}

// A function to get the Firestore instance (client-side)
const getClientFirestore = (): Firestore => {
    if (firestore) {
        return firestore;
    }
    firestore = getFirestore(getClientApp());
    return firestore;
}


// Export the initialized instances for client-side use
const clientApp = getClientApp();
const clientAuth = getClientAuth();
const clientFirestore = getClientFirestore();

export { clientApp, clientAuth as auth, clientFirestore as firestore };
