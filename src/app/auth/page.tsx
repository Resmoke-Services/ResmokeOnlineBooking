
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
import { Loader2, LogIn } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/customer_profile';
  
  const { user, setUser, setName, setSurname, setCellNumber, setAddress, setEmail, setPropertyType, setAccessCodeRequired, setSuburb, setCity, setOtherCityDescription, setOtherSuburbDescription, setPropertyFunction, setRentalUnitRole, setCompanyName, setCompanyAddress, setBillingInformation } = useBookingStore();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user && !user.isGuest) {
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
        setUser(userData);
        setEmail(userData.email);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || userData.displayName.split(' ')[0] || '');
          setSurname(data.surname || userData.displayName.split(' ')[1] || '');
          setCellNumber(data.cellNumber || '');
          setAddress(data.address || '');
          setPropertyType(data.propertyType || null);
          setAccessCodeRequired(data.accessCodeRequired || null);
          setSuburb(data.suburb || undefined);
          setCity(data.city || undefined);
          setOtherCityDescription(data.otherCityDescription || '');
          setOtherSuburbDescription(data.otherSuburbDescription || '');
          setPropertyFunction(data.propertyFunction || null);
          setRentalUnitRole(data.rentalUnitRole || null);
          setCompanyName(data.companyName || '');
          setCompanyAddress(data.companyAddress || '');
          setBillingInformation(data.billingInformation || null);
        } else {
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
          }, { merge: true });

          setName(newName);
          setSurname(newSurname);
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
      setIsProcessing(false);
    }
  };

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl max-w-md mx-auto">
        <CardHeader className="text-center items-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Please sign in with your Google account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={isProcessing} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </BookingFlowLayout>
  );
}
