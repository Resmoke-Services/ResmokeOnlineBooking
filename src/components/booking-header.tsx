
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
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { LogIn, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { auth, db } from '@/lib/firebase-client';

export const BookingHeader = () => {
  const { user, setUser, setUserProfile, resetBooking } = useBookingStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (!auth || !db) {
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: 'Services are not ready. Please try again in a moment.',
      });
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
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
            ...data,
          });
        } else {
          const nameParts = firebaseUser.displayName?.split(' ') || ['User'];
          const newName = nameParts[0];
          const newSurname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

          const newDbUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            name: newName,
            surname: newSurname,
            createdAt: new Date(),
          };
          await setDoc(userRef, newDbUser);

          setUserProfile({
            user: userData,
            name: newName,
            surname: newSurname,
            email: userData.email,
          });
        }
      }
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // Silently ignore this error as it's a normal user action
      } else {
        console.error('Google Sign-In Error:', error);
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: error.message || 'Could not sign in with Google. Please try again.',
        });
      }
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
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

  const handleGuestSignOut = () => {
    resetBooking();
    setUser(null);
    router.push('/');
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
            src="https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fall_pages%2Flogo.jpg?alt=media&token=f25af4cd-64be-4d6f-9d76-45cbd48dc859"
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {user.isGuest ? (
                       <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src={(auth?.currentUser?.photoURL) || undefined} alt={user.displayName} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    {user.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={user.isGuest ? handleGuestSignOut : handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleGoogleSignIn} variant="outline" disabled={!auth}>
              {!auth ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in with Google
                </>
              )}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
