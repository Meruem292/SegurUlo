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
import PersonalizationForm from '../settings/PersonalizationForm';

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
    <Card className="rounded-2xl shadow-lg h-full border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-500">
          <Heart className="h-5 w-5" />
          Emergency Contacts
        </CardTitle>
        <CardDescription>
          These contacts will be notified in an emergency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between rounded-lg bg-muted p-3"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveContact(contact.id)} className="text-muted-foreground hover:bg-muted/80 hover:text-foreground">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No contacts added yet.</p>
          )}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-6 w-full bg-green-500 text-white hover:bg-green-500/90">
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
        isConnected ? 'border-blue-500/30' : 'border-orange-500/30'
    )}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2 transition-colors duration-500",
            isConnected ? 'text-blue-500' : 'text-orange-500'
        )}>
          <Shield className="h-5 w-5" />
          Helmet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-4 p-8">
        {isConnected ? (
          <>
            <Wifi className="h-8 w-8 text-blue-500" />
            <Badge variant="outline" className="border-blue-500/50 text-blue-500">
              Connected
            </Badge>
          </>
        ) : (
          <>
            <WifiOff className="h-8 w-8 text-orange-500" />
            <Badge variant="outline" className="border-orange-500/50 text-orange-500">
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
    <Card className="rounded-2xl shadow-lg border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-5 w-5" />
          Emergency Alert
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">
          Press this button only in a real emergency to instantly notify your
          contacts.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="w-full h-16 text-lg">
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
      <main className="flex-1 bg-muted/20 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <HelmetStatus />
                <EmergencyAlert />
              </div>
              <PersonalizationForm />
            </div>
            <div className="row-span-2">
                <EmergencyContacts />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}