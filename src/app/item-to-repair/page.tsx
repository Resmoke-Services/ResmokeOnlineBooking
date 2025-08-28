
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { repairItems, type RepairItem } from "@/lib/types";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import type { AvailabilitySlot } from "@/lib/types";

const itemToRepairSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  otherDescription: z.string().optional(),
}).refine((data) => {
    if (data.items.includes("OTHER") && (!data.otherDescription || data.otherDescription.trim().length < 3)) {
        return false;
    }
    return true;
}, {
    message: "Please provide a description for the 'Other' item (min. 3 characters).",
    path: ["otherDescription"],
});


export default function ItemToRepairPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, name, surname, cellNumber, email, address, suburb, propertyType, accessCodeRequired, itemsToRepair, otherItemDescription, setAvailability, setItemsToRepair, setOtherItemDescription } = useBookingStore();

  const form = useForm<{items: string[], otherDescription?: string}>({
    resolver: zodResolver(itemToRepairSchema),
    defaultValues: {
      items: itemsToRepair,
      otherDescription: otherItemDescription,
    },
  });

  const selectedItems = form.watch("items");

  useEffect(() => {
    if (!user) {
      router.replace('/auth');
    }
  }, [user, router]);
  
  async function onSubmit(data: { items: string[], otherDescription?: string }) {
    setIsSubmitting(true);
    
    setItemsToRepair(data.items as RepairItem[]);
    setOtherItemDescription(data.otherDescription || "");

    const bookingDetails = {
        name, surname, cellNumber, email, address, suburb, propertyType, accessCodeRequired,
        itemsToRepair: data.items,
        otherItemDescription: data.items.includes("OTHER") ? data.otherDescription : "",
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
          // If parsing JSON fails, use the status text.
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

      setAvailability(availabilityData);
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

  if (!user) {
    return <BookingFlowLayout><div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div></BookingFlowLayout>
  }
  
  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Item to be Repaired</CardTitle>
          <CardDescription>Please select the item(s) you need repaired.</CardDescription>
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
                        {repairItems.map((item) => (
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
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
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
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedItems?.includes('OTHER') && (
                    <FormField
                        control={form.control}
                        name="otherDescription"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description for "Other"</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Please describe the item and the issue."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 text-base">
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
