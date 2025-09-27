
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  priority?: boolean;
}

export function ServiceCard({ icon, title, description, href, priority = false }: ServiceCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 border-2 border-transparent hover:border-primary/50">
        <div className="relative w-full aspect-video bg-muted/20">
          <Image
            src={icon}
            alt={`${title} icon`}
            fill
            className="object-contain transition-transform duration-300 p-4 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col justify-center text-center z-10">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
