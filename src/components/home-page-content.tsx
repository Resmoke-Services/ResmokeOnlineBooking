
import { ServiceCard } from '@/components/service-card';

const services = [
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fhome_page%2Fhome_page_repairs.PNG?alt=media&token=67f220af-232b-44b4-9bdc-2882a1b7781b',
    title: 'REPAIRS',
    description: 'Appliances, GHD, Gate Motors, Garage Motors, Electronics, Automotive, Motorcycles, Electrical, Mechanical',
    href: '/services_repairs',
    priority: true,
  },
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fhome_page%2Fhome_page_collection.PNG?alt=media&token=2bde919a-a6ef-425d-8eeb-1bfc650013e7',
    title: 'COLLECTION',
    description: 'Unwanted Appliances',
    href: '/services_collection',
    priority: true,
  },
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fhome_page%2Fhome_page_diagnostic.PNG?alt=media&token=7bd4025c-db9f-4b23-ac5b-913de31c2eb9',
    title: 'DIAGNOSTICS',
    description: 'Automotive OBD II',
    href: '/services_diagnostic_scan',
    priority: true,
  },
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fhome_page%2Fhome_page_home_automation.PNG?alt=media&token=ba398581-882b-4be6-9007-b389ceae5936',
    title: 'AUTOMATION',
    description: 'Lights, Gate, Garage Door, etc.',
    href: '/services_automation',
    priority: true,
  },
  {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-2610147525-49407.firebasestorage.app/o/resmokeonlinebooking_pwa%2Fimages%2Fhome_page%2Fhome_page_damage_report.png?alt=media&token=e7de85bd-3882-42d4-a020-13d8626b75fb',
    title: 'DAMAGE REPORT',
    description: 'Appliances, Electronics',
    href: '/services_damage_report',
    priority: true,
  },
];

export default function HomePageContent() {
  return (
      <main className="flex-1">
        <section id="services" className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase">Online Booking</h2>
              <p className="mt-4 text-lg text-muted-foreground animate-zoom-in-out">SELECT A SERVICE</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          </div>
        </section>
      </main>
  );
}
