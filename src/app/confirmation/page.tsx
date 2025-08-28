
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { CheckCircle, User, Mail, Phone, MapPin, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { format, parse, parseISO, isValid } from "date-fns";
import { generateConfirmationMessage, type ConfirmationOutput } from "@/ai/flows/confirmation-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ConfirmationSkeleton from "@/components/confirmation-skeleton";

function getValidDate(details: any, selectedDateTime: { date: string; time: string; } | null): Date | null {
    // 1. Prioritize `dateTime` from the server confirmation
    if (details?.dateTime) {
        const parsed = parseISO(details.dateTime);
        if (isValid(parsed)) return parsed;
    }
    // 2. Try to construct from `Date` and `Time` fields
    if (details?.Date && details?.Time) {
        const parsed = parse(`${details.Date} ${details.Time}`, 'yyyy-MM-dd HH:mm', new Date());
        if (isValid(parsed)) return parsed;
    }
    // 3. Fallback to the user's selected date and time from the store
    if (selectedDateTime?.date && selectedDateTime?.time) {
        const parsed = parse(`${selectedDateTime.date} ${selectedDateTime.time}`, 'yyyy-MM-dd HH:mm', new Date());
        if (isValid(parsed)) return parsed;
    }
    return null;
}


export default function ConfirmationPage() {
  const router = useRouter();
  const { name, surname, email, cellNumber, address, webhookConfirmation, selectedDateTime, resetBooking } = useBookingStore();
  const [aiResponse, setAiResponse] = useState<ConfirmationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const { bookingDetails, isSuccess } = useMemo(() => {
    if (!webhookConfirmation) {
      return { bookingDetails: null, isSuccess: false };
    }

    let parsed = webhookConfirmation;
    // Handle cases where the actual response is nested
    if (webhookConfirmation.BookingResponse) {
      if (typeof webhookConfirmation.BookingResponse === 'string') {
        try {
          parsed = JSON.parse(webhookConfirmation.BookingResponse);
        } catch (e) {
          // If parsing fails, treat the string as the message
          parsed = { message: webhookConfirmation.BookingResponse, status: 'Confirmed' };
        }
      } else {
        parsed = webhookConfirmation.BookingResponse;
      }
    }
    
    // Normalize status and check for success
    const status = parsed?.status?.toLowerCase();
    const success = (status === 'confirmed' || status === 'booked') || (!parsed.error && !parsed.Error);

    return { bookingDetails: parsed, isSuccess: success };
  }, [webhookConfirmation]);


  useEffect(() => {
    // Redirect if essential data is missing
    if (!name || !webhookConfirmation) {
      router.replace("/customer_profile");
      return;
    }

    // Handle booking failure
    if (!isSuccess) {
        const errorMessage = bookingDetails?.error || bookingDetails?.Error || bookingDetails?.message || "The booking could not be confirmed by the server.";
        setBookingError(errorMessage);
        setIsLoading(false);
        return;
    }

    const fetchConfirmationMessage = async () => {
      // Ensure we have booking details before proceeding
      if (!bookingDetails) {
          setError("Could not retrieve booking details to generate a summary, but your booking is confirmed.");
          setIsLoading(false);
          return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const bookingStatus = bookingDetails.status || "Confirmed";
        
        const bookingDate = getValidDate(bookingDetails, selectedDateTime);

        if (bookingDate) {
            const formattedDateTimeForAI = format(bookingDate, 'dd LLL yyyy HH:mm');
            const response = await generateConfirmationMessage({
              name,
              address,
              bookingDateTime: formattedDateTimeForAI,
              bookingStatus: bookingStatus,
              webhookMessage: typeof bookingDetails.message === 'string' ? bookingDetails.message : undefined,
            });
            setAiResponse(response);
        } else {
            console.warn("Could not determine a valid booking date for AI confirmation.");
            setError("Could not generate AI summary, but your booking is confirmed.");
        }
      } catch (err) {
        console.error("Failed to generate AI confirmation:", err);
        setError("Could not generate AI summary, but your booking is confirmed.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfirmationMessage();
  }, [name, address, router, bookingDetails, selectedDateTime, isSuccess, webhookConfirmation]);

  const handleFinish = () => {
    resetBooking();
    router.push("/");
  };
  
  if (isLoading) {
    return <ConfirmationSkeleton />;
  }

  if (bookingError) {
    return (
      <BookingFlowLayout>
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle><div className="flex items-center gap-2"><AlertCircle className="text-destructive"/> Booking Failed</div></CardTitle>
                <CardDescription>There was a problem confirming your booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Details</AlertTitle>
                    <AlertDescription>{bookingError}</AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => router.push('/customer_profile')}>Try Again</Button>
            </CardFooter>
        </Card>
      </BookingFlowLayout>
    );
  }
  
  if (!isSuccess || !bookingDetails) {
     return (
       <BookingFlowLayout>
         <Card>
            <CardHeader><CardTitle>Confirmation Pending</CardTitle></CardHeader>
            <CardContent><p>Loading booking details...</p></CardContent>
         </Card>
       </BookingFlowLayout>
     )
  }

  const displayDate = getValidDate(bookingDetails, selectedDateTime);

  const formattedDate = bookingDetails.Date || (displayDate ? format(displayDate, "EEEE, MMMM do, yyyy") : "Date not specified");
  const formattedTime = bookingDetails.Time || (displayDate ? format(displayDate, "HH:mm") : "Time not specified");

  const directMessage = (bookingDetails.message && typeof bookingDetails.message === 'string') ? bookingDetails.message : null;
  const confirmationMessage = directMessage || aiResponse?.friendlyMessage || "Thank you for your booking. We look forward to serving you.";

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl animate-in fade-in-50 duration-500">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle>Booking Confirmed!</CardTitle>
          <CardDescription className="text-lg px-6">{confirmationMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-base">
          {error && (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-3 rounded-lg border p-4">
             <h3 className="font-semibold text-xl mb-3">Your Details</h3>
             <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /> <span>{name} {surname}</span></div>
             <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-muted-foreground" /> <span>{email}</span></div>
             <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-muted-foreground" /> <span>{cellNumber}</span></div>
             <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-muted-foreground" /> <span>{address}</span></div>
          </div>
          <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
            <h3 className="font-semibold text-xl mb-3">Your Appointment</h3>
            <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-muted-foreground" /> <strong>{formattedDate}</strong></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-muted-foreground" /> <strong>{formattedTime}</strong></div>
          </div>
          {aiResponse?.nextSteps && aiResponse.nextSteps.length > 0 && (
             <div className="space-y-3 rounded-lg border border-dashed border-accent/50 bg-accent/5 p-4">
                <h3 className="font-semibold text-xl mb-3">What's Next?</h3>
                <ul className="space-y-2 text-muted-foreground">
                    {aiResponse.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                            <span>{step}</span>
                        </li>
                    ))}
                </ul>
             </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleFinish} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
            Finish
          </Button>
        </CardFooter>
      </Card>
    </BookingFlowLayout>
  );
}
