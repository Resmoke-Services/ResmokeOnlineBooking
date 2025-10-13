
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
import { format, parseISO, startOfDay, isSameDay } from "date-fns";
import BookingFlowLayout from "@/components/booking-flow-layout";
import type { AvailabilitySlot } from "@/lib/types";

export default function SelectDateTimePage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useBookingStore();
  const { availability, setAvailability, selectedDateTime, setSelectedDateTime, addressDetails } = store;
  
  const today = useMemo(() => startOfDay(new Date()), []);

  const availableDates = useMemo(() => {
    if (!availability) return [];
    const dates = availability.map(slot => startOfDay(parseISO(slot.slotStart)));
    // Create a Set of unique date strings, then map back to Date objects
    return Array.from(new Set(dates.map(d => d.toISOString()))).map(iso => new Date(iso));
  }, [availability]);
  
  const initialDate = useMemo(() => {
    if (selectedDateTime) return parseISO(selectedDateTime.date);
    if (availableDates.length > 0) return availableDates[0];
    return today;
  }, [selectedDateTime, availableDates, today]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(selectedDateTime ? selectedDateTime.time : null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Process slots from the store into a memoized array of unique times for the selected date
  const availableTimes = useMemo(() => {
    if (!availability || !selectedDate) return [];
    
    const timesForSelectedDate = availability
      .map(slot => parseISO(slot.slotStart))
      .filter(slotDate => isSameDay(slotDate, selectedDate))
      .map(slotDate => format(slotDate, "HH:mm"));

    const uniqueTimes = Array.from(new Set(timesForSelectedDate));

    return uniqueTimes.sort((a, b) => {
        const [aHour, aMinute] = a.split(':').map(Number);
        const [bHour, bMinute] = b.split(':').map(Number);
        if (aHour !== bHour) return aHour - bHour;
        return aMinute - bMinute;
    });
  }, [availability, selectedDate]);


  const fetchSlotsForDate = useCallback(async (date: Date) => {
    setIsLoading(true);
    setSelectedTime(null);
    try {
      const { availability, setAvailability, resetBooking, ...bookingData } = store;
      const slots = await getAvailableSlots({ 
          ...bookingData,
          date: format(date, "yyyy-MM-dd"),
      });
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
  }, [toast, setAvailability, store]);
  
  // On initial load, if availability is empty (e.g. page refresh), fetch for today.
  useEffect(() => {
    if (availability.length === 0) {
        fetchSlotsForDate(initialDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability.length, initialDate]);


  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = startOfDay(date);
      setSelectedDate(newDate);
      // We only fetch new slots if the data for that day isn't already loaded
      const hasData = availability.some(slot => isSameDay(parseISO(slot.slotStart), newDate));
      if (!hasData) {
        fetchSlotsForDate(newDate);
      } else {
        setSelectedTime(null); // Reset time selection when date changes
      }
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
              disabled={(date) => {
                const isPast = date < today;
                const isUnavailable = !availableDates.some(availableDate => isSameDay(date, availableDate));
                return isPast || isUnavailable;
              }}
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
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base"
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
