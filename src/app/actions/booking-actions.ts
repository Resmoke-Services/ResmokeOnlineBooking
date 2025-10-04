
"use server";

import "dotenv/config";
import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";
import { POST as postAvailableTimeSlots } from '@/app/api/webhooks/available_time_slots/route';
import { POST as postBookingConfirmation } from '@/app/api/webhooks/booking_confirmation/route';

export async function getAvailableSlots(details: any): Promise<AvailabilitySlot[]> {
  try {
    // Construct a new Request object to pass to the proxy route handler
    const request = new Request('http://localhost/api/webhooks/available_time_slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });
    
    const response = await postAvailableTimeSlots(request);

    if (!response.ok) {
      const responseText = await response.text();
      let errorDetails = `Error: ${response.status}`;
      try {
        // Attempt to parse error as JSON, otherwise use the raw text.
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetails = responseText || "An unknown error occurred in the webhook.";
      }
      throw new Error(errorDetails);
    }
    
    return await response.json();

  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] getAvailableSlots:", error);
    throw new Error(`Failed to fetch availability slots: ${error.message}`);
  }
}

// This internal helper function will now be responsible for the database write via the API route.
async function saveBookingToDb(details: any) {
  // IMPORTANT: This URL needs to be the absolute URL of your deployed application
  // for the server action to be able to call the API route.
  // Using a relative URL will fail in a server environment.
  // We'll construct it dynamically.
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000';
  const url = `${baseUrl}/api/bookings/add`;

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to save booking. Status: ${response.status}`);
      }

      return await response.json();
  } catch (error: any) {
      console.error('Error in saveBookingToDb:', error);
       // Re-throw a more specific error to be caught by the calling function
      throw new Error(`Failed to save booking: ${error.message}`);
  }
}

export async function confirmBooking(details: any): Promise<WebhookConfirmation> {
  try {
    const request = new Request('http://localhost/api/webhooks/booking_confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });

    // First, await the response from the external webhook proxy.
    const response = await postBookingConfirmation(request);

    // Check if the webhook call was successful before proceeding.
    if (!response.ok) {
      const responseText = await response.text();
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetails = responseText || "An unknown error occurred in the confirmation webhook.";
      }
      throw new Error(errorDetails);
    }
    
    const confirmationData = await response.json();

    // Only after the external webhook confirms successfully, save to the database
    // by calling our internal API route.
    await saveBookingToDb(details);

    return { status: 'Confirmed', ...confirmationData };

  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    // Re-throw the original error to be caught by the client-side form handler
    throw new Error(`${error.message}`);
  }
}


export async function testWebhook(): Promise<any> {
  const url = "https://primary-production-5528.up.railway.app/webhook-test/available_time_slots_test";
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: "payload", date: "2024-08-01" }), // Just a test payload
    });

    const responseText = await response.text();

    if (!response.ok) {
        console.error(`Webhook test failed with status ${response.status}:`, responseText);
        return { success: false, status: response.status, error: responseText };
    }

    try {
        const data = JSON.parse(responseText);
        return { success: true, data };
    } catch(e) {
        // If it's not JSON, return the text
        return { success: true, data: responseText };
    }

  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] testWebhook:", error);
    return { success: false, error: error.message };
  }
}
