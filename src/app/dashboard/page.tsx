
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Settings2,
} from 'lucide-react';
import { ref, push, remove, query, onValue, set } from 'firebase/database';
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
import { Checkbox } from '@/components/ui/checkbox';

interface Contact {
  key: string;
  name: string;
  phone: string;
  tags?: string[];
}

interface TagInfo {
  key: string;
  name: string;
}

const defaultTags = ['Family', 'Close Friend', 'Friend'];

function EmergencyContacts() {
  const [user, userLoading] = useAuthState(auth);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isGroupsDialogOpen, setGroupsDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  
  const contactsQuery = user ? query(ref(db, `users/${user.uid}/contacts`)) : null;
  const [contactsSnapshots, contactsLoading] = useList(contactsQuery);
  const contacts: Contact[] =
    contactsSnapshots?.map(snapshot => ({
      key: snapshot.key as string,
      ...snapshot.val(),
    })) || [];

  const groupsQuery = user ? query(ref(db, `users/${user.uid}/groups`)) : null;
  const [groupsSnapshots, groupsLoading] = useList(groupsQuery);
  const customGroups: TagInfo[] =
    groupsSnapshots?.map(snapshot => ({
      key: snapshot.key as string,
      ...snapshot.val(),
    })) || [];

  const availableTags = useMemo(() => [...defaultTags, ...customGroups.map(g => g.name)], [customGroups]);

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

    if (name && phone) {
      try {
        const userContactsRef = ref(db, `users/${user.uid}/contacts`);
        await push(userContactsRef, {
          name,
          phone,
          tags: selectedTags,
        });
        handleOpenChange(false);
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

  const handleAddGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const groupName = formData.get('groupName') as string;
    
    if (groupName && !availableTags.includes(groupName)) {
      try {
        const userGroupsRef = ref(db, `users/${user.uid}/groups`);
        await push(userGroupsRef, { name: groupName });
        toast({ title: 'Group Added', description: `The group "${groupName}" has been created.` });
        form.reset();
      } catch (error) {
        toast({ title: 'Error', description: 'Could not add group.', variant: 'destructive' });
      }
    } else if (availableTags.includes(groupName)) {
       toast({ title: 'Group Exists', description: `The group "${groupName}" already exists.`, variant: 'destructive' });
    }
  };
  
  const handleRemoveGroup = async (key: string) => {
    if (!user) return;
    try {
      await remove(ref(db, `users/${user.uid}/groups/${key}`));
      toast({ title: 'Group Removed', variant: 'destructive' });
    } catch (error) {
       toast({ title: 'Error', description: 'Could not remove group.', variant: 'destructive' });
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
  
  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags(prev => 
      checked ? [...prev, tag] : prev.filter(t => t !== tag)
    );
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setAddDialogOpen(isOpen);
    if (!isOpen) {
      const form = document.getElementById('add-contact-form') as HTMLFormElement;
      form?.reset();
      setSelectedTags([]);
    }
  };

  const isLoading = loading || userLoading || contactsLoading;

  return (
    <Card className="rounded-2xl shadow-lg h-full border-green-500/30">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="flex items-center gap-2 text-green-500">
                    <Heart className="h-5 w-5" />
                    Emergency Contacts
                </CardTitle>
                <CardDescription>
                    These contacts will be notified in an emergency.
                </CardDescription>
            </div>
            <Dialog open={isGroupsDialogOpen} onOpenChange={setGroupsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!user}>
                  <Settings2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                 <DialogHeader>
                  <DialogTitle>Manage Contact Groups</DialogTitle>
                  <DialogDescription>Add or remove custom contact groups.</DialogDescription>
                </DialogHeader>
                 <form onSubmit={handleAddGroup} className="flex items-center gap-2">
                  <Input name="groupName" placeholder="New group name" required />
                  <Button type="submit"><PlusCircle className="h-4 w-4" /></Button>
                </form>
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Custom Groups</h4>
                  {groupsLoading ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : customGroups.length > 0 ? (
                     customGroups.map(group => (
                        <div key={group.key} className="flex items-center justify-between rounded-md bg-muted p-2">
                          <span>{group.name}</span>
                           <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveGroup(group.key)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                     ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No custom groups yet.</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    {contact.tags?.map(tag => (
                       <Badge variant="secondary" key={tag}>
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove {contact.name} from your
                        emergency contacts.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveContact(contact.key)}
                      >
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
        <Dialog open={isAddDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="mt-6 w-full bg-green-500 text-white hover:bg-green-500/90"
              disabled={!user}
            >
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
            <form id="add-contact-form" onSubmit={handleAddContact}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="col-span-3"
                    required
                  />
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
                <div className="grid grid-cols-4 items-start gap-4 pt-2">
                  <Label className="text-right leading-snug">
                    Tags
                  </Label>
                   <div className="col-span-3 grid gap-2">
                     {groupsLoading &&  <Loader2 className="h-4 w-4 animate-spin" />}
                    {availableTags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2">
                        <Checkbox 
                          id={`tag-${tag}`}
                          onCheckedChange={(checked) => handleTagChange(tag, !!checked)}
                          checked={selectedTags.includes(tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="font-normal">{tag}</Label>
                      </div>
                    ))}
                  </div>
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
      setIsConnected(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className={cn(
        'rounded-2xl shadow-lg transition-colors duration-500',
        isConnected ? 'border-blue-500/30' : 'border-orange-500/30'
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center gap-2 transition-colors duration-500',
            isConnected ? 'text-blue-500' : 'text-orange-500'
          )}
        >
          <Shield className="h-5 w-5" />
          Helmet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-4 p-8">
        {isConnected ? (
          <>
            <Wifi className="h-8 w-8 text-blue-500" />
            <Badge
              variant="outline"
              className="border-blue-500/50 text-blue-500"
            >
              Connected
            </Badge>
          </>
        ) : (
          <>
            <WifiOff className="h-8 w-8 text-orange-500" />
            <Badge
              variant="outline"
              className="border-orange-500/50 text-orange-500"
            >
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
            <Button
              variant="destructive"
              size="lg"
              className="w-full h-16 text-lg"
            >
              TRIGGER ALERT
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately send an emergency alert with your location
                to all your emergency contacts.
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
