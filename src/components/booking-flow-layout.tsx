import type { FC, ReactNode } from 'react';
import { BookingHeader } from './booking-header';

interface BookingFlowLayoutProps {
  children: ReactNode;
}

const BookingFlowLayout: FC<BookingFlowLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <BookingHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
      <footer className="py-4 mt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Resmoke Services. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BookingFlowLayout;