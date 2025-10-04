"use client";

import "dotenv/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/use-booking-store";
import { Button } from "@/components/ui/button";
import { generateConfirmationMessage, ConfirmationOutput } from "@/ai/flows/confirmation-flow"; 
import { CheckCircle, Home, Mail, Phone, User, Calendar as CalendarIcon, Clock, Wand2, ArrowLeft } from "lucide-react";
import ConfirmationSkeleton from "@/components/confirmation-skeleton";
import BookingFlowLayout from "@/components/booking-flow-layout";

export default function ConfirmationPage() {
  const router = useRouter();
  const { name, surname, email, cellNumber, formattedAddress, webhookConfirmation, selectedDateTime, resetBooking } = useBookingStore();
  const [aiResponse, setAiResponse] = useState<ConfirmationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getConfirmation = async () => {
      if (!name || !selectedDateTime || !formattedAddress) {
        router.push('/item_to_repair');
        return;
      }

      try {
        setIsLoading(true);
        const input = {
          name,
          address: formattedAddress,
          bookingDateTime: `${selectedDateTime.date} at ${selectedDateTime.time}`,
          bookingStatus: webhookConfirmation?.status || 'Confirmed',
          webhookMessage: webhookConfirmation?.message || 'Booking was successful.',
        };
        const response = await generateConfirmationMessage(input);
        setAiResponse(response);
      } catch (e: any) {
        setError("Sorry, we couldn't generate an AI summary for your booking, but it is confirmed.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getConfirmation();
  }, [name, formattedAddress, selectedDateTime, webhookConfirmation, router]);

  const handleNewBooking = () => {
    resetBooking();
    router.push("/");
  };
  
  const bookingTime = selectedDateTime ? `${selectedDateTime.date} at ${selectedDateTime.time}` : 'Not selected';

  if (isLoading) {
    return (
        <BookingFlowLayout>
            <ConfirmationSkeleton />
        </BookingFlowLayout>
    )
  }

  return (
    <BookingFlowLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
            <button onClick={() => router.push('/')} className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </button>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-2xl shadow-primary/10">
          <div className="p-8 text-center bg-primary/10 rounded-t-xl">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Booking Confirmed!</h1>
            <p className="text-muted-foreground mt-2 text-lg">Thank you, {name}. Your appointment is set.</p>
          </div>
          <div className="p-8 space-y-8">
            {error && <p className="text-center text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
            {aiResponse && (
                <div className="flex items-start gap-4 rounded-lg border border-dashed p-4 text-left">
                    <Wand2 className="w-8 h-8 text-primary shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Booking Summary</h3>
                        <p className="text-muted-foreground">{aiResponse.friendlyMessage}</p>
                    </div>
                </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Your Details</h3>
                    <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /> <span>{name} {surname}</span></div>
                    <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-muted-foreground" /> <span>{email}</span></div>
                    <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-muted-foreground" /> <span>{cellNumber}</span></div>
                    <div className="flex items-start gap-3"><Home className="w-5 h-5 text-muted-foreground mt-1" /> <span>{formattedAddress}</span></div>
                </div>
                <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Appointment</h3>
                     <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-muted-foreground" /> <span>{selectedDateTime?.date}</span></div>
                    <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-muted-foreground" /> <span>{selectedDateTime?.time}</span></div>
                </div>
            </div>

            {aiResponse?.nextSteps && (
                <div className="rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3">Next Steps</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        {aiResponse.nextSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="text-center pt-6">
              <Button onClick={handleNewBooking} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-base">
                Make Another Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BookingFlowLayout>
  );
}
