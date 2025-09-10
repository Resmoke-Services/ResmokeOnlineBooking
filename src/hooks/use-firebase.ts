// src/hooks/use-firebase.ts
"use client";

import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// Statically import getFirestore to ensure the service is registered
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/lib/firebase';

// Define the services interface
export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function useFirebase(): FirebaseServices | null {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const initialize = () => {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      // This call is now safe because of the static import above
      const firestore = getFirestore(app);

      setServices({ app, auth, firestore });
    };

    initialize();
    
  }, []); // The empty dependency array ensures this runs only once per component mount

  return services;
}
