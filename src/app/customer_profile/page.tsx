
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingFlowLayout from "@/components/booking-flow-layout";
import { Loader2 } from "lucide-react";

export default function ContactPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new booking flow start page
    router.replace('/booking/select-type');
  }, [router]);

  return (
    <BookingFlowLayout>
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Redirecting to our new booking flow...</p>
      </div>
    </BookingFlowLayout>
  );
}
