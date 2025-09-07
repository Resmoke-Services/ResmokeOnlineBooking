
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
import { propertyTypes, propertyFunctions, cities, centurionSuburbs, pretoriaSuburbs, midrandSuburbs, centurionComplexes, midrandComplexes, pretoriaComplexes } from "@/lib/types";
import type { PropertyType, City, PropertyFunction } from "@/lib/types";
import { addressDetailsSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState } from "react";
import { Loader2, ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type AddressDetailsFormData = z.infer<typeof addressDetailsSchema>;

const initialFormState: AddressDetailsFormData = {
    propertyType: "Home",
    propertyFunction: "Private",
    city: "Centurion",
    suburb: '',
    otherCityDescription: '',
    houseNumber: '',
    streetName: '',
    unitNumber: '',
    complexName: '',
    otherComplexName: '',
    streetNumber: '',
    standNumber: '',
    streetNameInEstate: '',
    estateName: '',
    officeName: '',
    officeParkName: '',
    holdingName: '',
    farmName: '',
    otherPropertyType: '',
    accessCodeRequired: 'no',
};


export default function AddressDetailsPage() {
  const router = useRouter();
  const { user, setAddressDetails: setStoreAddressDetails, addressDetails } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // For guest users, reset the address details to ensure no stale data is used.
    if (user?.isGuest) {
      setStoreAddressDetails({} as any); // Reset to empty object
    }
  }, [user, setStoreAddressDetails]);

  const form = useForm<AddressDetailsFormData>({
    resolver: zodResolver(addressDetailsSchema),
    defaultValues: (user?.isGuest ? initialFormState : addressDetails) ?? initialFormState,
    mode: "onChange",
  });
  
  const propertyType = form.watch("propertyType");
  const city = form.watch("city");
  const suburb = form.watch("suburb");
  const complexName = form.watch("complexName");

  useEffect(() => {
    if (!user) {
      router.replace('/auth?next=/booking/address-details');
    }
  }, [user, router]);


  async function onSubmit(data: AddressDetailsFormData) {
    setIsSubmitting(true);
    const processedData = {
        ...data,
        accessCodeRequired: data.accessCodeRequired,
    };
    setStoreAddressDetails(processedData as any);
    router.push("/item_to_repair");
  }

  const renderFormFields = (type: PropertyType) => {
    const accessCodeRadioGroup = (
        <FormField
          control={form.control}
          name="accessCodeRequired"
          render={({ field }) => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel>Access Code Required? <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row space-x-4"
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
    
    const isCenturionSuburbWithComplexes = city === 'Centurion' && suburb && (centurionComplexes as Record<string, string[]>)[suburb];
    const isMidrandSuburbWithComplexes = city === 'Midrand' && suburb && (midrandComplexes as Record<string, string[]>)[suburb];
    const isPretoriaSuburbWithComplexes = city === 'Pretoria' && suburb && (pretoriaComplexes as Record<string, string[]>)[suburb];
    
    const complexList = isCenturionSuburbWithComplexes 
        ? (centurionComplexes as Record<string, string[]>)[suburb] 
        : (isMidrandSuburbWithComplexes 
            ? (midrandComplexes as Record<string, string[]>)[suburb] 
            : (isPretoriaSuburbWithComplexes
                ? (pretoriaComplexes as Record<string, string[]>)[suburb]
                : []));

    const complexNameField = (
        <FormField
            control={form.control}
            name="complexName"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Complex Name <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select complex" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          <ScrollArea className="h-72">
                            {complexList.map((complex) => (
                                <SelectItem key={complex} value={complex}>{complex}</SelectItem>
                            ))}
                            <SelectItem value="Other">Other (Please specify)</SelectItem>
                          </ScrollArea>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    
    const otherComplexNameField = (
      <FormField
        control={form.control}
        name="otherComplexName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Please Specify Complex Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter complex name" {...field} value={field.value ?? ''} />
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
                        <FormItem><FormLabel>House Number <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., 123" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            );
        case 'Complex':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="unitNumber" render={({ field }) => (
                        <FormItem><FormLabel>Unit / House Number <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Unit 45" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {complexNameField}
                    {complexName === 'Other' && otherComplexNameField}
                     <FormField control={form.control} name="streetNumber" render={({ field }) => (
                        <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Estate':
             return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField control={form.control} name="standNumber" render={({ field }) => (
                        <FormItem><FormLabel>Stand Number <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., 556" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="houseNumber" render={({ field }) => (
                        <FormItem><FormLabel>House Number <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., 42" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetNameInEstate" render={({ field }) => (
                        <FormItem><FormLabel>Street Name (in estate) <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Protea Avenue" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="estateName" render={({ field }) => (
                        <FormItem><FormLabel>Estate Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Blue Valley Estate" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Complex in an Estate':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="unitNumber" render={({ field }) => (
                        <FormItem><FormLabel>Unit / House Number <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., 7" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {complexNameField}
                    {complexName === 'Other' && otherComplexNameField}
                    <FormField control={form.control} name="streetNameInEstate" render={({ field }) => (
                        <FormItem><FormLabel>Street Name (in estate) <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Protea Avenue" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="estateName" render={({ field }) => (
                        <FormItem><FormLabel>Estate Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Blue Valley Estate" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Office':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="officeName" render={({ field }) => (
                        <FormItem><FormLabel>Office / Building Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Riverwalk Office" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="officeParkName" render={({ field }) => (
                        <FormItem><FormLabel>Office Park Name (Optional)</FormLabel><FormControl><Input placeholder="e.g., Centurion Office Park" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetNumber" render={({ field }) => (
                        <FormItem><FormLabel>Street Number</FormLabel><FormControl><Input placeholder="e.g., 123" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Main Street" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    {accessCodeRadioGroup}
                </div>
            );
        case 'Small Holding':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="holdingName" render={({ field }) => (
                        <FormItem><FormLabel>Holding Name / Number <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Plot 123" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street / Road Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., R55" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            );
        case 'Farm':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="farmName" render={({ field }) => (
                        <FormItem><FormLabel>Farm Name / Number <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Sunnydale Farm" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Road Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., R511" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            );
        case 'Other':
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="otherPropertyType" render={({ field }) => (
                        <FormItem><FormLabel>Specify Property Type <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Warehouse, School" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="streetNumber" render={({ field }) => (
                        <FormItem><FormLabel>Street / Unit Number</FormLabel><FormControl><Input placeholder="e.g., 42B" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="streetName" render={({ field }) => (
                        <FormItem><FormLabel>Street Name <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., Industrial Road" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
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
          <CardDescription>Enter the address where the service will take place. Fields marked with <span className="text-destructive">*</span> are required.</CardDescription>
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
                            <FormLabel>Property Type <span className="text-destructive">*</span></FormLabel>
                            <Select
                              onValueChange={(value) => {
                                const newType = value as PropertyType;
                                form.setValue('propertyType', newType, { shouldValidate: true });
                                form.resetField('propertyFunction');
                                form.resetField('city');
                                form.resetField('suburb');
                                const fieldsToReset: Array<keyof AddressDetailsFormData> = ['houseNumber', 'streetName', 'unitNumber', 'complexName', 'otherComplexName', 'streetNumber', 'standNumber', 'streetNameInEstate', 'estateName', 'officeName', 'officeParkName', 'holdingName', 'farmName', 'otherPropertyType', 'accessCodeRequired', 'otherCityDescription'];
                                fieldsToReset.forEach(fieldName => form.resetField(fieldName));
                              }}
                              value={field.value}
                            >
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
                            <FormLabel>Property Function <span className="text-destructive">*</span></FormLabel>
                            <Select
                              onValueChange={(value) => {
                                 const newFunc = value as PropertyFunction;
                                 form.setValue('propertyFunction', newFunc, { shouldValidate: true });
                              }}
                              value={field.value}
                              disabled={!propertyType}
                            >
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
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>City / Area <span className="text-destructive">*</span></FormLabel>
                                <Select
                                onValueChange={(value) => {
                                    const newCity = value as City;
                                    form.setValue('city', newCity, { shouldValidate: true });
                                    form.resetField('suburb');
                                    const fieldsToReset: Array<keyof AddressDetailsFormData> = ['houseNumber', 'streetName', 'unitNumber', 'complexName', 'otherComplexName', 'streetNumber', 'standNumber', 'streetNameInEstate', 'estateName', 'officeName', 'officeParkName', 'holdingName', 'farmName', 'otherPropertyType', 'accessCodeRequired', 'otherCityDescription'];
                                    fieldsToReset.forEach(fieldName => form.resetField(fieldName));
                                }}
                                value={field.value}
                                disabled={!form.watch('propertyFunction')}
                                >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select city / area" />
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
                    {city && (
                        <>
                            {city === 'Other' ? (
                                <FormField
                                    control={form.control}
                                    name="otherCityDescription"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Please Specify City <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Johannesburg" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            ) : city === 'Centurion' ? (
                                <FormField
                                    control={form.control}
                                    name="suburb"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Suburb <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select suburb" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent position="popper">
                                                    <ScrollArea className="h-72">
                                                        {centurionSuburbs.map((sub) => (
                                                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                                        ))}
                                                    </ScrollArea>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : city === 'Pretoria' ? (
                                <FormField
                                    control={form.control}
                                    name="suburb"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Suburb <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select suburb" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                 <SelectContent position="popper">
                                                    <ScrollArea className="h-72">
                                                        {pretoriaSuburbs.map((sub) => (
                                                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                                        ))}
                                                    </ScrollArea>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : city === 'Midrand' ? (
                                <FormField
                                    control={form.control}
                                    name="suburb"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Suburb <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select suburb" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent position="popper">
                                                     <ScrollArea className="h-72">
                                                        {midrandSuburbs.map((sub) => (
                                                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                                        ))}
                                                    </ScrollArea>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="suburb"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Suburb <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Sandton" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            )}
                        </>
                    )}
                </div>

                {(suburb || (city === 'Other' && form.watch('otherCityDescription'))) && (
                    <div className="space-y-6 pt-4 border-t border-dashed animate-in fade-in-50 duration-500">
                        {renderFormFields(propertyType as PropertyType)}
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

    