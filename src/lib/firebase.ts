
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

export interface FirebaseClientServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

let clientServices: FirebaseClientServices | null = null;

function getFirebaseConfig() {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    
    if (!firebaseConfig.projectId) {
       throw new Error("Firebase project ID is not configured. Please check your environment variables.");
    }

    return firebaseConfig;
}


/**
 * Initializes and returns all client-side Firebase services, including Firestore.
 * This function should ONLY be called on the client. It ensures initialization
 * happens only once.
 */
export function getFirebaseClientServices(): FirebaseClientServices {
  if (clientServices) {
    return clientServices;
  }

  const firebaseConfig = getFirebaseConfig();
  
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  clientServices = { app, auth, firestore };
  return clientServices;
}
