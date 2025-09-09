
"use client";

import { useState, useEffect } from 'react';
import { type Firestore } from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebase';

export function useFirestore() {
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side after the component mounts.
    const { firestore: db } = getFirebaseServices();
    setFirestore(db);
  }, []);

  return firestore;
}
