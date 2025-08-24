
"use client";

import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaUserSecret } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '@/hooks/use-booking-store';
import { getClientAuth } from '@/lib/firebase';
import { GoogleAuthProvider, signInAnonymously, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import BookingFlowLayout from '@/components/booking-flow-layout';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser, setName, setSurname, setCellNumber, setAddress, setEmail } = useBookingStore();
  const firestore = useFirestore();

  const handleGoogleSignIn = async () => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Initialization Error",
            description: "Database is not ready. Please try again in a moment.",
        });
        return;
    }
    const auth = getClientAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
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
          // Existing user, pre-fill data from Firestore
          const data = userDoc.data();
          setName(data.name || userData.displayName.split(' ')[0] || '');
          setSurname(data.surname || userData.displayName.split(' ')[1] || '');
          setCellNumber(data.cellNumber || '');
          setAddress(data.address || '');
        } else {
          // New user, save their basic data
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

  const handleGuestSignIn = async () => {
    try {
      const auth = getClientAuth();
      const result = await signInAnonymously(auth);
      const user = result.user;
      
      setUser({
          uid: user.uid,
          displayName: 'Guest',
          email: '',
          isGuest: true,
      });
      
      // Reset fields for guest
      setName('');
      setSurname('');
      setCellNumber('');
      setAddress('');
      setEmail('');
      router.push('/book');
    } catch (error: any) {
       console.error("Anonymous Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Guest Sign-in Failed",
        description: error.message || "Could not sign in as a guest. Please try again.",
      });
    }
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
