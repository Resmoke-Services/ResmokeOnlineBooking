
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// This side-effect import is required for Firestore to work on the client.
import 'firebase/firestore';

// Singleton holder for the Firebase app instance.
let app: FirebaseApp | null = null;

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

    // Moved config object inside the function to ensure env vars are available on the client
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Initialize the app and store it in the singleton variable.
    app = initializeApp(firebaseConfig);
    return app;
}

// A function to get the Auth instance (client-side)
const getClientAuth = (): Auth => {
    return getAuth(getClientApp());
}

// Export the functions to be used in client components
export { getClientApp, getClientAuth };
