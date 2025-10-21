
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';
import { useBookingStore } from '@/hooks/use-booking-store';
import type { ServiceType } from '@/lib/types';

const serviceOptions = [
  {
    type: 'onsite',
    title: 'On-Site Service',
    subtitle:
    (
      <span>
        <span className="text-gray-300 font-semibold">We come to you</span><br />
      </span>
    ),
    description: "Our technician comes directly to your home or office to diagnose and repair your items — the most convenient option without the need to travel.",
    features: [
      'All repairs include a comprehensive warranty on both parts and labour.',
      'Card/EFT/PayShap Payments accepted.',
      'Service at your home or office.',
      'Limited Options (Contact us for enquiries).',
      (
        <span>
          Callout fee applies based on location (Excludes Parts, Labour & Additional Fees):<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R550 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R650+ (Outside Centurion Area)</span>
        </span>
      ),
      'Full payment shall be made immediately upon completion of services.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs_mechanical%2Fservices_repairs_mechanical_onsite.PNG?alt=media&token=81ce56d5-088f-441b-8d8e-b5c828feac0c",
      alt: "Technician repairing appliance onsite",
      hint: "mechanical repair onsite"
    },
    href: "/category_repairs_mechanical/item_to_repair_mechanical"
  },
  {
    type: 'workshop',
    title: 'Workshop Drop-Off',
    subtitle:
    (
      <span>
        <span className="text-gray-300 font-semibold">You bring it to us</span><br />
      </span>
    ),
    description: 'You can bring your items to our workshop. This is a great cost-effective option with no callout fees.',
    features: [
      'All repairs include a comprehensive warranty on both parts and labour.',
      'Card/EFT/PayShap Payments accepted.',
      'Drop off at our Centurion workshop.',
      'No callout fee.',
      'Limited options (Contact us for more information).',
      'Full payment shall be made prior to the release of any item from the workshop.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs_mechanical%2Fservices_repairs_mechanical_workshop.PNG?alt=media&token=1969a85f-36c1-47d7-bce5-2b4b99a4d17e",
      alt: "Repair workshop with tools and appliances",
      hint: "mechanical repair workshop"
    },
    href: "/category_repairs_mechanical/item_to_repair_mechanical"
  },
  {
    type: 'collection_delivery',
    title: 'Collection & Delivery',
    subtitle:
    (
      <span>
        <span className="text-gray-300 font-semibold">We collect and deliver</span><br />
      </span>
    ),
    description: 'We will collect your Items from your home or office, perform the repairs at our workshop, and deliver them back to you.',
    features: [
      'Convenient pickup and return.',
      'Ideal for busy schedules.',
      'Pickup & Delivery fee applies based on item size and location (Excludes Parts, Labour & Additional Fees).',
      (
        <span>
          Small Items (e.g., Motors) – Hand-carryable mechanical items:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R350 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R450+ (Outside Centurion Area)</span>
        </span>
      ),
      (
        <span>
          Large Items (e.g., Machinery) – Bulky mechanical items requiring trolley/extra handling:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R550 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R650+ (Outside Centurion Area)</span>
        </span>
      ),
      'Full payment shall be made prior to the release of any item from the workshop.',
      'Card / Cash / EFT payments accepted.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs_mechanical%2Fservices_repairs_mechanical_workshop_collect.PNG?alt=media&token=db22ee6a-cad3-433d-b08a-f9ebc5cae77a",
      alt: "Collection and delivery service van",
      hint: "mechanical repair workshop collect & deliver"
    },
    href: "/category_repairs_mechanical/item_to_repair_mechanical"
  }
];

export default function ServicePage() {
  const { setServiceType } = useBookingStore();

  const handleServiceSelection = (serviceTitle: ServiceType) => {
    setServiceType(serviceTitle);
  };
  
  return (
    <BookingFlowLayout>
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">MECHANICAL REPAIRS</h1>
        <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT AN OPTION</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {serviceOptions.map((details) => (
          <Link 
            href={details.href}
            key={details.type} 
            className="block group h-full"
            onClick={() => handleServiceSelection(details.title as ServiceType)}
          >
            <Card className="w-full h-full overflow-hidden shadow-xl border-2 border-primary/50 animate-in fade-in-50 duration-500 transition-all hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 flex flex-col">
              <div className="relative w-full aspect-video bg-black/20">
                <Image
                  src={details.image.src}
                  alt={details.image.alt}
                  data-ai-hint={details.image.hint}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
              </div>
              <CardHeader className="text-center items-center space-y-2">
                 <CardTitle className="text-3xl font-bold">{details.title}</CardTitle>
                 {details.subtitle && <p className="text-lg text-muted-foreground">{details.subtitle}</p>}
                <CardDescription className="text-base px-4 pt-2">{details.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-muted-foreground">
                  {details.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-1 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </BookingFlowLayout>
  );
}
