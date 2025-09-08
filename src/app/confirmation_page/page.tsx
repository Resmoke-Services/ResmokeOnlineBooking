"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/booking";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { runConfirmationFlow } from "@/ai/flows/confirmation-flow"; 
import { ConfirmationOutput } from "@/ai/flows/confirmation-flow";

export default function ConfirmationPage() {
  const router = useRouter();
  // Correctly destructuring 'addressDetails' instead of 'address'
  const { name, surname, email, cellNumber, addressDetails, webhookConfirmation, selectedDateTime, resetBooking } = useBookingStore();
  const [aiResponse, setAiResponse] = useState<ConfirmationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getConfirmation = async () => {
      if (!name || !selectedDateTime || !addressDetails) {
        // Redirect if essential booking details are missing
        router.push('/booking');
        return;
      }

      try {
        setIsLoading(true);
        const bookingDetails = {
            name,
            surname,
            email,
            cellNumber,
            address: JSON.stringify(addressDetails, null, 2),
            dateTime: selectedDateTime.toString(),
        };
        const response = await runConfirmationFlow(bookingDetails);
        setAiResponse(response);
      } catch (e: any) {
        setError("Sorry, we couldn't get a confirmation. Please try again.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getConfirmation();
  }, [name, surname, email, cellNumber, addressDetails, selectedDateTime, router]);

  const handleConfirm = () => {
    // Logic to finalize booking
    console.log("Booking confirmed!");
    resetBooking();
    router.push("/thank-you");
  };

  const renderAddress = () => {
    if (!addressDetails) return <p>No address provided.</p>;
    
    const { streetName, houseNumber, suburb, city } = addressDetails;
    return <p>{houseNumber} {streetName}, {suburb}, {city}</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <Progress value={100} className="mb-8" />
        <h2 className="text-2xl font-bold mb-4 text-center">Confirm Your Booking</h2>
        {isLoading && <p className="text-center">Generating confirmation...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {aiResponse && (
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <p><strong>Name:</strong> {name} {surname}</p>
                <p><strong>Contact:</strong> {email} / {cellNumber}</p>
                <p><strong>Date & Time:</strong> {selectedDateTime?.toLocaleString()}</p>
                <div><strong>Address:</strong> {renderAddress()}</div>
                <hr />
                <h3 className="font-semibold">AI Summary:</h3>
                <p className="italic text-gray-700">{aiResponse.summary}</p>
                <p><strong>Confirmation Code:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{aiResponse.confirmationCode}</span></p>
            </div>
        )}

        <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            <Button onClick={handleConfirm} disabled={isLoading || !!error}>
                Confirm Booking
            </Button>
        </div>
    </div>
  );
}
