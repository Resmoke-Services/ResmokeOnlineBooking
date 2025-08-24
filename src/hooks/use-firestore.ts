
"use client";

import { useState, useEffect } from 'react';
import type { Firestore } from 'firebase/firestore';
import { getClientFirestore } from '@/lib/firebase';

export function useFirestore() {
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side
    const db = getClientFirestore();
    setFirestore(db);
  }, []);

  return firestore;
}
