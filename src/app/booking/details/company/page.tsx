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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { companyBookingSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "@/hooks/use-firebase";

type CompanyBookingFormData = z.infer<typeof companyBookingSchema>;

export default function CompanyDetailsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const store = useBookingStore();
  const firebase = useFirebase();

  useEffect(() => {
    if (!store.user) {
      router.replace('/auth');
    }
  }, [store.user, router]);
  
  const form = useForm<CompanyBookingFormData>({
    resolver: zodResolver(companyBookingSchema),
    defaultValues: {
      companyName: store.companyName || "",
      companyPhone: store.companyPhone || "",
      companyEmail: store.companyEmail || "",
      contactName: store.name || "",
      contactSurname: store.surname || "",
      contactCellNumber: store.cellNumber || "",
      contactEmail: store.email || "",
    },
    mode: "onChange",
  });

  const handlePhoneNumberBlur = (fieldName: keyof CompanyBookingFormData) => (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    if (value.startsWith('0') && value.length >= 10) { // Check for landline or cell
        value = `+27${value.substring(1)}`;
        form.setValue(fieldName, value, { shouldValidate: true });
    }
  };

  async function onSubmit(data: CompanyBookingFormData) {
    setIsSubmitting(true);
    
    store.setCompanyDetails({
        companyName: data.companyName,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
    });
    store.setPersonalDetails({
        name: data.contactName,
        surname: data.contactSurname,
        cellNumber: data.contactCellNumber,
        email: data.contactEmail,
    });
    
    if (store.user && !store.user.isGuest && firebase) {
      try {
        const userRef = doc(firebase.firestore, 'users', store.user.uid);
        await setDoc(userRef, {
          name: data.contactName,
          surname: data.contactSurname,
          cellNumber: data.contactCellNumber,
          email: data.contactEmail,
          displayName: `${data.contactName} ${data.contactSurname}`.trim(),
        }, { merge: true });
      } catch (error) {
        console.error("Failed to save contact person details to Firestore:", error);
      }
    }
    
    router.push("/booking/address-details");
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Company Booking Details</CardTitle>
          <CardDescription>Please provide details for the company and the primary contact person.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <fieldset className="space-y-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-lg font-medium">Company Details</legend>
                 <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., +27123456789" {...field} onBlur={handlePhoneNumberBlur('companyPhone')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., accounts@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>

              <fieldset className="space-y-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-lg font-medium">Contact Person Details</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter contact's name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="contactSurname"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter contact's surname" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="contactCellNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cellphone Number</FormLabel>
                        <FormControl>
                        <Input
                            type="tel"
                            placeholder="e.g., +27821234567"
                            {...field}
                            onBlur={handlePhoneNumberBlur('contactCellNumber')}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </fieldset>
            </CardContent>
            <CardFooter className="flex justify-end">
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
