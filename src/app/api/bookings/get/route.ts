
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const bookingsCollection = adminDb.collection('bookings');
    const snapshot = await bookingsCollection.get();

    if (snapshot.empty) {
      return NextResponse.json({ bookings: [] }, { status: 200 });
    }

    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
