import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const BookingHeader: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fresmoke_logo.jpg?alt=media&token=d87ce1ef-bcab-451e-bb87-7b84806c8575"
            alt="Resmoke Services Logo"
            width={48}
            height={48}
            className="rounded-full border-2 border-primary/50"
            data-ai-hint="company logo"
          />
          <span className="text-xl font-bold tracking-tight text-foreground sm:block">
            Resmoke Services
          </span>
        </Link>
        <nav>
          {/* Navigation can be added here if needed in the future */}
        </nav>
      </div>
    </header>
  );
};
