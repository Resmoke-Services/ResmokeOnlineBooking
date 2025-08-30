
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import type { CustomerProfileData } from "@/lib/types";
import { suburbs, propertyTypes, accessCodeOptions } from "@/lib/types";
import { customerProfileSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "@/hooks/use-firestore";

export default function ContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, name, surname, cellNumber, email, address, suburb, propertyType, accessCodeRequired, setName, setSurname, setCellNumber, setEmail, setAddress, setSuburb, setPropertyType, setAccessCodeRequired, setAvailability } = useBookingStore();
  const firestore = useFirestore();
  
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

  const form = useForm<CustomerProfileData>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      name,
      surname,
      cellNumber,
      email,
      address,
      suburb: suburb,
      propertyType: propertyType ?? undefined,
      accessCodeRequired: accessCodeRequired ?? undefined,
    },
    mode: "onChange",
  });
  
  // Resets the form if data in the store changes (e.g., after login)
  useEffect(() => {
    form.reset({ name, surname, cellNumber, email, address, suburb: suburb, propertyType: propertyType ?? undefined, accessCodeRequired: accessCodeRequired ?? undefined });
  }, [name, surname, cellNumber, email, address, suburb, propertyType, accessCodeRequired, form]);


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
      // Define the bounds for Gauteng, South Africa
      const gautengBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(-26.75, 27.7), // Southwest corner of Gauteng
        new window.google.maps.LatLng(-25.5, 28.5)  // Northeast corner of Gauteng
      );

      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          componentRestrictions: { country: "za" }, // Restrict to South Africa
          bounds: gautengBounds,
          strictBounds: true, // Only show results within the defined gautengBounds
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

  async function onSubmit(data: CustomerProfileData) {
    setIsSubmitting(true);
    
    // Update store with latest form data
    setName(data.name);
    setSurname(data.surname);
    setCellNumber(data.cellNumber);
    setEmail(data.email);
    setAddress(data.address);
    setSuburb(data.suburb);
    setPropertyType(data.propertyType);
    setAccessCodeRequired(data.accessCodeRequired);

    // Save/update their details in Firestore for any authenticated user
    if (user && firestore) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
          name: data.name,
          surname: data.surname,
          cellNumber: data.cellNumber,
          address: data.address,
          suburb: data.suburb,
          propertyType: data.propertyType,
          accessCodeRequired: data.accessCodeRequired,
          email: data.email, // ensure email is saved
          displayName: `${data.name} ${data.surname}`.trim(),
        }, { merge: true }); // Use merge to avoid overwriting other fields like createdAt
      } catch (error) {
        console.error("Failed to save user details to Firestore:", error);
        // We don't need to block the booking for this, but good to know.
      }
    }
    
    router.push("/item_to_repair");
  }

  if (!user) {
    return <BookingFlowLayout><div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div></BookingFlowLayout>
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Customer Profile</CardTitle>
          <CardDescription>Please provide your details to proceed with your booking.</CardDescription>
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
               <FormField
                control={form.control}
                name="suburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suburb</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select suburb" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {suburbs.map((sub) => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Property Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                        className="flex flex-wrap gap-x-8 gap-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="House" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            House
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Complex" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Complex
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Estate" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Estate
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Complex in an Estate" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Complex in an Estate
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Other" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Other
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessCodeRequired"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Access Code Required</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                        className="flex flex-row space-x-8"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Yes" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="No" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base">
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
