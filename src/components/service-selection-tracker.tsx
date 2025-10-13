
"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/hooks/use-booking-store";
import { shallow } from 'zustand/shallow';

interface ServiceSelectionTrackerProps {
  selections: string[];
}

export default function ServiceSelectionTracker({ selections }: ServiceSelectionTrackerProps) {
  const { servicePath, setServicePath } = useBookingStore(
    (state) => ({ servicePath: state.servicePath, setServicePath: state.setServicePath }),
    shallow
  );

  useEffect(() => {
    // Convert arrays to strings to easily compare them.
    // This prevents re-renders if the array instance is new but the content is the same.
    if (JSON.stringify(servicePath) !== JSON.stringify(selections)) {
      setServicePath(selections);
    }
  }, [selections, servicePath, setServicePath]);

  return null;
}
