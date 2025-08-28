
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import type { AvailabilitySlot, PaymentMethod, TermsAgreement } from "@/lib/types";

const paymentMethods: { id: PaymentMethod; label: string }[] = [
  { id: "Card", label: "Card (Card Machine)" },
  { id: "Cash", label: "Cash" },
  { id: "EFT", label: "EFT" },
];

const paymentAndTermsSchema = z.object({
  paymentMethod: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one payment method.",
  }),
  terms: z.object({
    paymentOnPremises: z.boolean().refine((val) => val === true, {
      message: "You must agree to the payment terms.",
    }),
    emailConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to receive emails.",
    }),
    smsConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to receive text messages.",
    }),
  }),
});

type FormData = z.infer<typeof paymentAndTermsSchema>;

export default function PaymentAndTermsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const store = useBookingStore();

  const form = useForm<FormData>({
    resolver: zodResolver(paymentAndTermsSchema),
    defaultValues: {
      paymentMethod: store.paymentMethods,
      terms: {
        paymentOnPremises: store.termsAgreement?.paymentOnPremises || false,
        emailConsent: store.termsAgreement?.emailConsent || false,
        smsConsent: store.termsAgreement?.smsConsent || false,
      },
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!store.user) {
      router.replace('/user_profile');
    }
    if (store.itemsToRepair.length === 0) {
        router.replace('/item_to_repair');
    }
  }, [store.user, store.itemsToRepair, router]);

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    
    store.setPaymentMethods(data.paymentMethod as PaymentMethod[]);
    store.setTermsAgreement(data.terms as TermsAgreement);

    const bookingDetails = {
      name: store.name,
      surname: store.surname,
      cellNumber: store.cellNumber,
      email: store.email,
      address: store.address,
      city: store.city,
      otherCityDescription: store.otherCityDescription,
      suburb: store.suburb,
      otherSuburbDescription: store.otherSuburbDescription,
      propertyType: store.propertyType,
      accessCodeRequired: store.accessCodeRequired,
      itemsToRepair: store.itemsToRepair,
      problemDescriptions: store.problemDescriptions,
      paymentMethods: data.paymentMethod,
      termsAgreement: data.terms,
    };

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("Webhook URL is not configured. Please contact support.");
      }
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        let errorDetails = `Error: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorDetails = errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
          errorDetails = `${errorDetails}: ${response.statusText}`;
        }
        throw new Error(errorDetails);
      }
      
      const responseText = await response.text();
      let availabilityData: AvailabilitySlot[] = [];

      if (responseText) {
        try {
          availabilityData = JSON.parse(responseText);
        } catch (e) {
          throw new Error("Failed to parse availability data from server.");
        }
      } else {
        console.log("Received empty but successful response for availability. Assuming no slots.");
      }

      store.setAvailability(availabilityData);
      router.push("/select_datetime");

    } catch (error: any) {
      console.error("Failed to fetch availability:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (!store.user) {
    return <BookingFlowLayout><div className="flex justify-center items-center h-64"></div></BookingFlowLayout>
  }
  
  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Payment & Terms</CardTitle>
          <CardDescription>Please select your preferred payment method and agree to the terms.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Preferred Payment Option</FormLabel>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                      {paymentMethods.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(field.value?.filter((value) => value !== item.id));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel className="text-base">Terms and Conditions</FormLabel>
                <FormField
                    control={form.control}
                    name="terms.paymentOnPremises"
                    render={({field}) => (
                        <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                             <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>All expenses to be paid while on premises.</FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="terms.emailConsent"
                    render={({field}) => (
                        <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                             <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>I agree to receive email messages in relation to this booking.</FormLabel>
                                 <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="terms.smsConsent"
                    render={({field}) => (
                        <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                             <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>I agree to receive text messages in relation to this booking.</FormLabel>
                                <p className="text-xs text-muted-foreground">Message frequency may vary. Standard Message and Data Rates may apply. Reply STOP to opt out. Reply Help for help. Your mobile information will not be sold or shared with third parties for promotional or marketing purposes.</p>
                                 <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
              </div>

            </CardContent>
            <CardFooter className="flex justify-between">
               <Button type="button" variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Processing..." : "Next"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </BookingFlowLayout>
  );
}
