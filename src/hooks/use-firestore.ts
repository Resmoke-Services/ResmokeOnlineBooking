
"use client";

import { useState, useEffect } from 'react';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

// This function safely initializes and returns the Firestore instance.
// It's designed to be called only on the client side.
const getClientFirestore = () => {
  return getFirestore(app);
};

export function useFirestore() {
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side after the component mounts.
    const db = getClientFirestore();
    setFirestore(db);
  }, []);

  return firestore;
}
