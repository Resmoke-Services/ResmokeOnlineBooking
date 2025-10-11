
import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const AppHeader: FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
            
          </span>
        </Link>
        <nav>
          {/* "Book a Repair" button removed as per request */}
        </nav>
      </div>
    </header>
  );
};
