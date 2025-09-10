// src/hooks/use-firebase.ts
"use client";

import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
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
    // This function will only run on the client side
    const initialize = async () => {
      // Dynamically import getFirestore only on the client
      const { getFirestore } = await import('firebase/firestore');

      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      setServices({ app, auth, firestore });
    };

    // useEffect only runs on the client, so this check is a safeguard.
    if (typeof window !== 'undefined') {
      initialize();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return services;
}
