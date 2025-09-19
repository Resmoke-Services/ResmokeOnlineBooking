
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App;
let adminDb: Firestore;
let adminAuth: Auth;

try {
  const credentialsJson = process.env.APP_FIREBASE_ADMIN_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error("Firebase Admin environment variables are not fully set. Admin SDK will not be initialized.");
  }
  
  const serviceAccount = JSON.parse(credentialsJson);

  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    adminApp = getApps()[0];
  }
  
  adminDb = getFirestore(adminApp);
  adminAuth = getAuth(adminApp);

} catch (error) {
  console.warn("Could not initialize Firebase Admin SDK:", error);
  // This will handle the case where the admin SDK cannot be initialized
  // and prevent crashes on startup. The app will fail later if admin services are used.
  adminApp = {} as App; 
  adminDb = {} as Firestore;
  adminAuth = {} as Auth;
}


export { adminDb, adminAuth };
