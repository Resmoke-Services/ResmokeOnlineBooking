
"use client";

import { useState, useEffect } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebase';

interface FirebaseServices {
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
}

export function useFirebase() {
  const [services, setServices] = useState<FirebaseServices>({
    app: null,
    auth: null,
    firestore: null,
  });

  useEffect(() => {
    // This effect runs only on the client-side after the component mounts.
    const { app, auth, firestore } = getFirebaseServices();
    setServices({ app, auth, firestore });
  }, []);

  return services;
}
