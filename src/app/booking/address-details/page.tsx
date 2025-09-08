'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/use-booking-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { addressDetailsSchema } from '@/lib/schemas';
import type { AddressDetails } from '@/lib/types';
import BookingFlowLayout from '@/components/booking-flow-layout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { propertyTypes, propertyFunctions, cities, centurionSuburbs, pretoriaSuburbs, midrandSuburbs, centurionComplexes, midrandComplexes, pretoriaComplexes } from '@/lib/types';


type AddressFormData = z.infer<typeof addressDetailsSchema>;

const AddressDetailsPage = () => {
  const router = useRouter();
  const { addressDetails, setAddressDetails, setFormattedAddress } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: addressDetails || {
        propertyType: 'Home',
        propertyFunction: 'Private',
        city: 'Pretoria',
    },
    mode: 'onChange',
  });

  const propertyType = form.watch('propertyType');
  const city = form.watch('city');
  const suburb = form.watch('suburb');
  const complexName = form.watch('complexName');
  
  const getSuburbList = () => {
    switch (city) {
        case 'Centurion': return centurionSuburbs;
        case 'Pretoria': return pretoriaSuburbs;
        case 'Midrand': return midrandSuburbs;
        default: return [];
    }
  }

  const getComplexList = () => {
    if (!suburb) return [];
    if (city === 'Centurion') return (centurionComplexes as Record<string, string[]>)[suburb] || [];
    if (city === 'Midrand') return (midrandComplexes as Record<string, string[]>)[suburb] || [];
    if (city === 'Pretoria') return (pretoriaComplexes as Record<string, string[]>)[suburb] || [];
    return [];
  }

  const handleSubmit = (data: AddressFormData) => {
    setIsSubmitting(true);
    setAddressDetails(data as AddressDetails);

    // Manual formatting based on the submitted data
    let formattedAddress = '';
    const cityDisplay = data.city === 'Other' ? data.otherCityDescription : data.city;
    const suburbDisplay = data.suburb === 'Other' ? data.otherSuburbDescription : data.suburb;

    switch (data.propertyType) {
        case 'Home':
            formattedAddress = `${data.houseNumber} ${data.streetName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
        case 'Complex':
            const complex = data.complexName === 'Other' ? data.otherComplexName : data.complexName;
            formattedAddress = `Unit ${data.unitNumber}, ${complex}, ${data.streetNumber || ''} ${data.streetName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
        case 'Estate':
            formattedAddress = `Stand ${data.standNumber}, ${data.houseNumber} ${data.streetNameInEstate}, ${data.estateName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
        case 'Complex in an Estate':
            const complexInEstate = data.complexName === 'Other' ? data.otherComplexName : data.complexName;
            formattedAddress = `Unit ${data.unitNumber}, ${complexInEstate}, ${data.streetNameInEstate}, ${data.estateName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
        case 'Office':
            formattedAddress = `${data.officeName}, ${data.officeParkName ? data.officeParkName + ', ' : ''}${data.streetNumber || ''} ${data.streetName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
        case 'Small Holding':
            formattedAddress = `${data.holdingName}, ${data.streetName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
        case 'Farm':
            formattedAddress = `${data.farmName}, ${data.streetName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
        case 'Other':
            formattedAddress = `${data.otherPropertyType}, ${data.streetNumber || ''} ${data.streetName}, ${suburbDisplay}, ${cityDisplay}`;
            break;
    }

    setFormattedAddress(formattedAddress.trim().replace(/ ,/g, ',').replace(/, ,/g, ','));
    router.push('/item_to_repair');
  };

  return (
    <BookingFlowLayout>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Address Details</CardTitle>
          <CardDescription>Please provide the address for the service.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Property Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a function" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {propertyFunctions.map(func => <SelectItem key={func} value={func}>{func}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {city === 'Other' && (
                    <FormField control={form.control} name="otherCityDescription" render={({ field }) => ( <FormItem><FormLabel>Please Specify City/Area</FormLabel><FormControl><Input {...field} placeholder="e.g., Johannesburg" /></FormControl><FormMessage /></FormItem>)} />
                )}

                 <FormField
                    control={form.control}
                    name="suburb"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Suburb</FormLabel>
                            {getSuburbList().length > 0 ? (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a suburb" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {getSuburbList().map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                         <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <FormControl><Input {...field} placeholder="Enter suburb" /></FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {suburb === 'Other' && (
                     <FormField control={form.control} name="otherSuburbDescription" render={({ field }) => ( <FormItem><FormLabel>Please Specify Suburb</FormLabel><FormControl><Input {...field} placeholder="e.g., Sunninghill" /></FormControl><FormMessage /></FormItem>)} />
                )}

                {/* Dynamically render fields based on propertyType */}
                {propertyType === 'Home' && (<>
                    <FormField control={form.control} name="houseNumber" render={({ field }) => ( <FormItem><FormLabel>House Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 123" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Oak Avenue" /></FormControl><FormMessage /></FormItem>)} />
                </>)}
                
                {(propertyType === 'Complex' || propertyType === 'Complex in an Estate') && (<>
                    <FormField control={form.control} name="unitNumber" render={({ field }) => ( <FormItem><FormLabel>Unit/House Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 42" /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="complexName" render={({ field }) => (
                         <FormItem>
                             <FormLabel>Complex Name</FormLabel>
                             {getComplexList().length > 0 ? (
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                     <FormControl><SelectTrigger><SelectValue placeholder="Select complex" /></SelectTrigger></FormControl>
                                     <SelectContent>
                                         {getComplexList().map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                         <SelectItem value="Other">Other (Not Listed)</SelectItem>
                                     </SelectContent>
                                 </Select>
                             ) : (
                                 <FormControl><Input {...field} placeholder="Enter complex name" /></FormControl>
                             )}
                             <FormMessage />
                         </FormItem>
                     )} />
                    {complexName === 'Other' && (
                        <FormField control={form.control} name="otherComplexName" render={({ field }) => ( <FormItem><FormLabel>Please Specify Complex Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    )}
                </>)}

                {propertyType === 'Complex' && (<>
                    <FormField control={form.control} name="streetNumber" render={({ field }) => ( <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 10" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Main Street" /></FormControl><FormMessage /></FormItem>)} />
                </>)}

                {(propertyType === 'Estate' || propertyType === 'Complex in an Estate') && (<>
                    <FormField control={form.control} name="estateName" render={({ field }) => ( <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Silver Lakes" /></FormControl><FormMessage /></FormItem>)} />
                </>)}
                
                {propertyType === 'Estate' && (<>
                    <FormField control={form.control} name="standNumber" render={({ field }) => ( <FormItem><FormLabel>Stand Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 55" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="houseNumber" render={({ field }) => ( <FormItem><FormLabel>House Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 21" /></FormControl><FormMessage /></FormItem>)} />
                </>)}
                
                {(propertyType === 'Estate' || propertyType === 'Complex in an Estate') && (
                    <FormField control={form.control} name="streetNameInEstate" render={({ field }) => ( <FormItem><FormLabel>Street Name (in Estate)</FormLabel><FormControl><Input {...field} placeholder="e.g., Savannah Drive" /></FormControl><FormMessage /></FormItem>)} />
                )}

                {propertyType === 'Office' && (<>
                    <FormField control={form.control} name="officeName" render={({ field }) => ( <FormItem><FormLabel>Office / Building Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="officeParkName" render={({ field }) => ( <FormItem><FormLabel>Office Park Name (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetNumber" render={({ field }) => ( <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </>)}
                
                {propertyType === 'Small Holding' && (<>
                    <FormField control={form.control} name="holdingName" render={({ field }) => ( <FormItem><FormLabel>Holding Name/Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street/Road Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </>)}
                
                {propertyType === 'Farm' && (<>
                    <FormField control={form.control} name="farmName" render={({ field }) => ( <FormItem><FormLabel>Farm Name/Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Road Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </>)}

                {propertyType === 'Other' && (<>
                    <FormField control={form.control} name="otherPropertyType" render={({ field }) => ( <FormItem><FormLabel>Please Specify Property Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetNumber" render={({ field }) => ( <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </>)}

                 {(propertyType === 'Complex' || propertyType === 'Estate' || propertyType === 'Complex in an Estate' || propertyType === 'Office') && (
                     <FormField
                        control={form.control}
                        name="accessCodeRequired"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Is an access code required for entry?</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="yes" /></FormControl>
                                            <FormLabel className="font-normal">Yes</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="no" /></FormControl>
                                            <FormLabel className="font-normal">No</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 )}
            </CardContent>
            <CardFooter className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-base">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next Step"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BookingFlowLayout>
  );
};

export default AddressDetailsPage;
