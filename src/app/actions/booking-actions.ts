
"use server";

import "dotenv/config";
import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";

const AVAILABILITY_WEBHOOK_URL = "https://primary-production-5528.up.railway.app/webhook/available_time_slots";
const CONFIRMATION_WEBHOOK_URL = "https://primary-production-5528.up.railway.app/webhook/booking_confirmation";


// Helper function to convert a JSON object to a URL-encoded string
const toUrlEncoded = (obj: Record<string, any>): string => {
  return Object.keys(obj)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(typeof obj[k] === 'object' ? JSON.stringify(obj[k]) : obj[k]))
    .join('&');
};


export async function getAvailableSlots(details: any): Promise<AvailabilitySlot[]> {
  try {
    const response = await fetch(AVAILABILITY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: toUrlEncoded(details),
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
    // Re-throw the more detailed error message
    throw new Error(`Failed to fetch availability slots: ${error.message}`);
  }
}

export async function confirmBooking(details: any): Promise<WebhookConfirmation> {
  try {
    const response = await fetch(CONFIRMATION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: toUrlEncoded(details),
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
