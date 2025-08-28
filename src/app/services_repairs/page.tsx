
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import { BookingHeader } from "@/components/booking-header";

interface ServiceCategoryCardProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  imageHint: string;
  href: string;
}

function ServiceCategoryCard({ title, imageUrl, imageAlt, imageHint, href }: ServiceCategoryCardProps) {
  return (
    <Link href={href} className="block group">
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
    href: "/category_repairs_appliances",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_appliances_icon_10.PNG?alt=media&token=1b9e6e4e-3a4b-4ed2-9f4e-9b693dabfab0",
    imageAlt: "Appliance Repair",
    imageHint: "Appliance Repair"
  },
  {
    title: "GHD STRAIGHTENERS & BLOW DRYERS",
    href: "/category_repairs_ghd",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_ghd_icon_03.PNG?alt=media&token=31e219a1-eaa2-4782-a458-b2f62587d6c2",
    imageAlt: "GHD Straightener Repair",
    imageHint: "GHD Straightener Repair"
  },
  {
    title: "GATE & GARAGE MOTORS",
    href: "/category_repairs_gate",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_gate_motor_icon_04.PNG?alt=media&token=00f0174e-7501-4229-a050-b6ec4940e4cc",
    imageAlt: "Gate and Garage Motor Repair",
    imageHint: "Gate and Garage Motor Repair"
  },
  {
    title: "ELECTRONICS",
    href: "/category_repairs_electronics",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_electronics_icon_01.PNG?alt=media&token=f584b375-cd50-4d94-9221-05060a061ace",
    imageAlt: "Electronics repair",
    imageHint: "Electronics repair"
  },
  {
    title: "AUTOMOTIVE & MOTORCYCLES",
    href: "/category_repairs_automotive",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_automotive_electronics_icon_01.PNG?alt=media&token=da0bf7e8-6b6e-46fa-bb99-f8ce3fe4a4c8",
    imageAlt: "Automotive Repair",
    imageHint: "Automotive Repair"
  },
  {
    title: "ELECTRICAL",
    href: "/category_repairs_electrical",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_electrical_icon_01.PNG?alt=media&token=9eb8c5df-1f30-4da9-8908-8691564b376e",
    imageAlt: "Electrical Repair",
    imageHint: "Electrical Repair"
  },
  {
    title: "MECHANICAL",
    href: "/category_repairs_mechanical",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_mechanical_icon_01.PNG?alt=media&token=1de32089-9eb4-4c40-bd5e-794293bd54fb",
    imageAlt: "Mechanical Repair",
    imageHint: "Mechanical Repair"
  }
];

export default function ServicesPage() {
  return (
     <div className="min-h-screen flex flex-col bg-background text-foreground">
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
