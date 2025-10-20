
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
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import { type PaymentMethod, type TermsAgreement, paymentMethods, type BillingInformation } from "@/lib/types";
import { paymentAndTermsSchema } from "@/lib/schemas";
import { confirmBooking } from "@/app/actions/booking-actions";

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
  
  const billingOptions = useMemo(() => {
    const options: { value: string, label: string }[] = [];
    switch (store.bookingFor) {
      case 'personal':
        options.push({ value: 'personal', label: `Bill Me (${store.name} ${store.surname})` });
        break;
      case 'landlord':
        options.push({ value: 'user', label: `Bill Me (${store.name} ${store.surname})` });
        options.push({ value: 'landlord', label: `Bill the Landlord (${store.landlordName} ${store.landlordSurname})` });
        break;
      case 'company':
        options.push({ value: 'user', label: `Bill Me (${store.name} ${store.surname})` });
        options.push({ value: 'company', label: `Bill the Company (${store.companyName})` });
        break;
      case 'friend':
        options.push({ value: 'user', label: `Bill Me (${store.name} ${store.surname})` });
        options.push({ value: 'owner', label: `Bill my Friend/Family (${store.ownerName} ${store.ownerSurname})` });
        break;
      default:
        options.push({ value: 'personal', label: 'Bill Personal Account' });
    }
    return options;
  }, [store.bookingFor, store.name, store.surname, store.landlordName, store.landlordSurname, store.companyName, store.ownerName, store.ownerSurname]);
  
  useEffect(() => {
    if (store.bookingFor === 'personal' && billingOptions.length > 0) {
      form.setValue('billingInformation', billingOptions[0]?.value ?? '', { shouldValidate: true });
    }
  }, [store.bookingFor, billingOptions, form]);

  async function onSubmit(data: PaymentAndTermsFormData) {
    setIsSubmitting(true);
    
    store.setPaymentMethods([data.paymentMethod]);
    store.setBillingInformation(data.billingInformation as BillingInformation);
    store.setTermsAgreement(data.terms as TermsAgreement);

    const bookingData = {
        name: store.name,
        surname: store.surname,
        cellNumber: store.cellNumber,
        email: store.email,
        addressDetails: store.addressDetails,
        formattedAddress: store.formattedAddress,
        bookingFor: store.bookingFor,
        landlordName: store.landlordName,
        landlordSurname: store.landlordSurname,
        landlordCellNumber: store.landlordCellNumber,
        landlordEmail: store.landlordEmail,
        ownerName: store.ownerName,
        ownerSurname: store.ownerSurname,
        ownerCellNumber: store.ownerCellNumber,
        ownerEmail: store.ownerEmail,
        companyName: store.companyName,
        companyPhone: store.companyPhone,
        companyEmail: store.companyEmail,
        itemsToRepair: store.itemsToRepair,
        problemDescriptions: store.problemDescriptions,
        selectedDateTime: store.selectedDateTime,
        servicePath: store.servicePath,
        serviceType: store.serviceType,
        paymentMethods: [data.paymentMethod],
        billingInformation: data.billingInformation,
        termsAgreement: data.terms,
    };


    try {
        const webhookData = {
            name: store.name,
            surname: store.surname,
            cellNumber: store.cellNumber,
            email: store.email,
        };

        console.log('Attempting to send this data to n8n:', webhookData);

        if (process.env.NEXT_PUBLIC_WEBHOOK_URL_BOOKING_CONFIRMATION) {
          fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL_BOOKING_CONFIRMATION, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(webhookData),
          }).catch(error => {
              console.error('Webhook fetch error:', error);
          });
        } else {
            console.warn('Webhook URL not configured. Skipping webhook call.');
        }

        const confirmation = await confirmBooking(bookingData);
        store.setWebhookConfirmation(confirmation);
        router.push("/confirmation");
    } catch (error: any) {
      console.error("Failed to confirm booking or send to webhook:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
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
                        name="paymentMethod"
                      >
                        {paymentMethods.map((method) => (
                           <FormItem key={method.id} className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
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
                        value={field.value ?? ""}
                        className="flex flex-wrap gap-x-8 gap-y-2"
                        disabled={store.bookingFor === 'personal'}
                        name="billingInformation"
                      >
                        {billingOptions.map(bo => (
                          <FormItem key={bo.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={bo.value} id={`billing-${bo.value}`} />
                            </FormControl>
                            <FormLabel className="font-normal">{bo.label}</FormLabel>
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
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms-payment" name="terms.paymentOnPremises" />
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
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms-consent" name="terms.emailConsent" />
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
