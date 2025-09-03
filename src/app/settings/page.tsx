"use client";

import { AppHeader } from "@/components/AppHeader";
import AccountProfileForm from "./AccountProfileForm";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loader2 } from "lucide-react";


export default function SettingsPage() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your settings...</p>
      </div>
    );
  }

  if (!user) {
    // In a real app, you might redirect to login
     return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p className="mt-4 text-muted-foreground">Please log in to view your settings.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-xl">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          <AccountProfileForm user={user} />
        </div>
      </main>
    </div>
  );
}