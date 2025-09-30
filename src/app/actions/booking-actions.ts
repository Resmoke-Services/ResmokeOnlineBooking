
"use server";

import "dotenv/config";
import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";

const AVAILABILITY_WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL_AVAILABLE_TIME_SLOTS || "https://primary-production-5528.up.railway.app/webhook-test/available_time_slots";
const CONFIRMATION_WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL_BOOKING_CONFIRMATION || "https://primary-production-5528.up.railway.app/webhook-test/booking_confirmation";

// This function will now also be responsible for persisting the booking data to Firestore via our API.
async function saveBookingToDb(bookingData: any) {
  // We construct an absolute URL for the API endpoint.
  // In a real production environment, you would use an environment variable for the base URL.
  const url = new URL('/api/bookings/add', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save booking to database.');
    }

    return await response.json();
  } catch (error: any) {
    console.error('[SERVER_ACTION_ERROR] saveBookingToDb:', error);
    throw new Error(`Failed to save booking: ${error.message}`);
  }
}


export async function getAvailableSlots(details: any): Promise<AvailabilitySlot[]> {
  if (!AVAILABILITY_WEBHOOK_URL) {
    throw new Error("Availability webhook URL is not configured.");
  }
  try {
    const response = await fetch(AVAILABILITY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  if (!CONFIRMATION_WEBHOOK_URL) {
    throw new Error("Confirmation webhook URL is not configured.");
  }
  try {
    const response = await fetch(CONFIRMATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    // After a successful webhook confirmation, save the booking to our database.
    await saveBookingToDb(details);

    const responseText = await response.text();
    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        // Ensure that the response is always a complete WebhookConfirmation object.
        return { status: 'Confirmed', ...parsed };
      } catch (e) {
        return { status: 'Confirmed', message: responseText };
      }
    }
    // Return a consistent success object even if the response body is empty
    return { 
      status: 'Confirmed', 
      message: 'Booking confirmed successfully.',
      dateTime: details.selectedDateTime ? `${details.selectedDateTime.date}T${details.selectedDateTime.time}` : new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    throw new Error(`Failed to confirm booking: ${error.message}`);
  }
}
