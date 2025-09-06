
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import { type PaymentMethod, type TermsAgreement, paymentMethods, billingOptions } from "@/lib/types";
import { paymentAndTermsSchema } from "@/lib/schemas";
import { getAvailableSlots } from "@/app/actions/booking-actions";

type PaymentAndTermsFormData = z.infer<typeof paymentAndTermsSchema>;

export default function PaymentAndTermsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const store = useBookingStore();

  const form = useForm<PaymentAndTermsFormData>({
    resolver: zodResolver(paymentAndTermsSchema),
    defaultValues: {
      paymentMethod: store.paymentMethods.length > 0 ? store.paymentMethods[0] : undefined,
      billingInformation: store.billingInformation || undefined,
      terms: {
        paymentOnPremises: store.termsAgreement?.paymentOnPremises || false,
        emailConsent: store.termsAgreement?.emailConsent || false,
      },
    },
    mode: 'onChange',
  });
  
  useEffect(() => {
    // Clear previous selections when the page loads
    store.setPaymentMethods([]);
    store.setBillingInformation(null);
    store.setTermsAgreement(null);
    form.reset({
      paymentMethod: undefined,
      billingInformation: undefined,
      terms: {
        paymentOnPremises: false,
        emailConsent: false,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!store.user) {
      router.replace('/user_profile');
    }
    if (store.itemsToRepair.length === 0) {
        router.replace('/item_to_repair');
    }
  }, [store.user, store.itemsToRepair, router]);

  async function onSubmit(data: PaymentAndTermsFormData) {
    setIsSubmitting(true);
    
    store.setPaymentMethods([data.paymentMethod]);
    store.setBillingInformation(data.billingInformation);
    store.setTermsAgreement(data.terms as TermsAgreement);

    // Consolidate all data for the availability webhook
    const availabilityRequestDetails = {
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
      paymentMethods: [data.paymentMethod],
      billingInformation: data.billingInformation,
      termsAgreement: data.terms,
      servicePath: store.servicePath,
    };

    try {
        const availabilityData = await getAvailableSlots(availabilityRequestDetails);
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
          <CardDescription>Please select your preferred payment method, billing option, and agree to the terms.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Preferred Payment Option</FormLabel>
                     <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-x-8 gap-y-2"
                      >
                        {paymentMethods.map((method) => (
                           <FormItem key={method.id} className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value={method.id} />
                             </FormControl>
                             <FormLabel className="font-normal">
                               {method.label}
                             </FormLabel>
                           </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingInformation"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">Billing Information</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-x-8 gap-y-2"
                      >
                        {billingOptions.map(bo => (
                          <FormItem key={bo} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={bo} />
                            </FormControl>
                            <FormLabel className="font-normal">{bo}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
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
                                <FormLabel>I agree to receive Text and Email messages in relation to this booking.</FormLabel>
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
