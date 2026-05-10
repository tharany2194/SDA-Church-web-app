'use client';

import { useEffect } from 'react';

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const unregisterStaleWorkers = async () => {
      if (!('serviceWorker' in navigator)) {
        return;
      }

      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ('caches' in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(cacheKeys.map((cacheKey) => window.caches.delete(cacheKey)));
        }
      } catch (error) {
        console.warn('Service worker cleanup failed', error);
      }
    };

    unregisterStaleWorkers();
  }, []);

  return null;
}