
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/use-booking-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import BookingFlowLayout from '@/components/booking-flow-layout';
import { ChevronLeft, ChevronRight, CalendarOff, Loader2 } from 'lucide-react';
import { isValid, parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const TIME_ZONE = 'Africa/Johannesburg';

// Helper to get today's date as a YYYY-MM-DD string in the specified timezone
const getTodayInTimeZone = (timeZone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  };
  return new Intl.DateTimeFormat('sv-SE', options).format(new Date());
};

export default function SelectDateTimePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    availability, 
    setSelectedDateTime, 
    setWebhookConfirmation,
    // All other store data to be sent
    name, surname, cellNumber, email, address, city, otherCityDescription,
    suburb, otherSuburbDescription, propertyType, accessCodeRequired,
    itemsToRepair, problemDescriptions, paymentMethods, termsAgreement
  } = useBookingStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<{ time: string; slotStart: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If user lands here without filling details, redirect them
    if (!name) {
      router.replace("/customer_profile");
    }
  }, [name, router]);

  const { parsedAvailability, availableDates } = useMemo(() => {
    const parsed: Record<string, { time: string; slotStart: string }[]> = {};
    if (!availability || availability.length === 0) {
      return { parsedAvailability: {}, availableDates: [] };
    }
    
    const dateKeyFormatter = new Intl.DateTimeFormat('sv-SE', { timeZone: TIME_ZONE });
    const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: false });
    
    availability.forEach((slot) => {
      if (slot && slot.slotStart) {
        const date = new Date(slot.slotStart);
        if (isValid(date)) {
          const dateKey = dateKeyFormatter.format(date);
          const time = timeFormatter.format(date);
          if (!parsed[dateKey]) parsed[dateKey] = [];
          parsed[dateKey].push({ time, slotStart: slot.slotStart });
        }
      }
    });

    // Sort times for each day
    Object.values(parsed).forEach(slots => slots.sort((a, b) => a.time.localeCompare(b.time)));
    
    return { parsedAvailability: parsed, availableDates: Object.keys(parsed) };
  }, [availability]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    // Consolidate all data for the webhook
    const fullBookingDetails = {
      name,
      surname,
      cellNumber,
      email,
      address,
      city,
      otherCityDescription,
      suburb,
      otherSuburbDescription,
      propertyType,
      accessCodeRequired,
      itemsToRepair,
      problemDescriptions,
      paymentMethods,
      termsAgreement,
      slotStart: selectedTime.slotStart,
    };

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("Webhook URL is not configured. Please contact support.");
      }
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullBookingDetails),
      });

      if (!response.ok) {
        let errorDetails = `Error: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorDetails = errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
          errorDetails = `${errorDetails}: ${response.statusText}`;
        }
        throw new Error(errorDetails);
      }
      
      const responseText = await response.text();
      let result;

      if (responseText) {
          try {
              result = JSON.parse(responseText);
          } catch (e) {
              throw new Error("Failed to parse confirmation data from server.");
          }
      } else {
          // Handle empty but successful response
          console.log("Received empty but successful response for booking. Proceeding with confirmation.");
          result = { status: 'Confirmed', message: 'Booking confirmed successfully.' };
      }
      
      setWebhookConfirmation(result);
      
      const dateKey = new Intl.DateTimeFormat('sv-SE').format(selectedDate);
      setSelectedDateTime({
        date: dateKey,
        time: selectedTime.time,
      });
      router.push('/confirmation');

    } catch (error: any) {
      console.error("Booking confirmation failed:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayInSA = useMemo(() => parseISO(getTodayInTimeZone(TIME_ZONE)), []);

  const selectedDateKey = selectedDate ? new Intl.DateTimeFormat('sv-SE').format(selectedDate) : null;
  const timeSlotsForSelectedDate = selectedDateKey ? parsedAvailability[selectedDateKey] || [] : [];

  if (!name) {
    return <BookingFlowLayout><p>Loading...</p></BookingFlowLayout>;
  }

  if (availableDates.length === 0) {
    return (
     <BookingFlowLayout>
       <Card className="text-center shadow-lg">
        <CardHeader className="items-center">
            <CalendarOff className="w-16 h-16 text-destructive mb-4" />
           <CardTitle className="text-2xl">No Slots Available</CardTitle>
           <CardDescription className="text-base">We're sorry, but there are no booking slots available at this time. Please try again later.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button onClick={() => router.push('/customer_profile')}>
             <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
           </Button>
        </CardContent>
       </Card>
     </BookingFlowLayout>
    );
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Select a Date & Time</CardTitle>
          <CardDescription>Choose an available date from the calendar, then select a time.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              fromDate={todayInSA}
              disabled={(date) => {
                const dateKey = new Intl.DateTimeFormat('sv-SE').format(date);
                return date < todayInSA || !availableDates.includes(dateKey);
              }}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-center md:text-left">Available Times</h3>
            {selectedDate ? (
              timeSlotsForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlotsForSelectedDate.map(slot => (
                    <Button
                      key={slot.time}
                      variant={selectedTime?.time === slot.time ? "default" : "outline"}
                      onClick={() => setSelectedTime(slot)}
                      className="transition-all ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=selected]:ring-2 data-[state=selected]:ring-primary"
                      data-state={selectedTime?.time === slot.time ? 'selected' : 'unselected'}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">No available times for this date.</p>
              )
            ) : (
              <p className="text-muted-foreground text-center">Please select a date to see available times.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/customer_profile')}> <ChevronLeft className="mr-2 h-4 w-4" /> Back</Button>
        <Button onClick={handleConfirm} disabled={!selectedDate || !selectedTime || isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Confirming..." : "Confirm Booking"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </BookingFlowLayout>
  );
}
