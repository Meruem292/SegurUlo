'use client';

import { AppHeader } from '@/components/AppHeader';
import ContactsManager from './ContactsManager';

export default function ContactsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-6 text-3xl font-bold">Manage Contacts</h1>
          <ContactsManager />
        </div>
      </main>
    </div>
  );
}
