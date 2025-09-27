
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;

function initializeAdminSDK() {
  const credentialsJson = process.env.APP_FIREBASE_ADMIN_CREDENTIALS;

  // Only attempt to initialize if not already done and if credentials exist.
  if (credentialsJson && !getApps().length) {
    try {
      const serviceAccount = JSON.parse(credentialsJson);
      adminApp = initializeApp({ credential: cert(serviceAccount) });
    } catch (error: any) {
      console.error("CRITICAL: Failed to parse or initialize Firebase Admin SDK from credentials.", error);
      // Don't throw here to allow build to pass, error will be caught in API routes.
    }
  }
  
  // Get the initialized app if it exists, otherwise get the first one.
  // This handles multiple initializations in different environments.
  if (!adminApp) {
    adminApp = getApps().length ? getApps()[0] : initializeApp();
  }

  adminDb = getFirestore(adminApp);
  adminAuth = getAuth(adminApp);
}

// Initialize the SDK on module load.
initializeAdminSDK();

export { adminDb, adminAuth };
