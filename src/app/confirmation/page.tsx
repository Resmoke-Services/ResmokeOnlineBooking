"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Mail, Phone, User, Wrench, Building2, Truck } from "lucide-react";
import BookingFlowLayout from "@/components/booking-flow-layout";
import ConfirmationSkeleton from "@/components/confirmation-skeleton";

// Define the structure of the confirmation data
interface ConfirmationData {
  title: string;
  subtitle: string;
  displayDateTime: string;
  isoDateTime: string;
  serviceType: string;
  serviceCategory: string;
  itemsBooked: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  nextSteps: string[];
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This logic runs on the client-side after the component mounts
    const loadConfirmationData = () => {
      try {
        // 1. Get the real data from sessionStorage
        const storedData = sessionStorage.getItem('confirmationData');

        if (storedData) {
          const parsedData: ConfirmationData = JSON.parse(storedData);
          setConfirmationData(parsedData);
          
          // Optional: Clear the data so it's not shown again on a refresh
          // sessionStorage.removeItem('confirmationData');
        } else {
          // If a user lands here directly, there's no data. Redirect them.
          throw new Error("No booking data found. Redirecting to home.");
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load booking details.");
        // Redirect to the start of the booking process if anything goes wrong
        setTimeout(() => router.replace('/'), 3000); 
      } finally {
        // Use a short timeout to prevent visual flicker
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    loadConfirmationData();

    // Block the back button and redirect to the company website
    window.history.pushState(null, '', window.location.href);
    const handleBackButton = (e: PopStateEvent) => {
        e.preventDefault();
        window.location.href = 'https://www.resmoke.co.za';
    };
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = () => {
    sessionStorage.removeItem('confirmationData');
    window.location.href = "https://www.resmoke.co.za";
  };
  
  if (isLoading) {
    return (
        <BookingFlowLayout>
            <div className="max-w-3xl mx-auto">
                <ConfirmationSkeleton />
            </div>
        </BookingFlowLayout>
    );
  }

  if (error || !confirmationData) {
    return (
        <BookingFlowLayout>
            <div className="flex flex-col justify-center items-center h-64 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Confirmation</h2>
                <p className="text-muted-foreground">{error || "Could not load confirmation details."}</p>
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
            <h1 className="text-3xl font-bold tracking-tight">{confirmationData.title}</h1>
            <p className="text-muted-foreground mt-2 text-lg">{confirmationData.subtitle}</p>
            <p className="text-xl font-semibold text-foreground mt-2">{confirmationData.displayDateTime}</p>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Your Details</h3>
                    <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /> <span>{confirmationData.customerDetails.name}</span></div>
                    <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-muted-foreground" /> <span>{confirmationData.customerDetails.email}</span></div>
                    <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-muted-foreground" /> <span>{confirmationData.customerDetails.phone}</span></div>
                    <div className="flex items-start gap-3"><Home className="w-5 h-5 text-muted-foreground mt-1" /> <span>{confirmationData.customerDetails.address}</span></div>
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Booking Details</h3>

                    <div className="flex items-start gap-3"><Wrench className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <h4 className="font-medium">SERVICE BOOKED:</h4>
                            <ul className="list-disc pl-5 text-muted-foreground">
                                <li>{confirmationData.serviceCategory}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3"><Building2 className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <h4 className="font-medium">TYPE BOOKED:</h4>
                            <ul className="list-disc pl-5 text-muted-foreground">
                                <li>{confirmationData.serviceType}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start gap-3"><Truck className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium">ITEMS BOOKED:</h4>
                         <div
                            className="text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5"
                            dangerouslySetInnerHTML={{ __html: confirmationData.itemsBooked }}
                          />
                      </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/20">
                <h3 className="font-semibold text-lg mb-3 border-b pb-2">Next Steps</h3>
                <ul className="space-y-2 text-muted-foreground">
                    {confirmationData.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-1 shrink-0" />
                            <span>{step}</span>
                        </li>
                    ))}
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