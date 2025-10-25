
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
  useFormField,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getAvailableSlots } from "@/app/actions/booking-actions";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type AddressFormValues = z.infer<typeof addressDetailsSchema>;

export default function AddressDetailsPage() {
  const router = useRouter();
  const store = useBookingStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const streetNameRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: {
      propertyType: store.addressDetails?.propertyType || undefined,
      propertyFunction: store.addressDetails?.propertyFunction || 'Private',
      city: store.addressDetails?.city || undefined,
      suburb: store.addressDetails?.suburb || '',
      houseNumber: store.addressDetails?.houseNumber || '',
      streetName: store.addressDetails?.streetName || '',
      unitNumber: store.addressDetails?.unitNumber || '',
      complexName: store.addressDetails?.complexName || '',
      otherComplexName: store.addressDetails?.otherComplexName || '',
      streetNumber: store.addressDetails?.streetNumber || '',
      streetNameInEstate: store.addressDetails?.streetNameInEstate || '',
      estateName: store.addressDetails?.estateName || '',
      accessCodeRequired: store.addressDetails?.accessCodeRequired || 'no',
      standNumber: store.addressDetails?.standNumber || '',
      officeName: store.addressDetails?.officeName || '',
      officeParkName: store.addressDetails?.officeParkName || '',
      holdingName: store.addressDetails?.holdingName || '',
      farmName: store.addressDetails?.farmName || '',
      otherPropertyType: store.addressDetails?.otherPropertyType || '',
      otherCityDescription: store.addressDetails?.otherCityDescription || '',
      otherSuburb: store.addressDetails?.otherSuburb || '',
    },
    mode: 'onChange',
  });

  const { watch, control, setValue } = form;
  const propertyType = watch("propertyType");
  const city = watch("city");
  const suburb = watch("suburb");
  const complexName = watch("complexName");

  const suburbOptions = useMemo(() => {
    let suburbs: readonly string[] | string[] = [];
    switch (city) {
      case 'Centurion': suburbs = centurionSuburbs; break;
      case 'Pretoria': suburbs = pretoriaSuburbs; break;
      case 'Midrand': suburbs = midrandSuburbs; break;
      default: return [];
    }
    return [...suburbs, 'Other'];
  }, [city]);

  const complexOptions = useMemo(() => {
    if (!city || !suburb) return ['Other'];
    let complexes: string[] = [];
    if (city === 'Centurion' && suburb && centurionComplexes[suburb]) complexes = centurionComplexes[suburb];
    if (city === 'Pretoria' && suburb && pretoriaComplexes[suburb]) complexes = pretoriaComplexes[suburb];
    if (city === 'Midrand' && suburb && midrandComplexes[suburb]) complexes = midrandComplexes[suburb];
    return [...complexes, 'Other'];
  }, [city, suburb]);

  useEffect(() => {
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined' || !streetNameRef.current) {
        return;
    }

    if (autocompleteRef.current) {
        return; // Already initialized
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(streetNameRef.current, {
        componentRestrictions: { country: "za" },
        fields: ["address_components", "formatted_address"],
        types: ["address"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
            setValue("streetName", place.formatted_address, { shouldValidate: true });
        }
    });

  }, [setValue]);

  async function onSubmit(data: AddressFormValues) {
    setIsSubmitting(true);
    store.setAddressDetails(data);
    
    // Construct the payload using the most up-to-date store data
    const currentStoreState = useBookingStore.getState();

    try {
        const bookingDataForAction = {
          name: currentStoreState.name,
          surname: currentStoreState.surname,
          cellNumber: currentStoreState.cellNumber,
          email: currentStoreState.email,
          addressDetails: currentStoreState.addressDetails,
          formattedAddress: currentStoreState.formattedAddress,
          bookingFor: currentStoreState.bookingFor,
          landlordName: currentStoreState.landlordName,
          landlordSurname: currentStoreState.landlordSurname,
          landlordCellNumber: currentStoreState.landlordCellNumber,
          landlordEmail: currentStoreState.landlordEmail,
          ownerName: currentStoreState.ownerName,
          ownerSurname: currentStoreState.ownerSurname,
          ownerCellNumber: currentStoreState.ownerCellNumber,
          ownerEmail: currentStoreState.ownerEmail,
          companyName: currentStoreState.companyName,
          companyPhone: currentStoreState.companyPhone,
          companyEmail: currentStoreState.companyEmail,
          itemsToRepair: currentStoreState.itemsToRepair,
          problemDescriptions: currentStoreState.problemDescriptions,
          selectedDateTime: currentStoreState.selectedDateTime,
          servicePath: currentStoreState.servicePath,
          serviceType: currentStoreState.serviceType,
          paymentMethods: currentStoreState.paymentMethods,
          billingInformation: currentStoreState.billingInformation,
          termsAgreement: currentStoreState.termsAgreement,
          date: format(new Date(), "yyyy-MM-dd"), // Fetch for today initially
        };

        const slots = await getAvailableSlots(bookingDataForAction);
        
        store.setAvailability(slots);
        router.push("/select_datetime");

    } catch (error: any) {
        console.error("Failed to fetch availability slots:", error);
        toast({
          variant: "destructive",
          title: "Failed to load times",
          description: error.message || "Could not fetch available time slots.",
        });
        store.setAvailability([]); // Clear any old data
        setIsSubmitting(false);
    }
  }
  
  const renderConditionalFields = () => {
    switch (propertyType) {
      case 'Home':
        return (
          <>
            <FormField control={control} name="houseNumber" render={({ field }) => ( <FormItem><FormLabel>House Number</FormLabel><FormControl><Input {...field} autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetName" render={({ field }) => {
                const { ref, ...rest } = field;
                return (
                    <FormItem>
                        <FormLabel>Street Name</FormLabel>
                        <FormControl>
                            <Input {...rest} autoComplete="street-address" ref={(el) => { ref(el); (streetNameRef as React.MutableRefObject<HTMLInputElement | null>).current = el; }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )
            }} />
          </>
        );
      case 'Complex':
      case 'Complex in an Estate':
         return (
          <>
            <FormField control={control} name="unitNumber" render={({ field }) => ( <FormItem><FormLabel>Unit / House Number</FormLabel><FormControl><Input {...field} autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            {propertyType === 'Complex in an Estate' && (
              <FormField control={control} name="estateName" render={({ field }) => ( <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            )}
             <FormField
                control={control}
                name="complexName"
                render={({ field }) => {
                    const { formItemId } = useFormField();
                    return (
                        <FormItem>
                            <FormLabel>Complex Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger id={formItemId} name={field.name}>
                                        <SelectValue placeholder="Select a complex" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {complexOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
            {complexName === 'Other' && (
                <FormField control={control} name="otherComplexName" render={({ field }) => ( <FormItem><FormLabel>Please Specify Complex Name</FormLabel><FormControl><Input {...field} placeholder="e.g., The Willows" /></FormControl><FormMessage /></FormItem>)} />
            )}
            {propertyType === 'Complex' && <FormField control={control} name="streetName" render={({ field }) => {
                const { ref, ...rest } = field;
                return (
                    <FormItem>
                        <FormLabel>Street Name</FormLabel>
                        <FormControl>
                            <Input {...rest} autoComplete="street-address" ref={(el) => { ref(el); (streetNameRef as React.MutableRefObject<HTMLInputElement | null>).current = el; }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )
            }} />}
            {propertyType === 'Complex in an Estate' && <FormField control={control} name="streetNameInEstate" render={({ field }) => ( <FormItem><FormLabel>Street Name in Estate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
             <FormField
                control={form.control}
                name="accessCodeRequired"
                render={({ field }) => {
                    const { formItemId } = useFormField();
                    return (
                        <FormItem className="space-y-3">
                            <FormLabel>Is an access code required?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4" id={formItemId} name={field.name}>
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
                    );
                }}
            />
          </>
        );
      case 'House in an Estate':
         return (
          <>
            <FormField control={control} name="standNumber" render={({ field }) => ( <FormItem><FormLabel>Stand Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="houseNumber" render={({ field }) => ( <FormItem><FormLabel>House Number</FormLabel><FormControl><Input {...field} autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetNameInEstate" render={({ field }) => ( <FormItem><FormLabel>Street Name in Estate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="estateName" render={({ field }) => ( <FormItem><FormLabel>Estate Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
             <FormField
                control={form.control}
                name="accessCodeRequired"
                render={({ field }) => {
                    const { formItemId } = useFormField();
                    return (
                        <FormItem className="space-y-3">
                            <FormLabel>Is an access code required?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4" id={formItemId} name={field.name}>
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
                    );
                }}
            />
          </>
        );
      case 'Office':
        return (
          <>
            <FormField control={control} name="officeName" render={({ field }) => ( <FormItem><FormLabel>Office / Building Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="officeParkName" render={({ field }) => ( <FormItem><FormLabel>Office Park Name (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetNumber" render={({ field }) => ( <FormItem><FormLabel>Street Number (Optional)</FormLabel><FormControl><Input {...field} autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name="streetName" render={({ field }) => {
                const { ref, ...rest } = field;
                return (
                    <FormItem>
                        <FormLabel>Street Name</FormLabel>
                        <FormControl>
                            <Input {...rest} autoComplete="street-address" ref={(el) => { ref(el); (streetNameRef as React.MutableRefObject<HTMLInputElement | null>).current = el; }} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )
            }} />
             <FormField
                control={form.control}
                name="accessCodeRequired"
                render={({ field }) => {
                    const { formItemId } = useFormField();
                    return (
                        <FormItem className="space-y-3">
                            <FormLabel>Is an access code required?</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4" id={formItemId} name={field.name}>
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
                    );
                }}
            />
          </>
        );
      case 'Small Holding':
        return (
            <>
                <FormField control={control} name="holdingName" render={({ field }) => ( <FormItem><FormLabel>Holding Name / Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetName" render={({ field }) => {
                    const { ref, ...rest } = field;
                    return (
                        <FormItem>
                            <FormLabel>Street / Road Name</FormLabel>
                            <FormControl>
                                <Input {...rest} autoComplete="street-address" ref={(el) => { ref(el); (streetNameRef as React.MutableRefObject<HTMLInputElement | null>).current = el; }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />
            </>
        );
      case 'Farm':
        return (
            <>
                <FormField control={control} name="farmName" render={({ field }) => ( <FormItem><FormLabel>Farm Name / Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetName" render={({ field }) => {
                    const { ref, ...rest } = field;
                    return (
                        <FormItem>
                            <FormLabel>Road Name</FormLabel>
                            <FormControl>
                                <Input {...rest} autoComplete="street-address" ref={(el) => { ref(el); (streetNameRef as React.MutableRefObject<HTMLInputElement | null>).current = el; }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />
            </>
        );
      case 'OTHER':
        return (
            <>
                <FormField control={control} name="otherPropertyType" render={({ field }) => ( <FormItem><FormLabel>Please Specify Property Type</FormLabel><FormControl><Input {...field} placeholder="e.g., Warehouse, School" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetNumber" render={({ field }) => ( <FormItem><FormLabel>Street Number (Optional)</FormLabel><FormControl><Input {...field} autoComplete="address-line2" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name="streetName" render={({ field }) => {
                    const { ref, ...rest } = field;
                    return (
                        <FormItem>
                            <FormLabel>Street Name</FormLabel>
                            <FormControl>
                                <Input {...rest} autoComplete="street-address" ref={(el) => { ref(el); (streetNameRef as React.MutableRefObject<HTMLInputElement | null>).current = el; }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />
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
          <FormField control={control} name="propertyType" render={({ field }) => {
              const { formItemId } = useFormField();
              return (
                  <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger id={formItemId} name={field.name}>
                                  <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              {propertyTypes.map((type) => (<SelectItem key={type} value={type}>{type === 'OTHER' ? 'Other' : type}</SelectItem>))}
                          </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
              );
            }}
          />

          {propertyType && (
            <>
              <FormField control={control} name="city" render={({ field }) => {
                  const { formItemId } = useFormField();
                  return (
                      <FormItem>
                          <FormLabel>City / Area</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                  <SelectTrigger id={formItemId} name={field.name}>
                                      <SelectValue placeholder="Select a city or area" />
                                  </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                  );
                }}
              />

              {city === 'Other' && (
                <FormField control={control} name="otherCityDescription" render={({ field }) => ( <FormItem><FormLabel>Please Specify City / Area</FormLabel><FormControl><Input {...field} placeholder="e.g., Johannesburg South" autoComplete="address-level2" /></FormControl><FormMessage /></FormItem>)} />
              )}
              
              {city && city !== 'Other' && (
                <FormField control={control} name="suburb" render={({ field }) => {
                    const { formItemId } = useFormField();
                    return (
                        <FormItem>
                            <FormLabel>Suburb</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger id={formItemId} name={field.name}>
                                        <SelectValue placeholder="Select a suburb" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {suburbOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    );
                }} />
              )}

              {suburb === 'Other' && (
                  <FormField control={control} name="otherSuburb" render={({ field }) => ( <FormItem><FormLabel>Please Specify Suburb</FormLabel><FormControl><Input {...field} placeholder="e.g., Rivonia" autoComplete="address-level3" /></FormControl><FormMessage /></FormItem>)} />
              )}
              
              {((city && city !== 'Other' && suburb && suburb !== 'Other') || (city === 'Other')) && renderConditionalFields()}

            </>
          )}
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
