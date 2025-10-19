
"use server";

import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";
import { POST as postAvailableTimeSlots } from '@/app/api/webhooks/available_time_slots/route';
import { POST as postBookingConfirmation } from '@/app/api/webhooks/booking_confirmation/route';
import { adminDb } from "@/lib/firebase-admin";


export async function getAvailableSlots(details: any): Promise<AvailabilitySlot[]> {
  try {
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

export async function confirmBooking(details: any): Promise<WebhookConfirmation> {
  try {
    const request = new Request('http://localhost/api/webhooks/booking_confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });

    const response = await postBookingConfirmation(request);

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

    const dataToSave = {
      ...details,
      createdAt: new Date().toISOString(),
      webhookConfirmation: confirmationData,
    };

    // Save directly to Firestore using the adminDb instance
    const bookingRef = await adminDb.collection('bookings').add(dataToSave);

    return { status: 'Confirmed', bookingId: bookingRef.id, ...confirmationData };

  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    // Ensure the thrown error message is what the client expects.
    throw new Error(error.message || "An unexpected error occurred during booking confirmation.");
  }
}


export async function testWebhook(): Promise<any> {
  const url = "https://primary-production-5528.up.railway.app/webhook/available_time_slots_test";
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: "payload", date: "2024-08-01" }),
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
        return { success: true, data: responseText };
    }

  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] testWebhook:", error);
    return { success: false, error: error.message };
  }
}
