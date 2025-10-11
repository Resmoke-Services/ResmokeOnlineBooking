import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <WifiOff className="h-24 w-24 text-destructive mb-8" />
      <h1 className="text-4xl font-bold mb-4">You are Offline</h1>
      <p className="text-xl text-muted-foreground">
        It seems you've lost your internet connection. Please check it and try again.
      </p>
    </div>
  );
}
