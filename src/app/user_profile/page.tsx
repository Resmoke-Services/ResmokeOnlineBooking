
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaUserSecret } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '@/hooks/use-booking-store';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInAnonymously, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import StaticPageLayout from '@/components/static-page-layout';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser, setName, setSurname, setCellNumber, setAddress, setPropertyType, setAccessCodeRequired, setEmail, resetBooking } = useBookingStore();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the user object is already in the store, they don't need to be on this page.
    if (user) {
      router.replace('/customer_profile');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);
  
  const handleGoogleSignIn = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: 'Database is not ready. Please try again in a moment.',
      });
      return;
    }
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (firebaseUser) {
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'User',
          isGuest: false,
        };
        setUser(userData);
        setEmail(userData.email);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || userData.displayName.split(' ')[0] || '');
          setSurname(data.surname || userData.displayName.split(' ')[1] || '');
          setCellNumber(data.cellNumber || '');
          setAddress(data.address || '');
          setPropertyType(data.propertyType || undefined);
          setAccessCodeRequired(data.accessCodeRequired || undefined);
        } else {
          // If the user is new, set their name from Google and reset other fields
          const nameParts = firebaseUser.displayName?.split(' ') || ['User'];
          const newName = nameParts[0];
          const newSurname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            name: newName,
            surname: newSurname,
            createdAt: new Date(),
          });
          setName(newName);
          setSurname(newSurname);
        }
        router.push('/customer_profile');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Could not sign in with Google. Please try again.',
      });
      setIsLoading(false);
    }
  };


  const handleGuestSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      
      // Reset all state before setting the new guest user
      resetBooking();

      setUser({
          uid: user.uid,
          displayName: 'Guest',
          email: '',
          isGuest: true,
      });
      
      router.push('/customer_profile');
    } catch (error: any) {
       console.error("Anonymous Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Guest Sign-in Failed",
        description: error.message || "Could not sign in as a guest. Please try again.",
      });
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <StaticPageLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </StaticPageLayout>
    );
  }

  return (
    <StaticPageLayout>
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose Your Path</CardTitle>
            <CardDescription>Sign in to save your booking history or continue as a guest.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full text-lg py-6"
              variant="outline"
            >
              <FcGoogle className="mr-3 h-6 w-6" />
              Sign in with Google
            </Button>
            <Button
              onClick={handleGuestSignIn}
              className="w-full text-lg py-6"
              variant="secondary"
            >
              <FaUserSecret className="mr-3 h-5 w-5" />
              Continue as Guest
            </Button>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
