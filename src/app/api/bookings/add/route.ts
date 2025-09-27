
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Check for credentials at the start of the function execution
  if (!process.env.APP_FIREBASE_ADMIN_CREDENTIALS) {
    console.error('CRITICAL: Firebase Admin credentials are not set.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const bookingData = await request.json();

    // Basic validation to ensure we have some data.
    if (!bookingData || typeof bookingData !== 'object' || Object.keys(bookingData).length === 0) {
      return NextResponse.json({ message: 'Bad Request: Missing or invalid booking data' }, { status: 400 });
    }

    // Add a server-side timestamp for when the record was created.
    const dataToSave = {
      ...bookingData,
      createdAt: new Date().toISOString(),
    };

    const bookingsCollection = adminDb.collection('bookings');
    const docRef = await bookingsCollection.add(dataToSave);

    // Return the new document ID and a success message.
    return NextResponse.json({ id: docRef.id, message: 'Booking added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding booking:', error);
    // Handle potential JSON parsing errors specifically.
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Bad Request: Invalid JSON format' }, { status: 400 });
    }
    // For all other errors, return a generic server error.
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
