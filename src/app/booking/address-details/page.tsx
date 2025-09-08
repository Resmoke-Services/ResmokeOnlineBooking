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
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/hooks/use-booking-store";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

// Define the schema with all possible fields
const formSchema = z.object({
  propertyType: z.string().min(1, "Property type is required"),
  propertyFunction: z.string().min(1, "Property function is required"),
  suburb: z.string().min(1, "Suburb is required"),
  city: z.string().min(1, "City is required"),
  otherCityDescription: z.string().optional(),
  otherSuburbDescription: z.string().optional(),
  houseNumber: z.string().optional(),
  streetName: z.string().optional(),
  unitNumber: z.string().optional(),
  complexName: z.string().optional(),
  otherComplexName: z.string().optional(),
  streetNumber: z.string().optional(),
  buildingName: z.string().optional(),
  floorNumber: z.string().optional(),
  roomNumber: z.string().optional(),
  estateName: z.string().optional(),
  accessCode: z.string().optional(),
  holdingName: z.string().optional(),
  farmName: z.string().optional(),
  areaName: z.string().optional(),
  otherPropertyType: z.string().optional(),
  accessCodeRequired: z.enum(["yes", "no"]).optional(),
});

type AddressFormValues = z.infer<typeof formSchema>;

export default function AddressDetailsPage() {
  const router = useRouter();
  const { addressDetails, setAddressDetails } = useBookingStore();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: addressDetails || {
        propertyType: "",
        propertyFunction: "",
        suburb: "",
        city: "",
        accessCodeRequired: "no",
    },
  });

  const propertyType = form.watch("propertyType");
  const city = form.watch("city");
  const suburb = form.watch("suburb");
  const complexName = form.watch("complexName");

  function onSubmit(data: AddressFormValues) {
    setAddressDetails(data);
    router.push("/item_to_repair");
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <Progress value={40} className="mb-8" />
      <h2 className="text-2xl font-bold mb-4 text-center">Address Details</h2>
      <p className="text-center text-gray-600 mb-8">
        Where will we be doing the repair?
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Complex">Complex</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Estate">Estate</SelectItem>
                    <SelectItem value="Holding">Holding/Farm</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pretoria">Pretoria</SelectItem>
                    <SelectItem value="Centurion">Centurion</SelectItem>
                    <SelectItem value="Midrand">Midrand</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

           {city === 'Other' && (
             <FormField control={form.control} name="otherCityDescription" render={({ field }) => ( <FormItem><FormLabel>Please Specify City</FormLabel><FormControl><Input {...field} placeholder="e.g., Johannesburg" /></FormControl><FormMessage /></FormItem>)} />
           )}

          <FormField
            control={form.control}
            name="suburb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suburb</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a suburb" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {/* Populate suburbs based on city */}
                        <SelectItem value="SuburbA">Suburb A</SelectItem>
                        <SelectItem value="SuburbB">Suburb B</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {suburb === 'Other' && (
               <FormField control={form.control} name="otherSuburbDescription" render={({ field }) => ( <FormItem><FormLabel>Please Specify Suburb</FormLabel><FormControl><Input {...field} placeholder="e.g., Sunninghill" /></FormControl><FormMessage /></FormItem>)} />
          )}

          {/* Dynamically render fields based on propertyType */}
          {propertyType === 'Home' && (
             <>
                <FormField control={form.control} name="houseNumber" render={({ field }) => ( <FormItem><FormLabel>House Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="streetName" render={({ field }) => ( <FormItem><FormLabel>Street Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
             </>
          )}

          {propertyType === 'Complex' && (
             <>
                <FormField control={form.control} name="unitNumber" render={({ field }) => ( <FormItem><FormLabel>Unit Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="complexName" render={({ field }) => ( <FormItem><FormLabel>Complex Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
             </>
          )}
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
