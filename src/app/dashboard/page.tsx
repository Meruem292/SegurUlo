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
  Tag,
  Loader2,
} from 'lucide-react';
import { ref, push, remove, query, onValue } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';

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
import { auth, db } from '@/lib/firebase';
import PersonalizationForm from '../settings/PersonalizationForm';

interface Contact {
  key: string;
  name: string;
  phone: string;
  tag?: string;
}

function EmergencyContacts() {
  const [user, userLoading] = useAuthState(auth);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const contactsQuery = user ? ref(db, `users/${user.uid}/contacts`) : null;
  const [snapshots, loading] = useList(contactsQuery);

  const contacts: Contact[] =
    snapshots?.map(snapshot => ({
      key: snapshot.key as string,
      ...snapshot.val(),
    })) || [];
  
  const handleAddContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: 'Not Logged In',
        description: 'You must be logged in to add contacts.',
        variant: 'destructive',
      });
      return;
    }
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const tag = formData.get('tag') as string;

    if (name && phone) {
      try {
        const userContactsRef = ref(db, `users/${user.uid}/contacts`);
        await push(userContactsRef, {
          name,
          phone,
          tag: tag || '',
        });
        setAddDialogOpen(false);
        form.reset();
        toast({
          title: 'Contact Added',
          description: `${name} has been added to your emergency contacts.`,
        });
      } catch (error) {
        toast({
          title: 'Error Adding Contact',
          description: 'There was a problem saving your contact.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleRemoveContact = async (key: string) => {
    if (!user) return;
    const contactToRemove = contacts.find(c => c.key === key);
    if (contactToRemove) {
      try {
        await remove(ref(db, `users/${user.uid}/contacts/${key}`));
        toast({
          title: 'Contact Removed',
          description: `${contactToRemove.name} has been removed.`,
          variant: 'destructive',
        });
      } catch (error) {
        toast({
          title: 'Error Removing Contact',
          description: 'There was a problem removing your contact.',
          variant: 'destructive',
        });
      }
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
          {loading || userLoading ? (
             <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : contacts.length > 0 ? (
            contacts.map(contact => (
              <div
                key={contact.key}
                className="flex items-center justify-between rounded-lg bg-muted p-3"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.phone}
                  </p>
                  {contact.tag && (
                    <Badge variant="secondary" className="mt-1">
                      <Tag className="mr-1 h-3 w-3" />
                      {contact.tag}
                    </Badge>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/80 hover:text-foreground">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove {contact.name} from your emergency contacts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemoveContact(contact.key)}>
                        Yes, Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No contacts found.
            </p>
          )}
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-6 w-full bg-green-500 text-white hover:bg-green-500/90" disabled={!user}>
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
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tag" className="text-right">
                    Tag
                  </Label>
                  <Input
                    id="tag"
                    name="tag"
                    placeholder="e.g., Family, Close Friend"
                    className="col-span-3"
                  />
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
