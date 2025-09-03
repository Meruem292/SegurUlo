'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Heart,
  PlusCircle,
  Shield,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Contact {
  id: number;
  name: string;
  phone: string;
}

function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'Jane Doe', phone: '555-123-4567' },
    { id: 2, name: 'John Smith', phone: '555-987-6543' },
  ]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    if (name && phone) {
      setContacts([
        ...contacts,
        { id: Date.now(), name, phone },
      ]);
      setAddDialogOpen(false);
      form.reset();
      toast({
        title: "Contact Added",
        description: `${name} has been added to your emergency contacts.`,
      });
    }
  };
  
  const handleRemoveContact = (id: number) => {
    const contactToRemove = contacts.find(c => c.id === id);
    if (contactToRemove) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        toast({
            title: "Contact Removed",
            description: `${contactToRemove.name} has been removed.`,
            variant: "destructive"
        });
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg h-full bg-green-900/20 border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Heart className="h-5 w-5" />
          Emergency Contacts
        </CardTitle>
        <CardDescription className="text-green-400/70">
          These contacts will be notified in an emergency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between rounded-lg bg-black/20 p-3"
              >
                <div>
                  <p className="font-medium text-green-300">{contact.name}</p>
                  <p className="text-sm text-green-400/70">{contact.phone}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveContact(contact.id)} className="text-green-400 hover:bg-black/30 hover:text-green-300">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-green-400/70 py-4">No contacts added yet.</p>
          )}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-6 w-full bg-green-500/80 text-white hover:bg-green-500">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>
                Enter the name and phone number of your new contact.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddContact}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" name="phone" type="tel" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Contact</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function HelmetStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn("rounded-2xl shadow-lg transition-colors duration-500", 
        isConnected ? 'bg-blue-900/20 border-blue-500/30' : 'bg-orange-900/20 border-orange-500/30'
    )}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2 transition-colors duration-500",
            isConnected ? 'text-blue-400' : 'text-orange-400'
        )}>
          <Shield className="h-5 w-5" />
          Helmet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-4 p-8">
        {isConnected ? (
          <>
            <Wifi className="h-8 w-8 text-blue-400" />
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30">
              Connected
            </Badge>
          </>
        ) : (
          <>
            <WifiOff className="h-8 w-8 text-orange-400" />
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30">
                Disconnected
            </Badge>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EmergencyAlert() {
  const { toast } = useToast();

  const handleAlert = () => {
    toast({
      title: 'Emergency Alert Sent!',
      description: 'Your emergency contacts have been notified.',
      variant: 'destructive',
    });
  };

  return (
    <Card className="rounded-2xl shadow-lg bg-red-900/20 border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          Emergency Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-red-400/80">
          Press this button only in a real emergency to instantly notify your
          contacts.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="w-full h-16 text-lg bg-red-600 hover:bg-red-700">
              TRIGGER ALERT
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately send an emergency alert with your
                location to all your emergency contacts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAlert}>
                Yes, Send Alert
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1 bg-secondary/50 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <HelmetStatus />
              <EmergencyAlert />
            </div>
            <div className="lg:row-span-2">
              <EmergencyContacts />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
