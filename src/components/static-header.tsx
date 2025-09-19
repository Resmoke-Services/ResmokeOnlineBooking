
"use client";

import Image from 'next/image';
import Link from 'next/link';

export const StaticHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fall_pages%2Flogo.jpg?alt=media&token=f25af4cd-64be-4d6f-9d76-45cbd48dc859"
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
          {/* No auth buttons */}
        </nav>
      </div>
    </header>
  );
};
