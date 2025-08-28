
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaUserSecret } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '@/hooks/use-booking-store';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInAnonymously, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import StaticPageLayout from '@/components/static-page-layout';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser, setName, setSurname, setCellNumber, setAddress, setEmail } = useBookingStore();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(true); // To handle redirect processing

  useEffect(() => {
    // If user is already logged in (not from a redirect), go to booking page.
    if (user) {
      router.replace('/customer_profile');
      return;
    }

    const processRedirect = async () => {
      if (!firestore) return;

      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          const user = result.user;
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          const userData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
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
          } else {
            const nameParts = user.displayName?.split(' ') || ['User'];
            const newName = nameParts[0];
            const newSurname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              name: newName,
              surname: newSurname,
              createdAt: new Date(),
            });
            setName(newName);
            setSurname(newSurname);
          }
          
          router.replace('/customer_profile'); // Redirect to booking after processing
        } else {
            // No redirect result, so it's a fresh visit to the page.
            setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Redirect Result Error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error.message || "Could not process sign-in. Please try again.",
        });
        setIsLoading(false);
      }
    };

    // We need to wait for firestore to be initialized.
    if (firestore) {
      processRedirect();
    }
  }, [firestore, router, setAddress, setCellNumber, setEmail, setName, setSurname, setUser, toast, user]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    // Start the redirect flow. The logic in useEffect will handle the result.
    await signInWithRedirect(auth, provider);
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      
      setUser({
          uid: user.uid,
          displayName: 'Guest',
          email: '',
          isGuest: true,
      });
      
      setName('');
      setSurname('');
      setCellNumber('');
      setAddress('');
      setEmail('');
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
