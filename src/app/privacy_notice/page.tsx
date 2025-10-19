
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { ShieldCheck, XCircle, Loader2 } from "lucide-react";

export default function PrivacyNoticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = () => {
    setIsProcessing(true);
    const nextUrl = searchParams.get('next') || '/booking/select-type';
    router.push(nextUrl);
  };

  const handleDecline = () => {
    router.back();
  };

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader className="text-center items-center">
          <ShieldCheck className="w-12 h-12 text-primary mb-4" />
          <CardTitle className="text-2xl">Privacy Notice & Consent</CardTitle>
          <CardDescription>
            Please read and accept our data privacy policy to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-8 text-left">
          <p className="text-muted-foreground leading-relaxed">
            We collect and process your personal information, including your name, surname, phone number, address, and email address, to create and manage your account, provide you with our services, and enhance your user experience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are committed to protecting your privacy and handle your data in compliance with the Protection of Personal Information Act (POPIA). Your information is securely stored in our database and will not be shared with third parties without your explicit consent, except where required by law.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleDecline} disabled={isProcessing}>
            <XCircle className="mr-2 h-4 w-4" />
            Decline
          </Button>
          <Button onClick={handleAccept} disabled={isProcessing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Accept & Continue
                <ShieldCheck className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </BookingFlowLayout>
  );
}
