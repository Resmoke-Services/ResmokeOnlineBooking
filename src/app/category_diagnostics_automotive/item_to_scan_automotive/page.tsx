
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
import type { RepairItem as GlobalRepairItem } from "@/lib/types";

const baseDiagnosticItems = [
    { id: 'AUTOMOTIVE_DIAGNOSTIC', label: 'Automotive Diagnostic Scan', note: 'Specify make, model, and year of vehicle' },
] as const;

interface ScanItem {
  id: string;
  label: string;
  note?: string;
}

type ItemToScanFormData = z.infer<typeof itemToRepairSchema>;

export default function AutomotiveItemToScanPage() {
  const router = useRouter();
  const store = useBookingStore(
    (state) => state,
    shallow
  );

  const { 
    itemsToRepair, 
    problemDescriptions, 
    setItemsToRepair, 
    setProblemDescriptions,
  } = store;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanItemsList] = useState<ScanItem[]>([...baseDiagnosticItems]);

  const form = useForm<ItemToScanFormData>({
    resolver: zodResolver(itemToRepairSchema),
    defaultValues: {
      items: itemsToRepair.length > 0 ? itemsToRepair : ['AUTOMOTIVE_DIAGNOSTIC'],
      descriptions: problemDescriptions,
    },
    mode: 'onChange',
  });

  const selectedItems = form.watch("items", []);
  
  async function onSubmit(data: ItemToScanFormData) {
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
          <CardTitle className="text-2xl">Vehicle Details</CardTitle>
          <CardDescription>Select the item for diagnostic scan and provide vehicle details.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem className="space-y-3">
                        {scanItemsList.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="items"
                            render={({ field }) => {
                              return (
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
                                          : field.onChange([])
                                      }}
                                      id={`item-${item.id}`}
                                      name="items"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal cursor-pointer">
                                        {item.label}
                                      </FormLabel>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedItems.map((selectedItem) => {
                    const item = scanItemsList.find(i => i.id === selectedItem);
                    if (!item) return null;

                    return (
                        <FormField
                            key={`desc-${item.id}`}
                            control={form.control}
                            name={`descriptions.${item.id}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{item.note}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`e.g., Toyota Hilux 2.8 GD-6 4x4 (2021)`}
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
