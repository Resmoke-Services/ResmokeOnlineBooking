
"use client";

import { useState, useEffect } from 'react';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getClientApp } from '@/lib/firebase';

const DATABASE_ID = 'resmoke-online-booking-database';

// This function safely initializes and returns the Firestore instance.
// It's designed to be called only on the client side.
const getClientFirestore = () => {
  // Get the initialized firebase app first
  const app = getClientApp();
  // Pass the database ID to getFirestore
  return getFirestore(app, DATABASE_ID);
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
