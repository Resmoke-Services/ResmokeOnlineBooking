import { Loader2 } from "lucide-react";

export default function PageSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
