
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { itemToRepairSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useState, useEffect } from "react";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import { shallow } from "zustand/shallow";
import { getAvailableSlots } from "@/app/actions/booking-actions";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type RepairItemOption = { id: string; label: string };
const defaultGhdRepairItems: RepairItemOption[] = [
    { id: 'HAIR_STRAIGHTENER', label: 'HAIR STRAIGHTENER' },
    { id: 'HAIR_DRYER', label: 'HAIR DRYER' },
];

type ItemToRepairFormData = z.infer<typeof itemToRepairSchema>;

export default function GhdItemToRepairPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    itemsToRepair, 
    problemDescriptions, 
    setItemsToRepair, 
    setProblemDescriptions,
    setAvailability,
    ...store
  } = useBookingStore(
    (state) => state,
    shallow
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [repairItemsList, setRepairItemsList] = useState<RepairItemOption[]>(defaultGhdRepairItems);
  
  useEffect(() => {
    // Avoid hydration errors by initializing client-side state after mount
    const existingCustomItems = itemsToRepair
        .filter(item => !defaultGhdRepairItems.some(defaultItem => defaultItem.id === item))
        .map(item => ({ id: item, label: item }));
    
    // Use a Set to prevent duplicates if user navigates back and forth
    const combined = [...defaultGhdRepairItems, ...existingCustomItems];
    const uniqueItems = Array.from(new Map(combined.map(item => [item.id, item])).values());

    setRepairItemsList(uniqueItems);
  }, [itemsToRepair]); // Rerun if itemsToRepair changes from store

  const form = useForm<ItemToRepairFormData>({
    resolver: zodResolver(itemToRepairSchema),
    defaultValues: {
      items: itemsToRepair,
      descriptions: problemDescriptions,
    },
    mode: 'onChange',
  });

  const selectedItems = form.watch("items", []);
  
  const handleAddItem = () => {
    const trimmedName = newItemName.trim().toUpperCase();
    if (trimmedName && !repairItemsList.some(item => item.id === trimmedName)) {
        setRepairItemsList(prevList => [...prevList, { id: trimmedName, label: trimmedName }]);
    }
    setNewItemName('');
  };

  async function onSubmit(data: ItemToRepairFormData) {
    setIsSubmitting(true);
    
    const finalItems = data.items;
    const finalDescriptions: Record<string, string> = {};
    
    finalItems.forEach(item => {
        finalDescriptions[item] = data.descriptions?.[item] || '';
    });

    setItemsToRepair(finalItems);
    setProblemDescriptions(finalDescriptions);
    
    try {
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
          itemsToRepair: finalItems,
          problemDescriptions: finalDescriptions,
          selectedDateTime: store.selectedDateTime,
          servicePath: store.servicePath,
          serviceType: store.serviceType,
          paymentMethods: store.paymentMethods,
          billingInformation: store.billingInformation,
          termsAgreement: store.termsAgreement,
          availability: store.availability,
          webhookConfirmation: store.webhookConfirmation,
        };

        const slots = await getAvailableSlots({ 
          ...bookingData,
          date: format(new Date(), "yyyy-MM-dd"), 
        });

        setAvailability(slots);
        router.push("/select_datetime");

    } catch (error: any) {
        console.error("Failed to fetch availability slots:", error);
        toast({
          variant: "destructive",
          title: "Failed to load times",
          description: error.message || "Could not fetch available time slots.",
        });
        setAvailability([]); // Clear any old data
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Item to be Repaired</CardTitle>
          <CardDescription>Select the item(s) you need repaired and describe the problem.</CardDescription>
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
                        {repairItemsList.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="items"
                            render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...(field.value || []), item.id]
                                          : field.value?.filter((value) => value !== item.id);
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center gap-2 pt-4">
                    <Input 
                        placeholder="Add another item..."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="uppercase"
                    />
                    <Button type="button" onClick={handleAddItem} disabled={!newItemName.trim()}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>


                {selectedItems.length > 0 && <hr className="my-4"/>}
                
                {repairItemsList.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    if (!isSelected) return null;

                    const itemLabel = item.label || "Item";
                    return (
                        <FormField
                            key={`desc-${item.id}`}
                            control={form.control}
                            name={`descriptions.${item.id}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem with {itemLabel}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`Please describe the issue with the ${itemLabel.toLowerCase()}.`}
                                            {...field}
                                            value={field.value || ''}
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
