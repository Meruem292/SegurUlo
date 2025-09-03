import { AppHeader } from "@/components/AppHeader";
import AccountProfileForm from "./AccountProfileForm";

export default function SettingsPage() {
  // In a real app, you'd fetch this from your auth provider or database
  const user = {
    name: 'SegurUlo User',
    email: 'user@segurulo.com',
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          <AccountProfileForm user={user} />
        </div>
      </main>
    </div>
  );
}
