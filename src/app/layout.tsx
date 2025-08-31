import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: 'Resmoke Online Booking',
  description: 'Online booking for Resmoke services.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#192231',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
