
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { itemToRepairSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { shallow } from "zustand/shallow";
import { getAvailableSlots } from "@/app/actions/booking-actions";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { RepairItem as GlobalRepairItem } from "@/lib/types";

const baseEmsRepairItems = [
    { id: 'EMS_LASER_MACHINE', label: 'EMS LASER MACHINE', note: 'Specify model in description' },
] as const;

interface RepairItem {
  id: string;
  label: string;
  note?: string;
}

type ItemToRepairFormData = z.infer<typeof itemToRepairSchema>;

export default function EmsItemToRepairPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useBookingStore(
    (state) => state,
    shallow
  );

  const { 
    itemsToRepair, 
    problemDescriptions, 
    setItemsToRepair, 
    setProblemDescriptions,
    setAvailability,
  } = store;

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ItemToRepairFormData>({
    resolver: zodResolver(itemToRepairSchema),
    defaultValues: {
      items: itemsToRepair.length > 0 ? itemsToRepair : ['EMS_LASER_MACHINE'],
      descriptions: problemDescriptions,
    },
    mode: 'onChange',
  });

  const selectedItems = form.watch("items", []);
  
  async function onSubmit(data: ItemToRepairFormData) {
    setIsSubmitting(true);
    const finalItems = data.items;
    const finalDescriptions: Record<string, string> = {};
    
    finalItems.forEach(item => {
        finalDescriptions[item] = data.descriptions?.[item] || '';
    });

    setItemsToRepair(finalItems as GlobalRepairItem[]);
    setProblemDescriptions(finalDescriptions);
    
    try {
        const bookingDataForAction = {
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
          itemsToRepair: finalItems,
          problemDescriptions: finalDescriptions,
          selectedDateTime: store.selectedDateTime,
          servicePath: store.servicePath,
          serviceType: store.serviceType,
          paymentMethods: store.paymentMethods,
          billingInformation: store.billingInformation,
          termsAgreement: store.termsAgreement,
          date: format(new Date(), "yyyy-MM-dd"),
        };

        const slots = await getAvailableSlots(bookingDataForAction);
      
      setAvailability(slots);
      router.push("/select_datetime");

    } catch (error: any) {
        console.error("Failed to fetch availability slots:", error);
        toast({
          variant: "destructive",
          title: "Failed to load times",
          description: error.message || "Could not fetch available time slots.",
        });
        setAvailability([]);
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Item to be Repaired</CardTitle>
          <CardDescription>Confirm the item and describe the problem.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem className="space-y-3">
                      {baseEmsRepairItems.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="items"
                          render={({ field }) => (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([item.id])
                                      : field.onChange([]);
                                  }}
                                  id={`item-${item.id}`}
                                  name="items"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
                                  </FormLabel>
                                  {item.note && (
                                    <p className="text-xs text-muted-foreground">
                                      *{item.note}
                                    </p>
                                  )}
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedItems.map((selectedItem) => {
                    const item = baseEmsRepairItems.find(i => i.id === selectedItem);
                    if (!item) return null;

                    return (
                        <FormField
                            key={`desc-${item.id}`}
                            control={form.control}
                            name={`descriptions.${item.id}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem with {item.label}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`Please describe the model and issue with the ${item.label.toLowerCase()}.`}
                                            {...field}
                                            value={field.value || ''}
                                            id={`description-${item.id}`}
                                            name={`descriptions.${item.id}`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                })}
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

    