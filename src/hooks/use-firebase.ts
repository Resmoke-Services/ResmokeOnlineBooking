// src/hooks/use-firebase.ts
"use client";

import { useState, useEffect } from 'react';
import { getCoreFirebaseServices } from '@/lib/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// The interface now includes Firestore again
export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

/**
 * A hook to safely access the initialized Firebase services on the client side.
 * Returns null during server-rendering and on the initial client render,
 * then provides the services once they are available.
 * This hook is now responsible for lazily initializing Firestore.
 */
export function useFirebase(): FirebaseServices | null {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // This function will run only on the client side
    const initialize = () => {
      // Get the core services (App, Auth, Firestore) which are safe to get on client
      const allServices = getCoreFirebaseServices();
      setServices(allServices as FirebaseServices);
    };

    initialize();
  }, []); // Empty dependency array ensures this runs once on mount

  return services;
}
