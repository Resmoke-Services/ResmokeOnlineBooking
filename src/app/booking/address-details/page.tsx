
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
import type { PropertyType } from "@/lib/types";

type AddressDetailsFormData = z.infer<typeof addressDetailsSchema>;

export default function AddressDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useBookingStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!store.user) {
      router.replace('/auth');
    }
  }, [store.user, router]);

  const form = useForm<AddressDetailsFormData>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: {
      ...store.addressDetails,
      propertyFunction: store.addressDetails.propertyFunction || 'Private',
      accessCodeRequired: store.addressDetails.accessCodeRequired || false,
    },
    mode: "onChange",
  });
  
  const propertyType = form.watch("propertyType");

  async function onSubmit(data: AddressDetailsFormData) {
    setIsSubmitting(true);
    store.setAddressDetails(data);
    router.push("/item_to_repair");
  }

  const renderFormFields = (type: PropertyType | undefined) => {
    if (!type) return null;

    const commonFields = (
        <>
            <FormField
                control={form.control}
                name="suburb"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Suburb</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Rooihuiskraal" {...field} />
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
                    <FormLabel>City / Area</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Centurion" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </>
    );
    
    const accessCodeSwitch = (
        <FormField
            control={form.control}
            name="accessCodeRequired"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
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
    );

    switch (type) {
        case 'Home':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="houseNumber" render={({ field }) => (
                        <FormItem><FormLabel>House Number</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                </div>
            );
        case 'Complex':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="unitNumber" render={({ field }) => (
                        <FormItem><FormLabel>Unit / House Number</FormLabel><FormControl><Input placeholder="e.g., Unit 45" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="complexName" render={({ field }) => (
                        <FormItem><FormLabel>Complex Name</FormLabel><FormControl><Input placeholder="e.g., The Willows" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="streetNumber" render={({ field }) => (
                        <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                    {accessCodeSwitch}
                </div>
            );
        case 'Estate':
             return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="standNumber" render={({ field }) => (
                        <FormItem><FormLabel>Stand Number</FormLabel><FormControl><Input placeholder="e.g., 556" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="houseNumber" render={({ field }) => (
                        <FormItem><FormLabel>House Number</FormLabel><FormControl><Input placeholder="e.g., 42" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetNameInEstate" render={({ field }) => (
                        <FormItem><FormLabel>Street Name (in estate)</FormLabel><FormControl><Input placeholder="e.g., Protea Avenue" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="estateName" render={({ field }) => (
                        <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input placeholder="e.g., Blue Valley Estate" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                    {accessCodeSwitch}
                </div>
            );
        case 'Complex in an Estate':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="unitNumber" render={({ field }) => (
                        <FormItem><FormLabel>Unit / House Number</FormLabel><FormControl><Input placeholder="e.g., 7" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="complexName" render={({ field }) => (
                        <FormItem><FormLabel>Complex Name</FormLabel><FormControl><Input placeholder="e.g., The Oaks" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetNameInEstate" render={({ field }) => (
                        <FormItem><FormLabel>Street Name (in estate)</FormLabel><FormControl><Input placeholder="e.g., Protea Avenue" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="estateName" render={({ field }) => (
                        <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input placeholder="e.g., Blue Valley Estate" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                    {accessCodeSwitch}
                </div>
            );
        default:
            return null;
    }
  }

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>What type of property is it?</FormLabel>
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

                {propertyType && (
                    <div className="space-y-6 pt-4 border-t border-dashed animate-in fade-in-50 duration-500">
                        {renderFormFields(propertyType)}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base">
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
