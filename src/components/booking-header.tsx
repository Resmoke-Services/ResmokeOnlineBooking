
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useBookingStore } from '@/hooks/use-booking-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/hooks/use-firestore';
import { useToast } from '@/hooks/use-toast';
import { LogIn, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const BookingHeader = () => {
  const { user, setUser, setName, setSurname, setCellNumber, setAddress, setEmail, resetBooking } = useBookingStore();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: 'Database is not ready. Please try again in a moment.',
      });
      return;
    }
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
          });

          setName(newName);
          setSurname(newSurname);
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'Could not sign in with Google. Please try again.',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      resetBooking(); // Clear all booking and user data from the store
      setUser(null);
      router.push('/'); // Redirect to home page after sign out
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: 'Could not sign out. Please try again.',
      });
    }
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fresmoke_logo.jpg?alt=media&token=d87ce1ef-bcab-451e-bb87-7b84806c8575"
            alt="Resmoke Services Logo"
            width={48}
            height={48}
            className="rounded-full border-2 border-primary/50"
            data-ai-hint="company logo"
          />
          <span className="text-xl font-bold tracking-tight text-foreground sm:block">
            Resmoke Services
          </span>
        </Link>
        <nav>
          {user ? (
            user.isGuest ? (
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-5 w-5" />
                    <span>Guest Mode</span>
                </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={(auth.currentUser?.photoURL) || undefined} alt={user.displayName} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : (
            <Button onClick={handleGoogleSignIn} variant="outline">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
