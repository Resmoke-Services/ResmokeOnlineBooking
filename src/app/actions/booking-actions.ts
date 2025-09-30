
"use server";

import "dotenv/config";
import type { AvailabilitySlot, WebhookConfirmation } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function saveBookingToDb(bookingData: any) {
  const url = new URL('/api/bookings/add', BASE_URL);
  
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
  const url = new URL('/api/webhooks/available_time_slots', BASE_URL);

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || responseText;
      } catch (e) {
        errorDetails = responseText || "An unknown error occurred in the webhook.";
      }
      throw new Error(errorDetails);
    }

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
  const url = new URL('/api/webhooks/booking_confirmation', BASE_URL);
  
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });
    
    const responseText = await response.text();

    if (!response.ok) {
      let errorDetails = `Error: ${response.status}`;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || responseText;
      } catch (e) {
        errorDetails = responseText || "An unknown error occurred in the confirmation webhook.";
      }
      throw new Error(errorDetails);
    }

    await saveBookingToDb(details);

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
      dateTime: details.selectedDateTime ? `${details.selectedDateTime.date}T${details.selectedDateTime.time}` : new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("[SERVER_ACTION_ERROR] confirmBooking:", error);
    throw new Error(`Failed to confirm booking: ${error.message}`);
  }
}
