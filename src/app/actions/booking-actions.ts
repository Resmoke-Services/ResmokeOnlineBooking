
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
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        // Try to get more specific error details from the webhook response
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        // Fallback if the response is not JSON or doesn't have a message
        errorDetails = `Error in workflow`;
      }
      throw new Error(errorDetails);
    }

    const responseText = await response.text();
    // Handle cases where the webhook might return an empty body on success
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
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
        // If the response is valid JSON, parse it
        const parsed = JSON.parse(responseText);
        return { status: 'Confirmed', ...parsed };
      } catch (e) {
        // If it's just a string, use it as a message
        return { status: 'Confirmed', message: responseText };
      }
    }
    // Default success response if the webhook returns an empty body
    return { 
      status: 'Confirmed', 
      message: 'Booking confirmed successfully.',
      dateTime: details.slotStart, // Use the selected time as a fallback
    };
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    throw new Error(`Failed to confirm booking: ${error.message}`);
  }
}
