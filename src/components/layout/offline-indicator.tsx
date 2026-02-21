'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    if (typeof navigator.onLine !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed bottom-16 right-4 z-50 mb-2 rounded-lg bg-destructive p-3 text-destructive-foreground shadow-lg md:bottom-4">
      <div className="flex items-center gap-3">
        <WifiOff className="h-5 w-5" />
        <div>
          <p className="font-bold">Offline Mode</p>
          <p className="text-sm">Your changes will sync when you're back online.</p>
        </div>
      </div>
    </div>
  );
}
