
'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { BookingHeader } from "@/components/booking-header";
import ServiceSelectionTracker from "@/components/service-selection-tracker";
import { useBookingStore } from "@/hooks/use-booking-store";

interface ServiceCategoryCardProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  imageHint: string;
  href: string;
  category: string;
}

function ServiceCategoryCard({ title, imageUrl, imageAlt, imageHint, href, category }: ServiceCategoryCardProps) {
  const { setServicePath } = useBookingStore();

  const handleCategoryClick = () => {
    setServicePath(["COLLECTION", category]);
  };

  return (
    <Link href={href} className="block group" onClick={handleCategoryClick}>
      <Card className="overflow-hidden h-full flex flex-col bg-card/50 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 border-2 border-transparent hover:border-primary/50">
        <div className="relative w-full aspect-video bg-black/20">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col justify-center text-center z-10">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}

const serviceCategories: ServiceCategoryCardProps[] = [
  {
    title: "APPLIANCES",
    href: "/category_collection_appliances",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_collection%2Fservices_collection_appliances_onsite_collection.PNG?alt=media&token=dd2f5a68-42a5-4e20-945c-e670cd2b0654",
    imageAlt: "Appliance Collection",
    imageHint: "appliance collection",
    category: "APPLIANCES"
  },
];

export default function ServicesCollection() {
  return (
     <div className="min-h-screen flex flex-col bg-background text-foreground">
        <ServiceSelectionTracker selections={["COLLECTION"]} />
        <BookingHeader />
        <main className="flex-grow">
            <section id="services" className="py-24">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">COLLECTION SERVICES</h2>
                    <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT A CATEGORY</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {serviceCategories.map((service) => (
                    <ServiceCategoryCard 
                      key={service.title}
                      title={service.title}
                      href={service.href}
                      imageUrl={service.imageUrl}
                      imageAlt={service.imageAlt}
                      imageHint={service.imageHint}
                      category={service.category}
                    />
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
