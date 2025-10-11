
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';

const APP_NAME = "Resmoke Online Booking";
const APP_DESCRIPTION = "Online booking for Resmoke services.";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fall_pages%2Flogo.jpg?alt=media&token=f25af4cd-64be-4d6f-9d76-45cbd48dc859",
    shortcut: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fall_pages%2Flogo.jpg?alt=media&token=f25af4cd-64be-4d6f-9d76-45cbd48dc859",
    apple: [{ url: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fall_pages%2Flogo.jpg?alt=media&token=f25af4cd-64be-4d6f-9d76-45cbd48dc859", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: '#4299E1',
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  userScalable: false,
}

const PLACES_API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Toaster />
        {PLACES_API_KEY && (
           <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${PLACES_API_KEY}&libraries=places&callback=initMap`}
            strategy="afterInteractive"
            async
          />
        )}
      </body>
    </html>
  );
}
