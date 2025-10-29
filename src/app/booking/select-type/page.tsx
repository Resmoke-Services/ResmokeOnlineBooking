
"use client";

import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/hooks/use-booking-store";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { User, Building, Users2, Home } from "lucide-react";
import type { BookingFor } from "@/lib/types";

const bookingTypes = [
  {
    type: "PERSONAL",
    title: "My Own Equipment",
    description: "The booking is for equipment you personally own.",
    icon: User,
    href: "/booking/details/personal"
  },
  {
    type: "LANDLORD",
    title: "The Landlord's Equipment",
    description: "The booking is for equipment in a rental property.",
    icon: Home,
    href: "/booking/details/landlord"
  },
  {
    type: "COMPANY",
    title: "A Company's Equipment",
    description: "The booking is on behalf of a registered company.",
    icon: Building,
    href: "/booking/details/company"
  },
  {
    type: "FRIEND",
    title: "A Friend or Family's Equipment",
    description: "You are making this booking for someone else.",
    icon: Users2,
    href: "/booking/details/friend"
  }
] as const;


export default function SelectBookingTypePage() {
  const router = useRouter();
  const { setBookingFor } = useBookingStore();

  const handleSelectType = (type: BookingFor, href: string) => {
    setBookingFor(type);
    router.push(href);
  };

  return (
    <BookingFlowLayout>
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight">Who is this booking for?</h1>
            <p className="mt-2 text-lg text-muted-foreground">Select an option to continue</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookingTypes.map((type) => (
                <Card 
                    key={type.type}
                    onClick={() => handleSelectType(type.type, type.href)}
                    className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
                >
                    <CardHeader className="flex flex-row items-center gap-4">
                        <type.icon className="w-10 h-10 text-primary" />
                        <div className="flex-1">
                            <CardTitle>{type.title}</CardTitle>
                            <CardDescription className="mt-1">{type.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    </BookingFlowLayout>
  );
}
