
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/use-booking-store";
import { getAvailableSlots, confirmBooking } from "@/app/actions/booking-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import { format, parseISO, startOfDay } from "date-fns";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { type BookingData } from "@/lib/types";

// Helper function to create a plain object from the Zustand store proxy
const getPlainStoreObject = (store: BookingData) => {
  return JSON.parse(JSON.stringify(store));
};


export default function SelectDateTimePage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useBookingStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!store.user) {
      router.replace('/auth?next=/select_datetime');
      return;
    }
    fetchSlots();
  }, [store.user, router]);
  
  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const availabilityRequestDetails = {
        // Pass any necessary details from the store
      };
      const slots = await getAvailableSlots(availabilityRequestDetails);
      const times = slots.map(slot => format(parseISO(slot.slotStart), "HH:mm"));
      setAvailableTimes(times);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load times",
        description: error.message || "Could not fetch available time slots.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = useMemo(() => startOfDay(new Date()), []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null);
      // Here you would typically refetch available times for the new date
      // For this example, we'll use the same list of times.
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Incomplete Selection",
        description: "Please select a date and time.",
      });
      return;
    }

    setIsSubmitting(true);
    
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    store.setSelectedDateTime({ date: formattedDate, time: selectedTime });

    try {
      // Get a plain object representation of the store's state
      // This is important to ensure server actions receive serializable data
      const plainStoreState = getPlainStoreObject(store.$state);

      const confirmationDetails = {
        ...plainStoreState,
        selectedDateTime: { date: formattedDate, time: selectedTime },
      };
      
      const confirmation = await confirmBooking(confirmationDetails);
      store.setWebhookConfirmation(confirmation);
      router.push("/confirmation");
      
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Select a Date and Time</CardTitle>
          <CardDescription>Choose an available slot for your service.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < today}
              className="rounded-md border"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-4">
              Available Times for {selectedDate ? format(selectedDate, "PPP") : '...'}
            </h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.length > 0 ? availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                )) : (
                  <p className="col-span-3 text-muted-foreground">No available slots for this day.</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
                onClick={handleSubmit}
                disabled={!selectedDate || !selectedTime || isSubmitting}
            >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Booking"
                )}
            </Button>
        </CardFooter>
      </Card>
    </BookingFlowLayout>
  );
}
