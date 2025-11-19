
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
    { id: 'EMS LASER MACHINE', label: 'EMS LASER MACHINE', note: 'Specify model in description' },
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
      items: itemsToRepair,
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
    
    router.push("/booking/select-type");
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
