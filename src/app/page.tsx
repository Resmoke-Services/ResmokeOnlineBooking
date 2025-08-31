import Image from 'next/image';
import Link from 'next/link';
import { ServiceCard } from '@/components/service-card';
import { BookingHeader } from '@/components/booking-header';

const services = [
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_repair_icon_08.PNG?alt=media&token=cda13c8e-77aa-49ae-9dec-f0d377d38076',
    title: 'REPAIRS',
    description: 'Appliances, GHD, Gate Motors, Garage Motors, Electronics, Automotive, Motorcycles, Electrical, Mechanical',
    href: '/services_repairs',
  },
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_collection_icon_03.PNG?alt=media&token=b30f7577-9362-4613-86f4-a8c75f205bb8',
    title: 'COLLECTION',
    description: 'Unwanted Appliances',
    href: '/services_collection',
  },
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_diagnostic_icon_10.PNG?alt=media&token=fe60872a-0426-4c4f-9b0e-132e4a89604e',
    title: 'DIAGNOSTICS',
    description: 'Automotive OBD II',
    href: '/services_diagnostic_scan',
  },
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_home_automation_icon_29.PNG?alt=media&token=39143628-552c-49bb-9a83-45f8a4e9498e',
    title: 'AUTOMATION',
    description: 'Lights, Gate, Garage Door, etc.',
    href: '/services_automation',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <BookingHeader />

      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Ffb_cover_page_6.jpg?alt=media&token=d42206d4-cadd-4dec-a7f8-7246accc2a56"
            alt="Resmoke Services Banner"
            data-ai-hint="Resmoke Services"
            fill
            className="object-cover z-0"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </section>

        <section id="services" className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Online Booking</h2>
                <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT A SERVICE</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        </section>
        
      </main>

      <footer className="w-full bg-card/50 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Resmoke Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
