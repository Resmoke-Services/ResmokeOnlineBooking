
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
import { personalBookingSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type PersonalBookingFormData = z.infer<typeof personalBookingSchema>;

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const store = useBookingStore();
  
  const form = useForm<PersonalBookingFormData>({
    resolver: zodResolver(personalBookingSchema),
    defaultValues: {
      name: store.name || "",
      surname: store.surname || "",
      cellNumber: store.cellNumber || "",
      email: store.email || "",
    },
    mode: "onChange",
  });
  
  const { name, surname, cellNumber, email } = store;

  useEffect(() => {
    form.reset({
      name: name || "",
      surname: surname || "",
      cellNumber: cellNumber || "",
      email: email || "",
    });
  }, [name, surname, cellNumber, email, form]);

  const handlePhoneNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    if (value.startsWith('0') && value.length === 10) {
        value = `+27${value.substring(1)}`;
        form.setValue('cellNumber', value, { shouldValidate: true });
    }
  };

  async function onSubmit(data: PersonalBookingFormData) {
    setIsSubmitting(true);
    
    store.setPersonalDetails({
        name: data.name,
        surname: data.surname,
        cellNumber: data.cellNumber,
        email: data.email,
    });
    
    router.push("/booking/address-details");
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Your Contact Details</CardTitle>
          <CardDescription>Please provide your details for the booking.</CardDescription>
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
                        <Input placeholder="Enter your name" {...field} id="name" name="name" autoComplete="given-name" />
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
                        <Input placeholder="Enter your surname" {...field} id="surname" name="surname" autoComplete="family-name" />
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
                    <FormLabel>Cellphone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="e.g., +27821234567"
                        {...field}
                        onBlur={handlePhoneNumberBlur}
                        id="cellNumber"
                        name="cellNumber"
                        autoComplete="tel"
                      />
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
                      <Input type="email" placeholder="your.email@example.com" {...field} id="email" name="email" autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
