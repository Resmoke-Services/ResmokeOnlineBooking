
import admin from 'firebase-admin';
import { App, cert, getApps } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

// This is the service account credential that you stored in Google Cloud Secret Manager.
// The apphosting.yaml file makes this environment variable available to your backend.
const serviceAccount = process.env.APP_FIREBASE_ADMIN_CREDENTIALS;

// To prevent re-initializing the app on every hot-reload in development,
// we check if the apps have already been initialized.
// This is a crucial performance and safety measure.
if (!getApps().length) {
  // Ensure the service account credentials are provided before trying to initialize.
  // The build should fail if these are missing, as it indicates a critical config error.
  if (!serviceAccount) {
    throw new Error('CRITICAL: Firebase Admin credentials are not set in the environment.');
  }

  try {
    const credential = typeof serviceAccount === 'string'
      ? cert(JSON.parse(serviceAccount))
      : cert(serviceAccount);
      
    admin.initializeApp({
      credential,
    });
  } catch(e) {
    console.error("Failed to initialize Firebase Admin SDK", e);
    throw new Error("Could not initialize Firebase Admin. Please check your service account credentials.");
  }
}

// Export the initialized admin services for use in your API routes.
// We get the services from the default app instance.
const adminDb: Firestore = getFirestore();
const adminAuth: Auth = getAuth();

export { adminDb, adminAuth };
