
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { itemToRepairSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useState } from "react";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import { shallow } from "zustand/shallow";
import type { RepairItem as GlobalRepairItem } from "@/lib/types";

const baseElectronicsItems = [
    { id: 'TV', label: 'TV' },
    { id: 'GAME_CONSOLE', label: 'GAME CONSOLE' },
    { id: 'DRONE', label: 'DRONE' },
    { id: 'REMOTE', label: 'REMOTE' },
] as const;


interface AssessItem {
  id: string;
  label: string;
}

type ItemToAssessFormData = z.infer<typeof itemToRepairSchema>;

export default function ElectronicsItemToAssessPage() {
  const router = useRouter();
  const store = useBookingStore(
    (state) => state,
    shallow
  );

  const { 
    itemsToRepair: itemsToAssess, 
    problemDescriptions: damageDescriptions, 
    setItemsToRepair: setItemsToAssess, 
    setProblemDescriptions: setDamageDescriptions,
  } = store;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customItem, setCustomItem] = useState('');
  const [assessmentItemsList, setAssessmentItemsList] = useState<AssessItem[]>([...baseElectronicsItems]);

  const form = useForm<ItemToAssessFormData>({
    resolver: zodResolver(itemToRepairSchema),
    defaultValues: {
      items: itemsToAssess,
      descriptions: damageDescriptions,
    },
    mode: 'onChange',
  });

  const handleAddCustomItem = () => {
    if (customItem.trim() === '') return;
    const newItemId = customItem.trim().toUpperCase();
    if (!assessmentItemsList.some(item => item.id === newItemId)) {
        setAssessmentItemsList([...assessmentItemsList, { id: newItemId, label: newItemId }]);
    }
    setCustomItem('');
  };

  const selectedItems = form.watch("items", []);
  
  async function onSubmit(data: ItemToAssessFormData) {
    setIsSubmitting(true);
    const finalItems = data.items;
    const finalDescriptions: Record<string, string> = {};
    
    finalItems.forEach(item => {
        finalDescriptions[item] = data.descriptions?.[item] || '';
    });

    setItemsToAssess(finalItems as GlobalRepairItem[]);
    setDamageDescriptions(finalDescriptions);
    
    router.push("/booking/select-type");
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Item to be Assessed</CardTitle>
          <CardDescription>Select the electronic item(s) for the damage report and describe the damage.</CardDescription>
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
                        {assessmentItemsList.map((item) => (
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
                
                <div className="flex gap-2 items-center pt-4">
                    <Input 
                        type="text"
                        placeholder="Add another item..."
                        value={customItem}
                        onChange={(e) => setCustomItem(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomItem();
                            }
                        }}
                    />
                    <Button type="button" onClick={handleAddCustomItem} size="icon">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Item</span>
                    </Button>
                </div>


                {selectedItems.length > 0 && <hr className="my-4"/>}

                {selectedItems.map((selectedItem) => {
                    const item = assessmentItemsList.find(i => i.id === selectedItem);
                    if (!item) return null;

                    const itemLabel = item.label || "Item";
                    return (
                        <FormField
                            key={`desc-${item.id}`}
                            control={form.control}
                            name={`descriptions.${item.id}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Damage Description for {itemLabel}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`Please describe the damage to the ${itemLabel.toLowerCase()}.`}
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
