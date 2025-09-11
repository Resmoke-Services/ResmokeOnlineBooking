
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import BookingFlowLayout from '@/components/booking-flow-layout';
import ServiceSelectionTracker from '@/components/service-selection-tracker';

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
      'All major brands and models serviced.',
      (
        <span>
          Callout fee applies based on location (Excludes Parts, Labour & Additional Fees):<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R550 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R650+ (Outside Centurion Area)</span><br /><br />
          Cost Breakdown Example: R550 (Callout Fee) + R750 (Parts) + R650 (Labour) = R1950.<br /><br />
          </span>
    ),
      '"While you are here" or non-prebooked items will be charged an additional "While you are here" fee of R250 per item.',
      'Full payment shall be made immediately upon completion of services.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_onsite_repairs_appliances_icon_03.PNG?alt=media&token=51b4634d-6e3f-4fe7-8c53-4755f869797b",
      alt: "Technician repairing appliance onsite",
      hint: "appliance repair"
    },
    href: "/privacy_notice?next=/booking/select-type"
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
      'All major brands and models serviced.',
      'Strip and Quote Fee applies based on item selected.',
      (
        <span>
          Strip and Quote Fee applies based on item selected (Excludes Parts, Labour & Additional Fees):<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R250 (Typical)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R450+ (Extensive)</span><br /><br />
          Cost Breakdown Example: R250 (Strip & Quote Fee) + R750 (Parts) + R650 (Labour) = R1650.<br /><br />
          </span>
      ),
      'Full payment shall be made prior to the release of any item from the workshop.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_workshop_repairs_appliances_icon_06.PNG?alt=media&token=a2b8f513-c1bf-45ff-9da8-a7687671b385",
      alt: "Repair workshop with tools and appliances",
      hint: "repair workshop"
    },
    href: "/privacy_notice?next=/booking/select-type"
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
      'All repairs include a comprehensive warranty on both parts and labour.',
      'Card/EFT/PayShap Payments accepted.',
      'Convenient pickup and return.',
      'Ideal for busy schedules.',
      (
        <span>
          Collection & Delivery Fee - Small Hand-carryable Items (e.g., Microwave):<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R350 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R450+ (Outside Centurion Area)</span>
        </span>
      ),
      (
        <span>
          Collection & Delivery Fee - Large Items requiring trolley/extra handling (e.g., Dishwasher):<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R550 (Centurion Area)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R650+ (Outside Centurion Area)</span>
        </span>
      ),
      (
        <span>
          Strip and Quote Fee applies based on item selected (Excludes Parts, Labour & Additional Fees):<br />
          &nbsp;&nbsp; <span className="text-green-500 font-semibold">R250 (Typical)</span><br />
          &nbsp;&nbsp; <span className="text-orange-500 font-semibold">R450+ (Extensive)</span><br /><br />
          Cost Breakdown Example: R350 (Collection & Delivery Fee) + R250 (Strip & Quote Fee) + R750 (Parts) + R650 (Labour) = R2000.<br /><br />
          </span>
      ),
      'Full payment shall be made prior to the release of any item from the workshop.'
    ],
    image: {
      src: "https://firebasestorage.googleapis.com/v0/b/resmokeonlinebooking.firebasestorage.app/o/images_and_logos%2Fimagen_ai_generated_16_9_workshop_repairs_appliances_collection_icon_01.PNG?alt=media&token=201b9335-a8d6-4b92-bda6-f1ce4845bcc0",
      alt: "Collection and delivery service van",
      hint: "delivery van"
    },
    href: "/privacy_notice?next=/booking/select-type"
  }
];

export default function ServicePage() {
  return (
    <BookingFlowLayout>
      <ServiceSelectionTracker selections={["REPAIRS", "APPLIANCES"]} />
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">APPLIANCE REPAIRS</h1>
        <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT AN OPTION</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {serviceOptions.map((details) => (
          <Link 
            href={details.href}
            key={details.type} 
            className="block group h-full"
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
