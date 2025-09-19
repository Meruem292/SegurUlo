
'use client';

import { AppHeader } from '@/components/AppHeader';
import { LocationFinder } from './LocationFinder';

export default function LocationPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-2 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-6 text-3xl font-bold">Find Location</h1>
          <LocationFinder />
        </div>
      </main>
    </div>
  );
}
