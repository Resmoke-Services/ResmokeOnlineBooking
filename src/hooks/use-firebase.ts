// src/hooks/use-firebase.ts
"use client";

import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, type FirebaseServices } from '@/lib/firebase';

export function useFirebase(): FirebaseServices | null {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      setServices({ app, auth, firestore });
    }
  }, []);

  return services;
}
