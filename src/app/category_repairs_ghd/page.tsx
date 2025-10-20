
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
      (
        <span>
          General repair cost:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R850 (Typical)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R1500+ (Extensive)</span><br />
          </span>
    ),
      'Full payment shall be made prior to the release of any item from the workshop.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs_ghd%2Fsevices_repairs_ghd_workshop.PNG?alt=media&token=4c06684c-1f86-40da-85af-90cd22177fa2",
      alt: "Repair workshop with tools and appliances",
      hint: "repair workshop"
    },
    href: "/booking/select-type"
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
    description: 'We will collect your GHD from your home or office, perform the repairs at our workshop, and deliver them back to you.',
    features: [
      'All repairs include a comprehensive warranty on both parts and labour.',
      'Card/EFT/PayShap Payments accepted.',
      'Convenient pickup and return.',
      'Ideal for busy schedules',
      (
        <span>
          General repair cost:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R850 (Typical)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R1500+ (Extensive)</span><br />
          </span>
      ),
      (
        <span>
          Collection & Delivery Fee:<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">Free (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R250+ (Outside Centurion Area)</span>
        </span>
      ),
      'Full payment shall be made prior to the release of any item from the workshop.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_repairs_ghd%2Fsevices_repairs_ghd_workshop_collection.PNG?alt=media&token=7dfe71cb-e345-4c72-85d0-42080fe7046d",
      alt: "Collection and delivery service van",
      hint: "ghd repair workshop collect & deliver"
    },
    href: "/booking/select-type"
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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">GHD REPAIRS</h1>
        <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT AN OPTION</p>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl">
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
      </div>
    </BookingFlowLayout>
  );
}
