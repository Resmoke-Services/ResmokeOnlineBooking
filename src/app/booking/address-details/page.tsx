
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { propertyTypes, propertyFunctions, cities } from "@/lib/types";
import { addressDetailsSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import type { PropertyType, PropertyFunction, City } from "@/lib/types";

type AddressDetailsFormData = z.infer<typeof addressDetailsSchema>;

// Define a blank initial state to guarantee a clean form on load.
const initialFormState: AddressDetailsFormData = {
    propertyType: undefined,
    propertyFunction: undefined,
    suburb: '',
    city: undefined,
    otherCityDescription: '',
    houseNumber: '',
    streetName: '',
    unitNumber: '',
    complexName: '',
    streetNumber: '',
    standNumber: '',
    streetNameInEstate: '',
    estateName: '',
    officeName: '',
    officeParkName: '',
    holdingName: '',
    farmName: '',
    otherPropertyType: '',
    accessCodeRequired: undefined,
};


export default function AddressDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setAddressDetails: setStoreAddressDetails } = useBookingStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/auth?next=/booking/address-details');
    }
    // Clear any lingering address data in the store when the component mounts
    setStoreAddressDetails({} as any);
  }, [user, router, setStoreAddressDetails]);

  const form = useForm<AddressDetailsFormData>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: initialFormState,
    mode: "onChange",
  });
  
  const propertyType = form.watch("propertyType");
  const propertyFunction = form.watch("propertyFunction");
  const city = form.watch("city");

  async function onSubmit(data: AddressDetailsFormData) {
    setIsSubmitting(true);
    const processedData = {
        ...data,
        accessCodeRequired: data.accessCodeRequired === 'yes',
    };
    setStoreAddressDetails(processedData as any);
    router.push("/item_to_repair");
  }
  
  const cityFields = (
    <>
      <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
          <FormItem>
              <FormLabel>City</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    const currentValues = form.getValues();
                    form.reset({
                      ...initialFormState,
                      propertyType: currentValues.propertyType,
                      propertyFunction: currentValues.propertyFunction,
                      city: value as City,
                    });
                    field.onChange(value);
                  }} 
                  value={field.value}
                  disabled={!propertyType || !propertyFunction}
                >
                  <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="c) Select city / area" />
                      </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              <FormMessage />
          </FormItem>
          )}
      />
      {city === 'Other' && (
          <FormField
              control={form.control}
              name="otherCityDescription"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Please Specify City</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., Johannesburg" {...field} disabled={!propertyType || !propertyFunction || !city} />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />
      )}
    </>
  );

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
                        <Input placeholder="e.g., Rooihuiskraal" {...field} disabled={!propertyType || !propertyFunction || !city} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </>
    );
    
    const accessCodeRadioGroup = (
        <FormField
          control={form.control}
          name="accessCodeRequired"
          render={({ field }) => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel>Access Code Required?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row space-x-4"
                  disabled={!propertyType || !propertyFunction || !city}
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    switch (type) {
        case 'Home':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="houseNumber" render={({ field }) => (
                        <FormItem><FormLabel>House Number</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                </div>
            );
        case 'Complex':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="unitNumber" render={({ field }) => (
                        <FormItem><FormLabel>Unit / House Number</FormLabel><FormControl><Input placeholder="e.g., Unit 45" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="complexName" render={({ field }) => (
                        <FormItem><FormLabel>Complex Name</FormLabel><FormControl><Input placeholder="e.g., The Willows" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="streetNumber" render={({ field }) => (
                        <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Estate':
             return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="standNumber" render={({ field }) => (
                        <FormItem><FormLabel>Stand Number</FormLabel><FormControl><Input placeholder="e.g., 556" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="houseNumber" render={({ field }) => (
                        <FormItem><FormLabel>House Number</FormLabel><FormControl><Input placeholder="e.g., 42" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetNameInEstate" render={({ field }) => (
                        <FormItem><FormLabel>Street Name (in estate)</FormLabel><FormControl><Input placeholder="e.g., Protea Avenue" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="estateName" render={({ field }) => (
                        <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input placeholder="e.g., Blue Valley Estate" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Complex in an Estate':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="unitNumber" render={({ field }) => (
                        <FormItem><FormLabel>Unit / House Number</FormLabel><FormControl><Input placeholder="e.g., 7" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="complexName" render={({ field }) => (
                        <FormItem><FormLabel>Complex Name</FormLabel><FormControl><Input placeholder="e.g., The Oaks" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetNameInEstate" render={({ field }) => (
                        <FormItem><FormLabel>Street Name (in estate)</FormLabel><FormControl><Input placeholder="e.g., Protea Avenue" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="estateName" render={({ field }) => (
                        <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input placeholder="e.g., Blue Valley Estate" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Office':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="officeName" render={({ field }) => (
                        <FormItem><FormLabel>Office / Building Name</FormLabel><FormControl><Input placeholder="e.g., Riverwalk Office" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="officeParkName" render={({ field }) => (
                        <FormItem><FormLabel>Office Park Name (Optional)</FormLabel><FormControl><Input placeholder="e.g., Centurion Office Park" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetNumber" render={({ field }) => (
                        <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Small Holding':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="holdingName" render={({ field }) => (
                        <FormItem><FormLabel>Holding Name / Number</FormLabel><FormControl><Input placeholder="e.g., Plot 123" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street / Road Name</FormLabel><FormControl><Input placeholder="e.g., R55" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                </div>
            );
        case 'Farm':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="farmName" render={({ field }) => (
                        <FormItem><FormLabel>Farm Name / Number</FormLabel><FormControl><Input placeholder="e.g., Sunnydale Farm" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Road Name</FormLabel><FormControl><Input placeholder="e.g., R511" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                </div>
            );
        case 'Other':
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="otherPropertyType" render={({ field }) => (
                        <FormItem><FormLabel>Specify Property Type</FormLabel><FormControl><Input placeholder="e.g., Warehouse, School" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="streetNumber" render={({ field }) => (
                        <FormItem><FormLabel>Street / Unit Number</FormLabel><FormControl><Input placeholder="e.g., 42B" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input placeholder="e.g., Industrial Road" {...field} disabled={!propertyType || !propertyFunction || !city} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {commonFields}
                </div>
            )
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                form.reset({
                                  ...initialFormState,
                                  propertyType: value as PropertyType,
                                });
                                field.onChange(value);
                              }} 
                              value={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="a) Select property type" />
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
                            <Select 
                              onValueChange={(value) => {
                                const currentValues = form.getValues();
                                form.reset({
                                  ...initialFormState,
                                  propertyType: currentValues.propertyType,
                                  propertyFunction: value as PropertyFunction,
                                });
                                field.onChange(value);
                              }} 
                              value={field.value} 
                              disabled={!propertyType}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="b) Select property function" />
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
                    <div className="md:col-span-2 lg:col-span-1">
                        {cityFields}
                    </div>
                </div>

                {propertyType && propertyFunction && city && (
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
