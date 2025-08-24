
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// This side-effect import is required for Firestore to work on the client.
import 'firebase/firestore';

// Singleton holder for the Firebase app instance.
let app: FirebaseApp | null = null;

// Hardcoded Firebase config to ensure keys are always available.
const firebaseConfig = {
  apiKey: "AIzaSyCgFELygoR1bCxivlbiTzCzuyjbYUmx1RE",
  authDomain: "resmokeonlinebooking.firebaseapp.com",
  projectId: "resmokeonlinebooking",
  storageBucket: "resmokeonlinebooking.firebasestorage.app",
  messagingSenderId: "122043207768",
  appId: "1:122043207768:web:49692c2f6d65eedda8fa2d",
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
    return getAuth(getClientApp());
}

// Export the functions to be used in client components
export { getClientApp, getClientAuth };
