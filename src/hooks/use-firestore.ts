
"use client";

import { useState, useEffect } from 'react';
import { type Firestore } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';

export function useFirestore() {
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side after the component mounts.
    // The firestore instance is already initialized in firebase.ts
    setFirestore(db);
  }, []);

  return firestore;
}
