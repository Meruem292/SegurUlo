'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  PlusCircle,
  Trash2,
  Loader2,
  Tag,
  Users,
  Save,
  Pencil,
  X,
  BookUser,
} from 'lucide-react';
import { ref, push, remove, query, onValue, set, update } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useList } from 'react-firebase-hooks/database';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

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

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  phone: z.string().regex(/^09\d{9}$/, 'Phone number must be in the format 09123456789.'),
  tags: z.array(z.string()).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactsManager() {
  const [user, userLoading] = useAuthState(auth);
  const { toast } = useToast();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isGroupsDialogOpen, setGroupsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (editingContact) {
      form.reset({
        name: editingContact.name,
        phone: editingContact.phone,
        tags: editingContact.tags || [],
      });
      setAddDialogOpen(true);
    } else {
      form.reset({ name: '', phone: '', tags: [] });
    }
  }, [editingContact, form]);
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingContact(null);
    }
    setAddDialogOpen(isOpen);
  };

  const onSubmit = async (data: ContactFormValues) => {
    if (!user) return;
    
    try {
      if (editingContact) {
        // Update existing contact
        const contactRef = ref(db, `users/${user.uid}/contacts/${editingContact.key}`);
        await update(contactRef, data);
        toast({ title: 'Contact Updated', description: `${data.name} has been updated.` });
      } else {
        // Add new contact
        const userContactsRef = ref(db, `users/${user.uid}/contacts`);
        await push(userContactsRef, data);
        toast({ title: 'Contact Added', description: `${data.name} has been added.` });
      }
      handleOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: 'There was a problem saving the contact.', variant: 'destructive' });
    }
  };

  const handleRemoveContact = async (key: string) => {
    if (!user) return;
    try {
      await remove(ref(db, `users/${user.uid}/contacts/${key}`));
      toast({ title: 'Contact Removed', variant: 'destructive' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not remove contact.', variant: 'destructive' });
    }
  };
  
  const handleAddGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const groupName = formData.get('groupName') as string;
    
    if (groupName && !availableTags.includes(groupName)) {
      try {
        const userGroupsRef = ref(db, `users/${user.uid}/groups`);
        await push(userGroupsRef, { name: groupName });
        toast({ title: 'Group Added', description: `The group "${groupName}" has been created.` });
        formEl.reset();
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

  const isLoading = userLoading || contactsLoading || groupsLoading;
  
  return (
    <Card className="rounded-2xl shadow-lg">
       <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookUser className="h-6 w-6" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>
            Add, edit, and organize the contacts to be notified in an emergency.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Dialog open={isGroupsDialogOpen} onOpenChange={setGroupsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!user}>
                  <Tag className="mr-2 h-4 w-4" />
                  Manage Groups
                </Button>
              </DialogTrigger>
              <DialogContent>
                 <DialogHeader>
                  <DialogTitle>Manage Contact Groups</DialogTitle>
                  <DialogDescription>Add or remove custom contact groups.</DialogDescription>
                </DialogHeader>
                 <form onSubmit={handleAddGroup} className="flex items-center gap-2">
                  <Input name="groupName" placeholder="New group name" required />
                  <Button type="submit" size="icon"><PlusCircle className="h-4 w-4" /></Button>
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
           <Dialog open={isAddDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button disabled={!user} className="bg-primary hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Contact
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
                    <DialogDescription>
                        {editingContact ? 'Update the details for this contact.' : 'Enter the name, phone number, and any relevant groups.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <Label>Full Name</Label>
                                <FormControl>
                                    <Input placeholder="e.g. Jane Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <Label>Phone Number</Label>
                                <FormControl>
                                    <Input type="tel" placeholder="09123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                          control={form.control}
                          name="tags"
                          render={() => (
                            <FormItem>
                                <Label>Groups</Label>
                                <div className="grid grid-cols-2 gap-2 rounded-md border p-4">
                                {availableTags.map((tag) => (
                                    <FormField
                                    key={tag}
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(tag)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), tag])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                            (value) => value !== tag
                                                        )
                                                        )
                                                }}
                                                />
                                            </FormControl>
                                            <Label className="font-normal">{tag}</Label>
                                        </FormItem>
                                    )}
                                    />
                                ))}
                                {groupsLoading && <Loader2 className="col-span-2 h-4 w-4 animate-spin" />}
                                </div>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingContact ? 'Save Changes' : 'Save Contact'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
           </Dialog>
        </div>
      </CardHeader>
      <CardContent>
         <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : contacts.length > 0 ? (
            <div className="divide-y rounded-md border">
              {contacts.map(contact => (
              <div
                key={contact.key}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Users className="h-5 w-5" />
                    </div>
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
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingContact(contact)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">No contacts found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new emergency contact.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
