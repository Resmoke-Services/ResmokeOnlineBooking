
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Base services that are safe to initialize on the server
export interface FirebaseServerServices {
  app: FirebaseApp;
  auth: Auth;
}

// All services, including those that should only be on the client
export interface FirebaseClientServices extends FirebaseServerServices {
  firestore: Firestore;
}

let serverServices: FirebaseServerServices | null = null;
let clientServices: FirebaseClientServices | null = null;

function getFirebaseConfig() {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        throw new Error('Firebase config is not set. Please check your .env file.');
    }
    return firebaseConfig;
}

/**
 * Initializes and returns server-safe Firebase services (App and Auth).
 * This can be used on both server and client.
 */
function initializeCoreServices(): FirebaseServerServices {
  if (serverServices) return serverServices;

  const firebaseConfig = getFirebaseConfig();
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);

  serverServices = { app, auth };
  return serverServices;
}


/**
 * Initializes and returns all client-side Firebase services, including Firestore.
 * This function should ONLY be called on the client.
 */
export function getFirebaseClientServices(): FirebaseClientServices {
  // If we've already initialized client services, return them.
  if (clientServices) return clientServices;

  // Ensure core services are initialized first.
  const core = initializeCoreServices();
  
  // Initialize Firestore and create the full client services object.
  const firestore = getFirestore(core.app);
  
  clientServices = { ...core, firestore };
  return clientServices;
}
