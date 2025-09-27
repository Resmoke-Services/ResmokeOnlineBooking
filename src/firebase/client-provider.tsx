
'use client';

import { getFirebaseClientServices, type FirebaseClientServices } from '@/lib/firebase';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

const FirebaseContext = createContext<FirebaseClientServices | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<FirebaseClientServices | null>(null);

  useEffect(() => {
    // This ensures that getFirebaseClientServices is only called on the client side.
    const firebaseServices = getFirebaseClientServices();
    setServices(firebaseServices);
  }, []);

  // While services are being initialized, you might want to show a loader.
  // Or, you can render children and let individual components handle the loading state.
  if (!services) {
    return null; // Or a loading spinner
  }

  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
