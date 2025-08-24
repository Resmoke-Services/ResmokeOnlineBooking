
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import type { BookingFormData, AvailabilitySlot } from "@/lib/types";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  cellNumber: z.string().regex(/^(\+?\d{1,3}[- ]?)?\d{9,11}$/, { message: "Invalid cell number format." }),
  email: z.string().email({ message: "Invalid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
});

export default function ContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, name, surname, cellNumber, email, address, setName, setSurname, setCellNumber, setEmail, setAddress, setAvailability } = useBookingStore();
  
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/auth');
    }
  }, [user, router]);

  useEffect(() => {
    // This ensures the env var is only read on the client side
    setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? null);
  }, []);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name, surname, cellNumber, email, address },
    mode: "onChange",
  });
  
  // Resets the form if data in the store changes (e.g., after login)
  useEffect(() => {
    form.reset({ name, surname, cellNumber, email, address });
  }, [name, surname, cellNumber, email, address, form]);


  // Effect to load Google Maps script
  useEffect(() => {
    if (apiKey && apiKey !== "your_google_maps_api_key_here") {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["places"],
      });

      loader.load().then(() => {
        setIsGoogleMapsLoaded(true);
      }).catch(e => {
        console.error("Failed to load Google Maps Script", e);
        toast({
          variant: "default",
          title: "Address autocomplete not available",
          description: "Could not load Google Maps. Please enter your address manually.",
        });
      });
    }
  }, [apiKey, toast]);

  // Effect to attach Autocomplete to the input field
  useEffect(() => {
    if (isGoogleMapsLoaded && addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          componentRestrictions: { country: "za" }, // Restrict to South Africa
          fields: ["formatted_address"],
          types: ["address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          form.setValue("address", place.formatted_address, { shouldValidate: true });
        }
      });
    }
  }, [isGoogleMapsLoaded, form]);

  async function onSubmit(data: BookingFormData) {
    setIsSubmitting(true);
    
    // Update store with latest form data
    setName(data.name);
    setSurname(data.surname);
    setCellNumber(data.cellNumber);
    setEmail(data.email);
    setAddress(data.address);

    // If user is not a guest, save/update their details in Firestore
    if (user && !user.isGuest) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
          name: data.name,
          surname: data.surname,
          cellNumber: data.cellNumber,
          address: data.address,
          email: data.email, // ensure email is saved
          displayName: `${data.name} ${data.surname}`.trim(),
        }, { merge: true }); // Use merge to avoid overwriting other fields like createdAt
      } catch (error) {
        console.error("Failed to save user details to Firestore:", error);
        // We don't need to block the booking for this, but good to know.
      }
    }
    
    try {
      const response = await fetch('https://primary-production-5528.up.railway.app/webhook-test/bookings-resmoke-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorDetails = `Error: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorDetails = errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
          // If parsing JSON fails, use the status text.
          errorDetails = `${errorDetails}: ${response.statusText}`;
        }
        throw new Error(errorDetails);
      }
      
      const responseText = await response.text();
      let availabilityData: AvailabilitySlot[] = [];

      if (responseText) {
        try {
          availabilityData = JSON.parse(responseText);
        } catch (e) {
          throw new Error("Failed to parse availability data from server.");
        }
      } else {
        // Handle empty but successful response
        console.log("Received empty but successful response for availability. Assuming no slots.");
      }

      setAvailability(availabilityData);
      router.push("/select-datetime");

    } catch (error: any) {
      console.error("Failed to fetch availability:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (!user) {
    return <BookingFlowLayout><div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div></BookingFlowLayout>
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Your Details</CardTitle>
          <CardDescription>Please provide your contact information to proceed with your booking.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="cellNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g., 0821234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} readOnly={!user?.isGuest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                       <Input
                        placeholder="Start typing your address..."
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          addressInputRef.current = el;
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Processing..." : "Next"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BookingFlowLayout>
  );
}
