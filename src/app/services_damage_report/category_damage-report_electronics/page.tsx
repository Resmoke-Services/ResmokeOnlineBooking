
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';
import ServiceSelectionTracker from '@/components/service-selection-tracker';
import { useBookingStore } from '@/hooks/use-booking-store';
import type { ServiceType } from '@/lib/types';

const serviceOptions = [
  {
    type: 'onsite',
    title: 'On-Site Assessment',
    subtitle:
    (
      <span>
        <span className="text-gray-300 font-semibold">We come to you</span><br />
      </span>
    ),
    description: "Our technician comes to your location to assess the damage and compile a detailed report for insurance or other purposes.",
    features: [
      'Comprehensive damage assessment and report.',
      'Card/EFT/PayShap Payments accepted.',
      'Service at your home or office.',
      (
        <span>
          Callout Fee applies based on location:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R550 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R650+ (Outside Centurion Area)</span>
        </span>
      ),
      (
        <span>
          Damage report Fee:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R750 (All Items)</span>
        </span>
      ),
      'Full payment shall be made immediately upon completion of the assessment.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_damage_report%2Fservices_damage_report_onsite.png?alt=media&token=f85bc097-506e-4e0d-82b6-820178f366a0",
      alt: "Technician assessing a damaged electronic device",
      hint: "electronics damage assessment"
    },
    href: "/services_damage_report/category_damage-report_electronics/item_to_assess_electronics"
  },
  {
    type: 'WORKSHOP',
    title: 'Workshop Assessment',
    subtitle:
    (
      <span>
        <span className="text-gray-300 font-semibold">You bring it to us</span><br />
      </span>
    ),
    description: 'Bring your electronic device to our workshop for a detailed damage assessment and report.',
    features: [
      'Comprehensive damage assessment and report.',
      'Card/EFT/PayShap Payments accepted.',
      'Drop off at our Centurion workshop.',
       (
        <span>
          Damage report Fee:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R750 (All Items)</span>
        </span>
      ),
      'Full payment shall be made prior to the release of any item from the workshop.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_damage_report%2Fservices_damage_report_workshop.png?alt=media&token=d4d731ba-4b06-4033-aa55-e358912c8089",
      alt: "Electronic device on a workbench in a workshop",
      hint: "electronics assessment workshop"
    },
    href: "/services_damage_report/category_damage-report_electronics/item_to_assess_electronics"
  }
];

export default function ServicePage() {
  const { setServiceType } = useBookingStore();

  const handleServiceSelection = (serviceTitle: ServiceType) => {
    setServiceType(serviceTitle);
  };
  
  return (
    <BookingFlowLayout>
      <ServiceSelectionTracker selections={["DAMAGE REPORT", "ELECTRONICS"]} />
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">ELECTRONICS DAMAGE REPORT</h1>
        <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT AN OPTION</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
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

    