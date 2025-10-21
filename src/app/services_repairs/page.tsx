
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
    setServicePath(["REPAIRS", category]);
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
    href: "/services_repairs/category_repairs_appliances",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_appliances.PNG?alt=media&token=a393630d-4b00-41a5-a254-1cb3633d9ce9",
    imageAlt: "Appliance Repair",
    imageHint: "Appliance Repair",
    category: "APPLIANCES"
  },
  {
    title: "GHD STRAIGHTENERS & BLOW DRYERS",
    href: "/services_repairs/category_repairs_ghd",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_ghd.PNG?alt=media&token=047a66da-0c76-4f8d-9eb4-746afbea0e53",
    imageAlt: "GHD Straightener Repair",
    imageHint: "GHD Straightener Repair",
    category: "GHD"
  },
   {
    title: "EMS LASER MACHINES",
    href: "/services_repairs/category_repairs_ems",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_ems.png?alt=media&token=558c376b-2341-4f72-80af-0f56d2e6eda7",
    imageAlt: "EMS Laser Machine Repair",
    imageHint: "laser machine repair",
    category: "EMS"
  },
  {
    title: "GATE & GARAGE MOTORS",
    href: "/services_repairs/category_repairs_gate",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_gate_motor.PNG?alt=media&token=b5407a97-d507-4582-9807-a94c71546bd5",
    imageAlt: "Gate and Garage Motor Repair",
    imageHint: "Gate and Garage Motor Repair",
    category: "GATE"
  },
  {
    title: "ELECTRONICS",
    href: "/services_repairs/category_repairs_electronics",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_electronics.PNG?alt=media&token=370077d9-af5f-43a1-8a35-55be6808aa38",
    imageAlt: "Electronics repair",
    imageHint: "Electronics repair",
    category: "ELECTRONICS"
  },
  {
    title: "AUTOMOTIVE & MOTORCYCLES",
    href: "/services_repairs/category_repairs_automotive",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_automotive_electronics.PNG?alt=media&token=a6ace560-61c5-4dfb-b52f-c77c0cfe7b97",
    imageAlt: "Automotive Repair",
    imageHint: "Automotive Repair",
    category: "AUTOMOTIVE"
  },
  {
    title: "ELECTRICAL",
    href: "/services_repairs/category_repairs_electrical",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_electrical.PNG?alt=media&token=ea6af506-a6b5-44e6-9238-f7fd33c263a2",
    imageAlt: "Electrical Repair",
    imageHint: "Electrical Repair",
    category: "ELECTRICAL"
  },
  {
    title: "MECHANICAL",
    href: "/services_repairs/category_repairs_mechanical",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs%2Fservices_repairs_mechanical.PNG?alt=media&token=4e5f8e10-f755-4508-b3f8-68c13c417edb",
    imageAlt: "Mechanical Repair",
    imageHint: "Mechanical Repair",
    category: "MECHANICAL"
  }
];

export default function ServicesPage() {

  return (
     <div className="min-h-screen flex flex-col bg-background text-foreground">
        <ServiceSelectionTracker selections={["REPAIRS"]} />
        <BookingHeader />

        <main className="flex-grow">
            <section id="services" className="py-24">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">REPAIR SERVICES</h2>
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

        {/* Footer */}
        <footer className="w-full bg-card/50 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Resmoke Services. All rights reserved.</p>
          </div>
        </footer>
    </div>
  );
}

    