
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import { friendBookingSchema } from "@/lib/schemas";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type FriendBookingFormData = z.infer<typeof friendBookingSchema>;

export default function FriendDetailsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const store = useBookingStore();

  const form = useForm<FriendBookingFormData>({
    resolver: zodResolver(friendBookingSchema),
    defaultValues: {
      ownerName: store.ownerName || "",
      ownerSurname: store.ownerSurname || "",
      ownerCellNumber: store.ownerCellNumber || "",
      ownerEmail: store.ownerEmail || "",
      userName: store.name || "",
      userSurname: store.surname || "",
      userCellNumber: store.cellNumber || "",
      userEmail: store.email || "",
    },
    mode: "onChange",
  });

  const handlePhoneNumberBlur = (fieldName: keyof FriendBookingFormData) => (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    if (value.startsWith('0') && value.length === 10) {
        value = `+27${value.substring(1)}`;
        form.setValue(fieldName, value, { shouldValidate: true });
    }
  };

  async function onSubmit(data: FriendBookingFormData) {
    setIsSubmitting(true);
    
    store.setOwnerDetails({
        ownerName: data.ownerName,
        ownerSurname: data.ownerSurname,
        ownerCellNumber: data.ownerCellNumber,
        ownerEmail: data.ownerEmail,
    });
    store.setPersonalDetails({
        name: data.userName,
        surname: data.userSurname,
        cellNumber: data.userCellNumber,
        email: data.userEmail,
    });
    
    router.push("/booking/address-details");
  }

  return (
    <BookingFlowLayout>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Friend/Family Booking</CardTitle>
          <CardDescription>Please provide details for the equipment owner and for yourself.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <fieldset className="space-y-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-lg font-medium">Friend/Family's Details</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter their name" {...field} id="ownerName" name="ownerName" autoComplete="name" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="ownerSurname"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter their surname" {...field} id="ownerSurname" name="ownerSurname" autoComplete="family-name" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="ownerCellNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cellphone Number</FormLabel>
                        <FormControl>
                        <Input
                            type="tel"
                            placeholder="e.g., +27821234567"
                            {...field}
                            onBlur={handlePhoneNumberBlur('ownerCellNumber')}
                            id="ownerCellNumber"
                            name="ownerCellNumber"
                            autoComplete="tel"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ownerEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="friend.email@example.com" {...field} id="ownerEmail" name="ownerEmail" autoComplete="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </fieldset>

              <fieldset className="space-y-4 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-lg font-medium">Your Details</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your name" {...field} id="userName" name="userName" autoComplete="given-name" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="userSurname"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your surname" {...field} id="userSurname" name="userSurname" autoComplete="family-name" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="userCellNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cellphone Number</FormLabel>
                        <FormControl>
                        <Input
                            type="tel"
                            placeholder="e.g., +27821234567"
                            {...field}
                            onBlur={handlePhoneNumberBlur('userCellNumber')}
                            id="userCellNumber"
                            name="userCellNumber"
                            autoComplete="tel"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="userEmail"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} id="userEmail" name="userEmail" autoComplete="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </fieldset>
            </CardContent>
            <CardFooter className="flex justify-end">
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
