
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaUserSecret } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '@/hooks/use-booking-store';
import { auth, firestore } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import BookingFlowLayout from '@/components/booking-flow-layout';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser, user } = useBookingStore();

  useEffect(() => {
    if (user) {
      router.push('/book');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // New user, save their data
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(),
          });
        }
        
        setUser({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            isGuest: false,
        });
        router.push('/book');
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
      });
    }
  };

  const handleGuestSignIn = () => {
    setUser({
        uid: `guest_${new Date().getTime()}`,
        displayName: 'Guest',
        email: '',
        isGuest: true,
    });
    router.push('/book');
  };

  return (
    <BookingFlowLayout>
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
    </BookingFlowLayout>
  );
}
