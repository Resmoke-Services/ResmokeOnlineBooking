
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingStore } from '@/hooks/use-booking-store';
import { Loader2, User } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';
import PageSpinner from '@/components/page-spinner';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/booking/select-type';
  
  const { user, setUserProfile } = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(nextUrl);
    }
  }, [user, router, nextUrl]);

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
          <CardTitle className="text-2xl">Continue as Guest</CardTitle>
          <CardDescription>
            Proceed with your booking without an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGuestSignIn}
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
                    <User className="mr-2 h-4 w-4" />
                    Continue as Guest
                </>
             )}
          </Button>
        </CardContent>
      </Card>
    </BookingFlowLayout>
  );
}
