
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();

    if (!bookingData || Object.keys(bookingData).length === 0) {
      return NextResponse.json({ message: 'Bad Request: Missing booking data' }, { status: 400 });
    }

    const bookingsCollection = adminDb.collection('bookings');
    const docRef = await bookingsCollection.add({
      ...bookingData,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Booking added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding booking:', error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
