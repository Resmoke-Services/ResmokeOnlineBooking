
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/use-booking-store";
import { getAvailableSlots } from "@/app/actions/booking-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import { format, parseISO, startOfDay } from "date-fns";
import BookingFlowLayout from "@/components/booking-flow-layout";
import type { AvailabilitySlot } from "@/lib/types";

export default function SelectDateTimePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { availability, setAvailability, selectedDateTime, setSelectedDateTime } = useBookingStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selectedDateTime ? parseISO(selectedDateTime.date) : new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(selectedDateTime ? selectedDateTime.time : null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);

  // Process slots from the store into a memoized array of unique times
  const availableTimes = useMemo(() => {
    if (!availability) return [];
    const times = availability.map(slot => format(parseISO(slot.slotStart), "HH:mm"));
    const uniqueTimes = Array.from(new Set(times));
    return uniqueTimes.sort((a, b) => {
        const [aHour, aMinute] = a.split(':').map(Number);
        const [bHour, bMinute] = b.split(':').map(Number);
        if (aHour !== bHour) return aHour - bHour;
        return aMinute - bMinute;
    });
  }, [availability]);


  const fetchSlotsForDate = useCallback(async (date: Date) => {
    setIsLoading(true);
    setSelectedTime(null);
    try {
      const slots = await getAvailableSlots({ date: format(date, "yyyy-MM-dd") });
      setAvailability(slots);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to load times",
        description: error.message || "Could not fetch available time slots.",
      });
      setAvailability([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast, setAvailability]);
  
  // On initial load, if availability is empty (e.g. page refresh), fetch for today.
  useEffect(() => {
    if (availability.length === 0) {
      fetchSlotsForDate(today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability.length, today]);


  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchSlotsForDate(date);
    }
  };

  const handleSubmit = () => {
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

    setSelectedDateTime({ date: formattedDate, time: selectedTime });
    
    router.push("/payment_and_terms");
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
                    Processing...
                  </>
                ) : (
                  "Next"
                )}
            </Button>
        </CardFooter>
      </Card>
    </BookingFlowLayout>
  );
}

