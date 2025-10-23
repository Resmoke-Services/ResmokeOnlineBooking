
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/use-booking-store";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Mail, Phone, User, ArrowLeft, Wrench, Building2, Truck } from "lucide-react";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { format, parse } from "date-fns";

export default function ConfirmationPage() {
  const router = useRouter();
  const { 
    name, 
    surname, 
    email, 
    cellNumber, 
    formattedAddress, 
    selectedDateTime, 
    servicePath,
    serviceType,
    itemsToRepair,
    resetBooking 
  } = useBookingStore();

  useEffect(() => {
    // If essential booking data is missing, redirect to the start.
    if (!name || !selectedDateTime) {
      router.replace('/item_to_repair');
      return;
    }

    // This makes the confirmation page the final step.
    // Pushing '/' adds it to history, then replacing the current state
    // with '/' means the "back" action from here goes to the home page.
    window.history.pushState(null, '', '/');
    window.history.replaceState(null, '', '/');

    const handleBackButton = (e: PopStateEvent) => {
        // Prevent default back behavior and force to home page
        e.preventDefault();
        resetBooking();
        router.replace('https://www.resmoke.co.za');
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = () => {
    resetBooking();
    window.location.href = "https://www.resmoke.co.za";
  };
  
  const formattedBookingTime = selectedDateTime
    ? format(parse(`${selectedDateTime.date} ${selectedDateTime.time}`, 'yyyy-MM-dd HH:mm', new Date()), "eeee, d MMMM yyyy 'at' HH:mm")
    : 'Not selected';

  // This will be rendered briefly before useEffect redirects if data is missing.
  if (!name || !selectedDateTime) {
      return (
        <BookingFlowLayout>
            <div className="flex justify-center items-center h-64">
                <p>Loading booking details...</p>
            </div>
        </BookingFlowLayout>
      );
  }

  return (
    <BookingFlowLayout>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl border bg-card text-card-foreground shadow-2xl shadow-primary/10">
          <div className="p-8 text-center bg-primary/10 rounded-t-xl">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">Booking Confirmed!</h1>
            <p className="text-muted-foreground mt-2 text-lg">We'll see you on</p>
            <p className="text-xl font-semibold text-foreground mt-2">{formattedBookingTime}</p>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Your Details</h3>
                    <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /> <span>{name} {surname}</span></div>
                    <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-muted-foreground" /> <span>{email}</span></div>
                    <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-muted-foreground" /> <span>{cellNumber}</span></div>
                    <div className="flex items-start gap-3"><Home className="w-5 h-5 text-muted-foreground mt-1" /> <span>{formattedAddress}</span></div>
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Booking Details</h3>
                    <div className="flex items-center gap-3"><Wrench className="w-5 h-5 text-muted-foreground" /> <span>{servicePath.join(' / ')}</span></div>
                    <div className="flex items-center gap-3"><Building2 classame="w-5 h-5 text-muted-foreground" /> <span>{serviceType}</span></div>
                     <div className="flex items-start gap-3"><Truck className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                            <h4 className="font-medium">Items Booked:</h4>
                            <ul className="list-disc pl-5 text-muted-foreground">
                                {itemsToRepair.map(item => <li key={item}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/20">
                <h3 className="font-semibold text-lg mb-3 border-b pb-2">Next Steps</h3>
                <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                        <span>You'll receive a booking confirmation email.</span>
                    </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                        <span>For any quiries or concerns, please contact us on 060 084 1133 (Phone 24/7).</span>
                    </li>
                </ul>
            </div>

            <div className="text-center pt-6">
              <Button onClick={handleFinish} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-base">
                Finish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BookingFlowLayout>
  );
}
