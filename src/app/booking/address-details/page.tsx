"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { propertyTypes, propertyFunctions } from "@/lib/types";
import { addressDetailsSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import type { AddressComponent } from "@googlemaps/google-maps-services-js";

type AddressDetailsFormData = z.infer<typeof addressDetailsSchema>;

function parseGoogleAddress(addressComponents: AddressComponent[]) {
    let suburb = '';
    let city = '';

    for (const component of addressComponents) {
        if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
            suburb = component.long_name;
        }
        if (component.types.includes('locality')) {
            city = component.long_name;
        }
    }
    return { suburb, city };
}

function inferPropertyType(addressComponents: AddressComponent[]): string {
    const types = new Set(addressComponents.flatMap(c => c.types));
    if (types.has('premise') && types.has('neighborhood')) {
        return 'Complex in an Estate';
    }
    if (types.has('neighborhood')) {
        return 'Estate';
    }
    if (types.has('premise')) {
        return 'Complex';
    }
    return 'Home';
}

export default function AddressDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useBookingStore();
  
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!store.user) {
      router.replace('/auth');
    }
  }, [store.user, router]);

  const form = useForm<AddressDetailsFormData>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: {
      address: store.address || "",
      propertyType: store.propertyType || undefined,
      propertyFunction: store.propertyFunction || 'Private',
      suburb: store.suburb || "",
      city: store.city || "",
      accessCodeRequired: store.accessCodeRequired || false,
    },
    mode: "onChange",
  });
  
  const propertyType = form.watch("propertyType");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey && apiKey !== "your_google_maps_api_key_here") {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["places"],
      });

      loader.load().then(() => setIsGoogleMapsLoaded(true)).catch(e => {
        console.error("Failed to load Google Maps Script", e);
        toast({
          variant: "default",
          title: "Address autocomplete not available",
        });
      });
    } else {
        console.warn("Google Maps API key is not configured.");
    }
  }, [toast]);

  useEffect(() => {
    if (!isGoogleMapsLoaded || !addressInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        componentRestrictions: { country: "za" },
        fields: ["formatted_address", "address_components"],
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address && place.address_components) {
        form.setValue("address", place.formatted_address, { shouldValidate: true });

        const { suburb, city } = parseGoogleAddress(place.address_components as any);
        const inferredType = inferPropertyType(place.address_components as any);
        
        form.setValue("suburb", suburb, { shouldValidate: true });
        form.setValue("city", city, { shouldValidate: true });
        form.setValue("propertyType", inferredType, { shouldValidate: true });
        
        setIsAddressSelected(true);
      }
    });
  }, [isGoogleMapsLoaded, form]);

  async function onSubmit(data: AddressDetailsFormData) {
    setIsSubmitting(true);
    store.setAddress(data.address);
    store.setPropertyType(data.propertyType);
    store.setPropertyFunction(data.propertyFunction);
    store.setSuburb(data.suburb);
    store.setCity(data.city);
    store.setAccessCodeRequired(data.accessCodeRequired);

    router.push("/item_to_repair");
  }

  const showAccessCodeSwitch = propertyType === 'Complex' || propertyType === 'Estate' || propertyType === 'Complex in an Estate';

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Service Address</CardTitle>
          <CardDescription>Enter the address where the service will take place.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Find Address</FormLabel>
                    <FormControl>
                       <Input
                        placeholder="Start typing your address..."
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          addressInputRef.current = el;
                        }}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isAddressSelected && (
                 <div className="space-y-6 pt-4 border-t border-dashed animate-in fade-in-50 duration-500">
                    <CardDescription>Please verify the details below and correct them if needed.</CardDescription>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                            control={form.control}
                            name="propertyType"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Property Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {propertyTypes.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="propertyFunction"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Property Function</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select property function" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {propertyFunctions.map((func) => (
                                    <SelectItem key={func} value={func}>{func}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="suburb"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Suburb</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    {showAccessCodeSwitch && (
                        <FormField
                            control={form.control}
                            name="accessCodeRequired"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Is an Access Code Required?</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}
                 </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting || !isAddressSelected || !form.formState.isValid} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base">
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
          </form>
        </Form>
      </Card>
    </BookingFlowLayout>
  );
}
