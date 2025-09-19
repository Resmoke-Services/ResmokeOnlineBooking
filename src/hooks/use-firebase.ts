
"use client";

import { useEffect, useState } from "react";
import { getFirebaseClientServices, type FirebaseClientServices } from "../lib/firebase";

export function useFirebase() {
  const [services, setServices] = useState<FirebaseClientServices | null>(null);

  useEffect(() => {
    // getFirebaseClientServices should only run on the client.
    // The useEffect hook ensures this.
    try {
      const s = getFirebaseClientServices();
      setServices(s);
    } catch (err) {
      console.error("Firebase init failed:", err);
    }
  }, []);

  return services;
}
