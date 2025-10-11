

export const dynamic = 'force-dynamic';

import { adminDb } from '@/lib/firebase-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StaticPageLayout from '@/components/static-page-layout';
import type { BookingData } from '@/lib/types';

// Extend BookingData to include potential Firestore-added fields
interface BookingDocument extends Omit<BookingData, 'user'> {
  id: string;
  createdAt?: string; // Assuming createdAt is stored as an ISO string
}

// This function fetches data on the server
async function getBookings(): Promise<BookingDocument[]> {
  try {
    const bookingsCollection = adminDb.collection('bookings');
    const snapshot = await bookingsCollection.orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      return [];
    }

    const bookings = snapshot.docs.map(doc => {
      const data = doc.data() as BookingData;
      return {
        id: doc.id,
        ...data,
        createdAt: data.webhookConfirmation?.dateTime || (data as any).createdAt, // Prioritize webhook time
      };
    });
    
    return bookings as BookingDocument[];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // In a real app, you might want to handle this more gracefully
    return [];
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <StaticPageLayout>
      <Card>
        <CardHeader>
          <CardTitle>Admin - All Bookings</CardTitle>
          <CardDescription>A complete list of all bookings recorded in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.name} {booking.surname}</div>
                      </TableCell>
                       <TableCell>
                        <div>{booking.email}</div>
                        <div className="text-muted-foreground">{booking.cellNumber}</div>
                      </TableCell>
                      <TableCell>
                        {booking.selectedDateTime ? (
                            `${booking.selectedDateTime.date} at ${booking.selectedDateTime.time}`
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {booking.servicePath?.join(' / ') || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </StaticPageLayout>
  );
}
