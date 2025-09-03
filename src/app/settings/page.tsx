"use client";

import { AppHeader } from "@/components/AppHeader";
import AccountProfileForm from "./AccountProfileForm";
import PersonalizationForm from "./PersonalizationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // In a real app, you'd fetch this from your auth provider or database
  const currentUser = {
    name: user?.displayName ?? 'SegurUlo User',
    email: user?.email ?? 'segurulouser@gmail.com',
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="personalization">AI Personalization</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mt-6">
              <AccountProfileForm user={currentUser} />
            </TabsContent>
            <TabsContent value="personalization" className="mt-6">
                <PersonalizationForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}