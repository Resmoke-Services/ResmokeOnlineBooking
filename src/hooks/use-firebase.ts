"use client";

import { useEffect, useState } from "react";
import { getFirebaseServices, type FirebaseServices } from "../lib/firebase";

export function useFirebase() {
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    try {
      const s = getFirebaseServices();
      setServices(s);
    } catch (err) {
      console.error("Firebase init failed:", err);
    }
  }, []);

  return services;
}
