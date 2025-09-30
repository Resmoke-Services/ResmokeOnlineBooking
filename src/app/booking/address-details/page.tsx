
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/hooks/use-booking-store";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { addressDetailsSchema } from "@/lib/schemas";
import { propertyTypes, cities, centurionSuburbs, pretoriaSuburbs, midrandSuburbs, centurionComplexes, midrandComplexes, pretoriaComplexes } from "@/lib/types";
import { useMemo } from "react";
import { ChevronLeft } from "lucide-react";

type AddressFormValues = z.infer<typeof addressDetailsSchema>;

export default function AddressDetailsPage() {
  const router = useRouter();
  const { addressDetails, setAddressDetails: setStoreAddressDetails } = useBookingStore();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: {
      propertyType: addressDetails?.propertyType || undefined,
      propertyFunction: addressDetails?.propertyFunction || 'Private',
      city: addressDetails?.city || undefined,
      suburb: addressDetails?.suburb || '',
      houseNumber: addressDetails?.houseNumber || '',
      streetName: addressDetails?.streetName || '',
      unitNumber: addressDetails?.unitNumber || '',
      complexName: addressDetails?.complexName || '',
      otherComplexName: addressDetails?.otherComplexName || '',
      streetNumber: addressDetails?.streetNumber || '',
      streetNameInEstate: addressDetails?.streetNameInEstate || '',
      estateName: addressDetails?.estateName || '',
      accessCodeRequired: addressDetails?.accessCodeRequired || 'no',
      standNumber: addressDetails?.standNumber || '',
      officeName: addressDetails?.officeName || '',
      officeParkName: addressDetails?.officeParkName || '',
      holdingName: addressDetails?.holdingName || '',
      farmName: addressDetails?.farmName || '',
      otherPropertyType: addressDetails?.otherPropertyType || '',
      otherCityDescription: addressDetails?.otherCityDescription || '',
      otherSuburb: addressDetails?.otherSuburb || '',
    },
    mode: 'onChange',
  });

  const { watch, control } = form;
  const propertyType = watch("propertyType");
  const city = watch("city");
  const suburb = watch("suburb");
  const complexName = watch("complexName");

  const suburbOptions = useMemo(() => {
    switch (city) {
      case 'Centurion': return centurionSuburbs;
      case 'Pretoria': return pretoriaSuburbs;
      case 'Midrand': return midrandSuburbs;
      default: return [];
    }
  }, [city]);

  const complexOptions = useMemo(() => {
    if (!city || !suburb) return [];
    if (city === 'Centurion') return centurionComplexes[suburb] || ['Other'];
    if (city === 'Pretoria') return pretoriaComplexes[suburb] || ['Other'];
    if (city === 'Midrand') return midrandComplexes[suburb] || ['Other'];
    return ['Other'];
  }, [city, suburb]);


  function onSubmit(data: AddressFormValues) {
    setStoreAddressDetails(data);
    router.push("/item_to_repair");
  }

  const renderConditionalFields = () => {
    switch (propertyType) {
      case 'Home':
        return (
          <>
            <FormField control={control} name="houseNumber" render={({ field }) => ( <FormItem><FormLabel>House Number</FormLabel><FormControl><Input {...field} id="houseNumber" name="houseNumber" autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} id="streetName" name="streetName" autoComplete="street-address" /></FormControl><FormMessage /></FormItem>)} />
          </>
        );
      case 'Complex':
      case 'Complex in an Estate':
         return (
          <>
            <FormField control={control} name="unitNumber" render={({ field }) => ( <FormItem><FormLabel>Unit / House Number</FormLabel><FormControl><Input {...field} id="unitNumber" name="unitNumber" autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            {propertyType === 'Complex in an Estate' && (
              <FormField control={control} name="estateName" render={({ field }) => ( <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input {...field} id="estateName" name="estateName" /></FormControl><FormMessage /></FormItem>)} />
            )}
             <FormField
                control={control}
                name="complexName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Complex Name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name="complexName">
                        <FormControl><SelectTrigger id="complexName" name="complexName"><SelectValue placeholder="Select a complex" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {complexOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            {complexName === 'Other' && (
                <FormField control={control} name="otherComplexName" render={({ field }) => ( <FormItem><FormLabel>Please Specify Complex Name</FormLabel><FormControl><Input {...field} placeholder="e.g., The Willows" id="otherComplexName" name="otherComplexName" /></FormControl><FormMessage /></FormItem>)} />
            )}
            {propertyType === 'Complex' && <FormField control={control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} id="streetName" name="streetName" autoComplete="street-address" /></FormControl><FormMessage /></FormItem>)} />}
            {propertyType === 'Complex in an Estate' && <FormField control={control} name="streetNameInEstate" render={({ field }) => ( <FormItem><FormLabel>Street Name in Estate</FormLabel><FormControl><Input {...field} id="streetNameInEstate" name="streetNameInEstate" /></FormControl><FormMessage /></FormItem>)} />}
             <FormField
                control={form.control}
                name="accessCodeRequired"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Is an access code required?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4" name="accessCodeRequired">
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="yes" id="accessCodeYes" /></FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="no" id="accessCodeNo" /></FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
          </>
        );
      case 'Estate':
         return (
          <>
            <FormField control={control} name="standNumber" render={({ field }) => ( <FormItem><FormLabel>Stand Number</FormLabel><FormControl><Input {...field} id="standNumber" name="standNumber" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="houseNumber" render={({ field }) => ( <FormItem><FormLabel>House Number</FormLabel><FormControl><Input {...field} id="houseNumber" name="houseNumber" autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetNameInEstate" render={({ field }) => ( <FormItem><FormLabel>Street Name in Estate</FormLabel><FormControl><Input {...field} id="streetNameInEstate" name="streetNameInEstate" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="estateName" render={({ field }) => ( <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input {...field} id="estateName" name="estateName" /></FormControl><FormMessage /></FormItem>)} />
             <FormField
                control={form.control}
                name="accessCodeRequired"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Is an access code required?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4" name="accessCodeRequired">
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="yes" id="accessCodeYes" /></FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="no" id="accessCodeNo" /></FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
          </>
        );
      case 'Office':
        return (
          <>
            <FormField control={control} name="officeName" render={({ field }) => ( <FormItem><FormLabel>Office / Building Name</FormLabel><FormControl><Input {...field} id="officeName" name="officeName" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="officeParkName" render={({ field }) => ( <FormItem><FormLabel>Office Park Name (Optional)</FormLabel><FormControl><Input {...field} id="officeParkName" name="officeParkName" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetNumber" render={({ field }) => ( <FormItem><FormLabel>Street Number (Optional)</FormLabel><FormControl><Input {...field} id="streetNumber" name="streetNumber" autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} id="streetName" name="streetName" autoComplete="street-address" /></FormControl><FormMessage /></FormItem>)} />
             <FormField
                control={form.control}
                name="accessCodeRequired"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Is an access code required?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4" name="accessCodeRequired">
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="yes" id="accessCodeYes" /></FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="no" id="accessCodeNo" /></FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
          </>
        );
      case 'Small Holding':
        return (
            <>
                <FormField control={control} name="holdingName" render={({ field }) => ( <FormItem><FormLabel>Holding Name / Number</FormLabel><FormControl><Input {...field} id="holdingName" name="holdingName" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street / Road Name</FormLabel><FormControl><Input {...field} id="streetName" name="streetName" autoComplete="street-address" /></FormControl><FormMessage /></FormItem>)} />
            </>
        );
      case 'Farm':
        return (
            <>
                <FormField control={control} name="farmName" render={({ field }) => ( <FormItem><FormLabel>Farm Name / Number</FormLabel><FormControl><Input {...field} id="farmName" name="farmName" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Road Name</FormLabel><FormControl><Input {...field} id="streetName" name="streetName" autoComplete="street-address" /></FormControl><FormMessage /></FormItem>)} />
            </>
        );
      case 'Other':
        return (
            <>
                <FormField control={control} name="otherPropertyType" render={({ field }) => ( <FormItem><FormLabel>Please Specify Property Type</FormLabel><FormControl><Input {...field} placeholder="e.g., Warehouse, School" id="otherPropertyType" name="otherPropertyType" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetNumber" render={({ field }) => ( <FormItem><FormLabel>Street Number (Optional)</FormLabel><FormControl><Input {...field} id="streetNumber" name="streetNumber" autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} id="streetName" name="streetName" autoComplete="street-address" /></FormControl><FormMessage /></FormItem>)} />
            </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <Progress value={40} className="mb-8" />
      <h2 className="text-2xl font-bold mb-4 text-center">Address Details</h2>
      <p className="text-center text-muted-foreground mb-8">
        Where will we be doing the repair?
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={control} name="propertyType" render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} name="propertyType">
                  <FormControl><SelectTrigger id="propertyType" name="propertyType"><SelectValue placeholder="Select property type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {propertyTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {propertyType && (
            <>
              <FormField control={control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>City / Area</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name="city">
                      <FormControl><SelectTrigger id="city" name="city"><SelectValue placeholder="Select a city or area" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {city === 'Other' && (
                <FormField control={control} name="otherCityDescription" render={({ field }) => ( <FormItem><FormLabel>Please Specify City / Area</FormLabel><FormControl><Input {...field} placeholder="e.g., Johannesburg South" id="otherCityDescription" name="otherCityDescription" autoComplete="address-level2" /></FormControl><FormMessage /></FormItem>)} />
              )}
              
              {city && city !== 'Other' && (
                <>
                    <FormField control={control} name="suburb" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Suburb</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} name="suburb">
                                <FormControl><SelectTrigger id="suburb" name="suburb"><SelectValue placeholder="Select a suburb" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {suburbOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {suburb === 'Other' && (
                         <FormField control={control} name="otherSuburb" render={({ field }) => ( <FormItem><FormLabel>Please Specify Suburb</FormLabel><FormControl><Input {...field} placeholder="e.g., Rivonia" id="otherSuburb" name="otherSuburb" autoComplete="address-level1" /></FormControl><FormMessage /></FormItem>)} />
                    )}
                </>
              )}
              
              {renderConditionalFields()}
            </>
          )}
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit" disabled={!form.formState.isValid}>Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

  