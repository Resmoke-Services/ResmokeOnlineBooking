
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// This forces the route to be evaluated dynamically.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Check for credentials at the start of the function execution
  // This is a critical check for server-side functions using Firebase Admin.
  if (!process.env.APP_FIREBASE_ADMIN_CREDENTIALS) {
    console.error('CRITICAL: Firebase Admin credentials are not set.');
    // Return a clear error message to the client.
    return NextResponse.json({ message: 'Server configuration error: Missing Firebase credentials.' }, { status: 500 });
  }
  
  try {
    const bookingDetails = await request.json();

    // Add a server-side timestamp to the booking data.
    const dataToSave = {
      ...bookingDetails,
      createdAt: new Date().toISOString(),
    };

    // Add the new booking document to the 'bookings' collection in Firestore.
    const bookingRef = await adminDb.collection('bookings').add(dataToSave);

    // Return a success response including the ID of the newly created document.
    return NextResponse.json({ success: true, bookingId: bookingRef.id }, { status: 201 });

  } catch (error: any) {
    console.error('Error saving booking to Firestore:', error);

    // Handle potential JSON parsing errors from the request.
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Bad Request: Invalid JSON format.' }, { status: 400 });
    }
    
    // Return a generic internal server error for other issues.
    return NextResponse.json({ message: 'Internal Server Error while saving booking.' }, { status: 500 });
  }
}
