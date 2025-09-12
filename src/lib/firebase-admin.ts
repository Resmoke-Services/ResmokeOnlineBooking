import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// This configuration relies on environment variables being set in your deployment environment.
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.warn("Firebase Admin environment variables are not fully set. Admin SDK will not be initialized.");
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

let adminApp: App;
if (!getApps().length && serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
} else if (getApps().length > 0) {
  adminApp = getApps()[0];
} else {
  // This will handle the case where the admin SDK cannot be initialized
  // and prevent crashes on startup. The app will fail later if adminDb is used.
  adminApp = {} as App; 
}

const adminDb: Firestore = adminApp.name ? getFirestore(adminApp) : {} as Firestore;
const adminAuth: Auth = adminApp.name ? getAuth(adminApp) : {} as Auth;

export { adminDb, adminAuth };