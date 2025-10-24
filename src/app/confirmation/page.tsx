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
    // Simulate fetching data from a webhook response
    const fetchConfirmationData = () => {
      try {
        // This is where you would typically fetch data from your API
        // For now, we'll use the mock data provided.
        const mockData: ConfirmationData = {
            "title": "Booking Confirmed!",
            "subtitle": "We'll see you on",
            "displayDateTime": "Monday, 20 October 2025 at 12:00",
            "isoDateTime": "2025-10-20T12:00:00+02:00",
            "serviceType": "WORKSHOP",
            "serviceCategory": "APPLIANCE REPAIRS",
            "itemsBooked": "<ul><li>DISHWASHER</li></ul>",
            "customerDetails": {
              "name": "Anton Kusel",
              "email": "uniquesystems1@gmail.com",
              "phone": "+27817889504",
              "address": "2 Basil Rd, Valhalla, Centurion"
            },
            "nextSteps": [
              "You'll receive a booking confirmation email.",
              "For any queries or concerns, please contact us on 060 084 1133 (Phone 24/7)."
            ]
          };

        setTimeout(() => {
          setConfirmationData(mockData);
          setIsLoading(false);
        }, 1500); // Simulate a 1.5-second network delay

      } catch (err) {
        setError("Failed to load booking confirmation details. Please contact support.");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchConfirmationData();

    // Block the back button and redirect to home
    window.history.pushState(null, '', '/');
    window.history.replaceState(null, '', '/');

    const handleBackButton = (e: PopStateEvent) => {
        e.preventDefault();
        router.replace('https://www.resmoke.co.za');
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = () => {
    // No need to reset a store, just navigate
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

  if (error) {
    return (
        <BookingFlowLayout>
            <div className="flex flex-col justify-center items-center h-64 text-center">
                <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
                <p className="text-muted-foreground">{error}</p>
            </div>
        </BookingFlowLayout>
    );
  }

  if (!confirmationData) {
      return null; // Or some fallback UI
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
                            <h4 className="font-medium">PLACE BOOKED:</h4>
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