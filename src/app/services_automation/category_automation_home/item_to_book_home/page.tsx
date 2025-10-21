
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

const baseAutomationItems = [
    { id: 'CONSULTATION', label: 'Consultation', note: 'Discuss your smart home needs and possibilities.' },
    { id: 'INSTALLATION', label: 'Installation & Setup', note: 'Installation of smart devices like lights, plugs, gate/garage motors.' },
    { id: 'SUPPORT', label: 'Support & Troubleshooting', note: 'Get help with your existing smart home setup.' },
] as const;

interface AutomationItem {
  id: string;
  label: string;
  note?: string;
}

type ItemToBookFormData = z.infer<typeof itemToRepairSchema>;

export default function HomeAutomationItemToBookPage() {
  const router = useRouter();
  const store = useBookingStore(
    (state) => state,
    shallow
  );

  const { 
    itemsToRepair: itemsToBook, 
    problemDescriptions: projectDescriptions, 
    setItemsToRepair: setItemsToBook, 
    setProblemDescriptions: setProjectDescriptions,
  } = store;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [automationItemsList] = useState<AutomationItem[]>([...baseAutomationItems]);

  const form = useForm<ItemToBookFormData>({
    resolver: zodResolver(itemToRepairSchema),
    defaultValues: {
      items: itemsToBook,
      descriptions: projectDescriptions,
    },
    mode: 'onChange',
  });

  const selectedItems = form.watch("items", []);
  
  async function onSubmit(data: ItemToBookFormData) {
    setIsSubmitting(true);
    const finalItems = data.items;
    const finalDescriptions: Record<string, string> = {};
    
    finalItems.forEach(item => {
        finalDescriptions[item] = data.descriptions?.[item] || '';
    });

    setItemsToBook(finalItems as GlobalRepairItem[]);
    setProjectDescriptions(finalDescriptions);
    
    router.push("/booking/select-type");
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Automation Service</CardTitle>
          <CardDescription>Select the service(s) you require and briefly describe your project.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {automationItemsList.map((item) => (
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
                                        const currentItems = field.value || [];
                                        return checked
                                          ? field.onChange([...currentItems, item.id])
                                          : field.onChange(
                                              currentItems.filter(
                                                (value) => value !== item.id
                                              )
                                            )
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
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedItems.length > 0 && <hr className="my-4"/>}

                {selectedItems.map((selectedItem) => {
                    const item = automationItemsList.find(i => i.id === selectedItem);
                    if (!item) return null;

                    return (
                        <FormField
                            key={`desc-${item.id}`}
                            control={form.control}
                            name={`descriptions.${item.id}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Details for {item.label}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`Please describe what you need for ${item.label.toLowerCase()}.`}
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
