import { AppHeader } from "@/components/AppHeader";
import PersonalizationForm from "./PersonalizationForm";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          <PersonalizationForm />
        </div>
      </main>
    </div>
  );
}
