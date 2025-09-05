
"use server";

import "dotenv/config";
import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";

export async function getAvailableSlots(details: any): Promise<AvailabilitySlot[]> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL_AVAILABLE_TIME_SLOTS || "https://primary-production-5528.up.railway.app/webhook-test/bookings-resmoke";
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
      // Wrap the details in a 'body' object to match n8n's expected structure
      body: JSON.stringify({ body: details }),
    });

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetails = `${errorDetails}: ${response.statusText}`;
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
    throw new Error(`Failed to fetch availability slots: ${error.message}`);
  }
}

export async function confirmBooking(details: any): Promise<WebhookConfirmation> {
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL_BOOKING_CONFIRMATION || "https://primary-production-5528.up.railway.app/webhook-test/bookings-resmoke";
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
      // Wrap the details in a 'body' object to match n8n's expected structure
      body: JSON.stringify({ body: details }),
    });

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = await response.json();
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetails = `${errorDetails}: ${response.statusText}`;
      }
      throw new Error(errorDetails);
    }

    const responseText = await response.text();
    if (responseText) {
      return JSON.parse(responseText);
    }
    // Return a default success object if response is empty
    return { status: 'Confirmed', message: 'Booking confirmed successfully.' };
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    throw new Error(`Failed to confirm booking: ${error.message}`);
  }
}
