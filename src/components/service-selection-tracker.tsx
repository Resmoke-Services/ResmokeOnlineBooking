
"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/hooks/use-booking-store";

interface ServiceSelectionTrackerProps {
  selections: string[];
}

export default function ServiceSelectionTracker({ selections }: ServiceSelectionTrackerProps) {
  const { setServicePath } = useBookingStore();

  useEffect(() => {
    setServicePath(selections);
  }, [selections, setServicePath]);

  return null;
}
