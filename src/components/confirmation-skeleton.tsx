import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, User, Mail, Phone, MapPin, Calendar as CalendarIcon, Clock, Wand2 } from "lucide-react";

export default function ConfirmationSkeleton() {
  return (
    <Card className="shadow-xl">
      <CardHeader className="items-center text-center">
        <CheckCircle className="h-16 w-16 text-muted mb-4" />
        <Skeleton className="h-9 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md mt-2" />
      </CardHeader>
      <CardContent className="space-y-6 text-base">
        <div className="flex items-start gap-3 rounded-lg border border-dashed p-4 text-center mx-auto max-w-md">
            <Wand2 className="w-8 h-8 text-muted shrink-0 mt-1" />
            <div className="w-full space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
            </div>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
            <Skeleton className="h-6 w-1/3 mb-3" />
            <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /> <Skeleton className="h-5 w-48" /></div>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-muted-foreground" /> <Skeleton className="h-5 w-56" /></div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-muted-foreground" /> <Skeleton className="h-5 w-36" /></div>
            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-muted-foreground" /> <Skeleton className="h-5 w-64" /></div>
        </div>
        <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-muted-foreground" /> <Skeleton className="h-5 w-52" /></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-muted-foreground" /> <Skeleton className="h-5 w-24" /></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Skeleton className="h-12 w-32 rounded-md" />
      </CardFooter>
    </Card>
  );
}
