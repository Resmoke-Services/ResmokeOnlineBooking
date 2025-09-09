
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This function ensures Firebase is initialized only once.
const getFirebaseApp = (): FirebaseApp => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
};

const app = getFirebaseApp();
let auth: Auth;
let firestore: Firestore;

// The try-catch block handles potential issues if services fail to initialize,
// which is especially important in a server environment.
try {
  auth = getAuth(app);
  firestore = getFirestore(app);
} catch (error) {
  console.error("Firebase service initialization error:", error);
  // Handle the error appropriately, maybe by setting them to null or a mock object
}

// Export the initialized instances
export { app, auth, firestore };
