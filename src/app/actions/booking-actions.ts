
"use server";

import "dotenv/config";
import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";

const AVAILABILITY_WEBHOOK_URL = "https://primary-production-5528.up.railway.app/webhook/available_time_slots";
const CONFIRMATION_WEBHOOK_URL = "https://primary-production-5528.up.railway.app/webhook/booking_confirmation";


export async function getAvailableSlots(details: any): Promise<AvailabilitySlot[]> {
  try {
    const response = await fetch(AVAILABILITY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Stringify the details and wrap them in a `payload` object.
      // This is a robust way to send complex data to webhooks.
      body: JSON.stringify({ payload: JSON.stringify(details) }),
    });

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetails = `Error in workflow`;
      }
      throw new Error(errorDetails);
    }

    const responseText = await response.text();
    if (responseText) {
      return JSON.parse(responseText);
    }
    return [];
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] getAvailableSlots:", error);
    throw new Error(`Failed to fetch availability slots: ${error.message}`);
  }
}

export async function confirmBooking(details: any): Promise<WebhookConfirmation> {
  try {
    const response = await fetch(CONFIRMATION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
       // Use the same robust payload format for consistency.
      body: JSON.stringify({ payload: JSON.stringify(details) }),
    });

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetails = `Error in workflow`;
      }
      throw new Error(errorDetails);
    }

    const responseText = await response.text();
    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        return { status: 'Confirmed', ...parsed };
      } catch (e) {
        return { status: 'Confirmed', message: responseText };
      }
    }
    return { 
      status: 'Confirmed', 
      message: 'Booking confirmed successfully.',
      dateTime: details.slotStart,
    };
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    throw new Error(`Failed to confirm booking: ${error.message}`);
  }
}
