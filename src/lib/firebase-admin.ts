
import "dotenv/config";
import admin from 'firebase-admin';
import { App, cert, getApps } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

let adminDb: Firestore;
let adminAuth: Auth;

try {
  const serviceAccount = process.env.APP_FIREBASE_ADMIN_CREDENTIALS;

  if (getApps().length === 0) {
    if (!serviceAccount) {
      throw new Error('CRITICAL: Firebase Admin credentials are not set in the environment.');
    }
    const credential = cert(JSON.parse(serviceAccount));
    admin.initializeApp({ credential });
  }

  adminDb = getFirestore();
  adminAuth = getAuth();
} catch (e: any) {
  console.error("Failed to initialize Firebase Admin SDK or its services", e);
  // Create mock instances if initialization fails to prevent crashes on import
  // @ts-ignore
  adminDb = { collection: () => ({ get: async () => ({ empty: true, docs: [] }), add: async () => ({ id: 'error' }) }) };
  // @ts-ignore
  adminAuth = {};
}


export { adminDb, adminAuth };
