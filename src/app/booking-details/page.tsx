"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';

// This is the exact JSON structure the webhook is expected to return.
const mockWebhookResponse = {
  "title": "Booking Confirmed!",
  "subtitle": "We'll see you on",
  "displayDateTime": "Monday, 20 October 2025 at 12:00",
  "isoDateTime": "2025-10-20T12:00:00+02:00",
  "serviceType": "WORKSHOP",
  "serviceCategory": "APPLIANCES REPAIRS",
  "itemsBooked": "<ul><li>DISHWASHER</li><li>OVEN</li><li>WASHING MACHINE</li><li>FRIDGE</li></ul>",
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

export default function BookingDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitBooking = async () => {
    setIsLoading(true);

    try {
      // Simulate sending data to the n8n webhook
      const response = await fetch('https://your-n8n-webhook.com/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // In a real scenario, you'd send actual booking data here
        body: JSON.stringify({ message: "This is a test submission" }),
      });

      // For this task, we ignore the actual response and use the mock data.
      // In a real implementation, you would parse the actual response:
      // const confirmationData = await response.json();
      const confirmationData = mockWebhookResponse;

      if (!response.ok && response.status !== 200) {
        // Even if we use mock data, we can simulate a server error
        // throw new Error(confirmationData.error || 'Webhook submission failed');
      }
      
      // Save the entire received JSON object to sessionStorage
      sessionStorage.setItem('confirmationData', JSON.stringify(confirmationData));

      // Navigate to the confirmation page
      router.push('/confirmation');

    } catch (error: any) {
      console.error("Booking submission failed:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "Could not confirm booking. Please try again.",
      });
      setIsLoading(false);
    }
    // Don't set isLoading to false here, as the navigation will unmount the component
  };

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Finalize Your Booking</CardTitle>
          <CardDescription>Click the button below to confirm your service request.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your booking details have been collected. By clicking confirm, you agree to our terms and services and your booking will be finalized.</p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmitBooking}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </CardFooter>
      </Card>
    </BookingFlowLayout>
  );
}