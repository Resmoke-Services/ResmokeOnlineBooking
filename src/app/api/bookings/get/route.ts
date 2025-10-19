
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// This forces the route to be evaluated dynamically.
export const dynamic = 'force-dynamic';

export async function GET() {
  // Check for credentials at the start of the function execution
  if (!process.env.APP_FIREBASE_ADMIN_CREDENTIALS) {
    console.error('CRITICAL: Firebase Admin credentials are not set.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }
  
  try {
    const bookingsCollection = adminDb.collection('bookings');
    // Fetch bookings ordered by creation date, descending.
    const snapshot = await bookingsCollection.orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      return NextResponse.json({ bookings: [] }, { status: 200 });
    }

    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Internal Server Error while fetching bookings' }, { status: 500 });
  }
}
