
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';

const serviceOptions = [
  {
    type: 'workshop',
    title: 'Workshop',
    subtitle:
    (
      <span>
        <span className="text-gray-300 font-semibold">You bring it to us</span><br />
      </span>
    ),
    description: 'Bring your vehicle to our workshop for a diagnostic scan.',
    features: [
      'All repairs include a comprehensive warranty on both parts and labour.',
      'Card/EFT/PayShap Payments accepted.',
      'Scan and clear fault codes.',
      'Scan for potential issues.',
      'Bi-directional testing.',
      'Basic diagnostic scan.',
      'Full profesional advanced diagnostic scan.',
      'Full diagnostic report.',
      'Code or Program modules (Contact us for enquiries).',
      'All major brands and models supported.',
      'Full payment shall be made immediately upon completion of services.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_diagnostics%2Fservices_diagnostic_scan_workshop.PNG?alt=media&token=e5720c24-0369-4112-9872-f08e0cb8f413",
      alt: "Technician performing diagnostic scan",
      hint: "car diagnostic scan workshop"
    },
    href: "/booking/select-type"
  },
  {
    type: 'onsite',
    title: 'On-Site Service',
    subtitle:
    (
      <span>
        <span className="text-gray-300 font-semibold">We come to you</span><br />
      </span>
    ),
    description: "Our technician comes directly to your home or office to do a diagnostic scan on your vehicle — the most convenient option without the need to travel.",
    features: [
      'All repairs include a comprehensive warranty on both parts and labour.',
      'Card/EFT/PayShap Payments accepted.',
      'Diagnostic scan at your home or office.',
      'Scan and clear fault codes.',
      'Scan for potential issues.',
      'Bi-directional testing.',
      'Basic diagnostic scan.',
      'Full profesional advanced diagnostic scan.',
      'Full diagnostic report.',
      'Code or Program modules (Contact us for enquiries).',
      'All major brands and models supported.',
      (
        <span>
          Callout fee applies based on location (Excludes Scan, Report, Code, Program):<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R550 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R650+ (Outside Centurion Area)</span>
        </span>
      ),
      'Full payment shall be made immediately upon completion of services.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fservices_diagnostics%2Fservices_diagnostic_scan_onsite.PNG?alt=media&token=73321f5d-5fc9-4ccb-baaf-2f83dc8613b9",
      alt: "Technician performing diagnostic scan",
      hint: "car diagnostic scan onsite"
    },
    href: "/booking/select-type"
  }
];

export default function ServicesDiagnosticScan() {
  return (
    <BookingFlowLayout>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">DIAGNOSTIC SCAN</h2>
        <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT AN OPTION</p>
      </div>
       <div className="flex justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl">
          {serviceOptions.map((details) => (
            <Link href={details.href} key={details.type} className="block group h-full">
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
