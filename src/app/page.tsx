// Forcing a full redeployment

import HomePageContent from '@/components/home-page-content';
import { BookingHeader } from '@/components/booking-header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <BookingHeader />
      <main className="flex-grow">
        <HomePageContent />
      </main>
      <footer className="w-full bg-card/50 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Resmoke Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
