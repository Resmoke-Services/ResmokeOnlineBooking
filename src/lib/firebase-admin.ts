

import admin from 'firebase-admin';
import { App, cert, getApps } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

// This file is now primarily used by non-Server-Action API routes, like the admin page data loader.
// Server Actions will initialize their own instance to ensure credentials are loaded correctly.
const serviceAccount = process.env.APP_FIREBASE_ADMIN_CREDENTIALS;

function initializeAdminApp() {
  if (getApps().length === 0) {
    if (!serviceAccount) {
      console.warn('Firebase Admin credentials not set. Some server-side features may not work.');
      return;
    }

    try {
      const credential = typeof serviceAccount === 'string' ? cert(JSON.parse(serviceAccount)) : cert(serviceAccount);
      admin.initializeApp({
        credential,
      });
    } catch(e: any) {
      console.error("Failed to initialize Firebase Admin SDK", e);
    }
  }
}

initializeAdminApp();

// These will throw an error if not initialized, which is expected
// if the credentials aren't available in the context they are called from.
const adminDb: Firestore = getFirestore();
const adminAuth: Auth = getAuth();

export { adminDb, adminAuth };
