
"use server";

import "dotenv/config";
import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";

export async function getAvailableSlots(details: any): Promise<AvailabilitySlot[]> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL_AVAILABLE_TIME_SLOTS;
  if (!webhookUrl) {
    // Return a mock response for development if the URL is not set.
    console.warn("Availability webhook URL is not configured. Returning mock data.");
    const now = new Date();
    return [
      { slotStart: new Date(now.setDate(now.getDate() + 1)).toISOString() },
      { slotStart: new Date(now.setHours(now.getHours() + 2)).toISOString() },
      { slotStart: new Date(now.setDate(now.getDate() + 1)).toISOString() },
    ];
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details), // Send the details as a flat JSON object
    });

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        // Attempt to parse the JSON error response from the webhook
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        // If the response is not JSON, use the raw text
        errorDetails = `Error in workflow`; // Standardize the error
      }
      throw new Error(errorDetails);
    }

    const responseText = await response.text();
    if (responseText) {
      return JSON.parse(responseText);
    }
    return []; // Return empty array if response is empty
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] getAvailableSlots:", error);
    // Re-throw the more detailed error message
    throw new Error(`Failed to fetch availability slots: ${error.message}`);
  }
}

export async function confirmBooking(details: any): Promise<WebhookConfirmation> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL_BOOKING_CONFIRMATION;
   if (!webhookUrl) {
    // Return a mock response for development if the URL is not set.
    console.warn("Booking confirmation webhook URL is not configured. Returning mock data.");
    return {
      status: 'Confirmed',
      message: 'Booking confirmed successfully (Mock Response).',
      dateTime: details.slotStart,
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details), // Send the details as a flat JSON object
    });

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetails = `Error in workflow`; // Standardize the error
      }
      throw new Error(errorDetails);
    }

    const responseText = await response.text();
    if (responseText) {
      // If the response is a simple string, wrap it in the expected object structure.
      try {
        const parsed = JSON.parse(responseText);
        // If it's already an object, just ensure it has a status
        return { status: 'Confirmed', ...parsed };
      } catch (e) {
        return { status: 'Confirmed', message: responseText };
      }
    }
    // Return a default success object if response is empty, including original dateTime
    return { 
      status: 'Confirmed', 
      message: 'Booking confirmed successfully.',
      dateTime: details.slotStart,
    };
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    // Re-throw the more detailed error message
    throw new Error(`Failed to confirm booking: ${error.message}`);
  }
}
