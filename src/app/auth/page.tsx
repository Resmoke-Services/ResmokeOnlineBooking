
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useBookingStore } from '@/hooks/use-booking-store';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/hooks/use-firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/customer_profile';
  
  const { user, setUserProfile } = useBookingStore();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(nextUrl);
    }
  }, [user, router, nextUrl]);

  const handleGoogleSignIn = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: 'Database is not ready. Please try again in a moment.',
      });
      return;
    }
    setIsProcessing(true);
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

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile({
            user: userData,
            ...data
          });
        } else {
          const nameParts = firebaseUser.displayName?.split(' ') || ['User'];
          const newName = nameParts[0];
          const newSurname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          
          const newUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            name: newName,
            surname: newSurname,
            createdAt: new Date(),
          };

          await setDoc(userRef, newUserData, { merge: true });

          setUserProfile({
             user: userData,
             name: newName,
             surname: newSurname,
             email: firebaseUser.email || '',
          });
        }
        router.push(nextUrl);
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Could not sign in with Google. Please try again.',
      });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleGuestSignIn = () => {
    setIsProcessing(true);
    const guestUser = {
      uid: `guest_${Date.now()}`,
      email: '',
      displayName: 'Guest',
      isGuest: true,
    };
    setUserProfile({ user: guestUser });
    router.push(nextUrl);
  };


  return (
    <BookingFlowLayout>
      <Card className="shadow-xl max-w-md mx-auto">
        <CardHeader className="text-center items-center">
          <CardTitle className="text-2xl">Sign In or Continue as Guest</CardTitle>
          <CardDescription>
            Choose an option to proceed with your booking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={isProcessing} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <GoogleIcon />
                Sign in with Google
              </>
            )}
          </Button>
          <Button
            onClick={handleGuestSignIn}
            disabled={isProcessing}
            variant="ghost"
            className="w-full"
          >
             <User className="mr-2 h-4 w-4" />
             Continue as Guest
          </Button>
        </CardContent>
      </Card>
    </BookingFlowLayout>
  );
}
