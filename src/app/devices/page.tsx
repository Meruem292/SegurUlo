'use client';

import { AppHeader } from '@/components/AppHeader';
import DeviceSettingsForm from './DeviceSettingsForm';

export default function DevicesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold">Device Settings</h1>
          <DeviceSettingsForm />
        </div>
      </main>
    </div>
  );
}
