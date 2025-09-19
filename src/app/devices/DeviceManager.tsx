'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  PlusCircle,
  Trash2,
  Loader2,
  Save,
  Pencil,
  Smartphone,
  Users,
  User,
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Device {
  key: string;
  deviceId: string;
  gpsSmsInterval: number;
  alertContactTag: string;
}

interface TagInfo {
  key: string;
  name: string;
}

interface Contact {
    key: string;
    name: string;
    phone: string;
    tags?: string[];
}

const defaultTags = ['Family', 'Close Friend', 'Friend'];

const deviceFormSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required.'),
  gpsSmsInterval: z.number().min(0).max(60),
  alertContactTag: z.string().optional(),
});

type DeviceFormValues = z.infer<typeof deviceFormSchema>;

function DeviceForm({ device, onSave, devices }: { device?: Device | null, onSave: () => void, devices: Device[] }) {
    const [user] = useAuthState(auth);
    const { toast } = useToast();

    const groupsQuery = user ? query(ref(db, `users/${user.uid}/groups`)) : null;
    const [groupsSnapshots, groupsLoading] = useList(groupsQuery);
    const customGroups: TagInfo[] =
        groupsSnapshots?.map(snapshot => ({
        key: snapshot.key as string,
        ...snapshot.val(),
        })) || [];
    
    const availableTags = useMemo(() => [...defaultTags, ...customGroups.map(g => g.name)], [customGroups]);

    const contactsQuery = user ? query(ref(db, `users/${user.uid}/contacts`)) : null;
    const [contactSnapshots, contactsLoading] = useList(contactsQuery);
    const allContacts: Contact[] = useMemo(() =>
        contactSnapshots?.map(snapshot => ({
        key: snapshot.key as string,
        ...snapshot.val(),
        })) || [], [contactSnapshots]);


    const form = useForm<DeviceFormValues>({
        resolver: zodResolver(deviceFormSchema),
        defaultValues: device ? {
            deviceId: device.deviceId,
            gpsSmsInterval: device.gpsSmsInterval,
            alertContactTag: device.alertContactTag || 'all',
        } : {
            deviceId: '',
            gpsSmsInterval: 15,
            alertContactTag: 'all',
        },
    });

    const alertContactTag = form.watch('alertContactTag');

    const filteredContacts = useMemo(() => {
        if (!alertContactTag || alertContactTag === 'all') {
        return allContacts;
        }
        return allContacts.filter(contact => contact.tags?.includes(alertContactTag));
    }, [allContacts, alertContactTag]);


    useEffect(() => {
        form.reset(device ? {
            deviceId: device.deviceId,
            gpsSmsInterval: device.gpsSmsInterval,
            alertContactTag: device.alertContactTag || 'all',
        } : {
            deviceId: '',
            gpsSmsInterval: 15,
            alertContactTag: 'all',
        });
    }, [device, form]);

    const onSubmit = async (data: DeviceFormValues) => {
        if (!user) return;
        try {
            if (device) {
                // Update
                const deviceRef = ref(db, `users/${user.uid}/devices/${device.key}`);
                await update(deviceRef, data);
                toast({ title: 'Device Updated', description: `Device ${data.deviceId} has been updated.` });
            } else {
                // Create
                const isDuplicate = devices.some(d => d.deviceId === data.deviceId);
                if (isDuplicate) {
                    toast({
                        title: 'Device Exists',
                        description: `A device with the ID "${data.deviceId}" is already registered.`,
                        variant: 'destructive',
                    });
                    return;
                }
                const userDevicesRef = ref(db, `users/${user.uid}/devices`);
                await push(userDevicesRef, data);
                toast({ title: 'Device Added', description: `Device ${data.deviceId} has been registered.` });
            }
            onSave();
        } catch (error) {
            toast({ title: 'Error', description: 'There was an error saving the device.', variant: 'destructive' });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="deviceId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Device ID</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter the ID found on your device" {...field} disabled={!!device} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gpsSmsInterval"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Periodic GPS SMS Interval (seconds)</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                                <Slider
                                    min={0}
                                    max={60}
                                    step={5}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                />
                                <span className="w-12 text-center font-mono text-lg">{field.value}</span>
                            </div>
                        </FormControl>
                        <FormDescription>
                            Time between automatic GPS location updates via SMS when EMERGENCY.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="alertContactTag"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Alert Contact Group</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a contact group to alert" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="all">All Emergency Contacts</SelectItem>
                            {availableTags.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            Select which group of emergency contacts should receive alerts.
                            {groupsLoading && <Loader2 className="inline-block ml-2 h-4 w-4 animate-spin" />}
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                    <h4 className="flex items-center font-semibold">
                        <Users className="mr-2 h-5 w-5" />
                        Contacts in Selected Group ({filteredContacts.length})
                    </h4>
                    {contactsLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredContacts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                        {filteredContacts.map(contact => (
                            <div key={contact.key} className="flex items-center gap-3 rounded-md bg-background p-3 shadow-sm">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">{contact.name}</p>
                                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">
                        No contacts found with the selected tag.
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {device ? 'Save Changes' : 'Register Device'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}


export default function DeviceManager() {
  const [user, userLoading] = useAuthState(auth);
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const devicesQuery = user ? query(ref(db, `users/${user.uid}/devices`)) : null;
  const [devicesSnapshots, devicesLoading] = useList(devicesQuery);
  const devices: Device[] =
    devicesSnapshots?.map(snapshot => ({
      key: snapshot.key as string,
      ...snapshot.val(),
    })) || [];
    
  const isLoading = userLoading || devicesLoading;

  const handleEditClick = (device: Device) => {
    setEditingDevice(device);
    setFormOpen(true);
  };
  
  const handleAddNewClick = () => {
    setEditingDevice(null);
    setFormOpen(true);
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
        setEditingDevice(null);
    }
    setFormOpen(isOpen);
  };

  const handleRemoveDevice = async (key: string) => {
    if (!user) return;
    try {
      await remove(ref(db, `users/${user.uid}/devices/${key}`));
      toast({ title: 'Device Removed', variant: 'destructive' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not remove device.', variant: 'destructive' });
    }
  };
  
  return (
    <Card className="rounded-2xl shadow-lg">
       <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            Registered Devices
          </CardTitle>
          <CardDescription>
            Add, edit, and manage your smart helmets.
          </CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button disabled={!user} onClick={handleAddNewClick} className="bg-primary hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register Device
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <ScrollArea className="max-h-[80vh] p-6">
                <DialogHeader className="pr-6">
                    <DialogTitle>{editingDevice ? 'Edit Device' : 'Register New Device'}</DialogTitle>
                    <DialogDescription>
                        {editingDevice ? 'Update the settings for this device.' : 'Enter the ID and configure your new device.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="pr-6">
                 <DeviceForm device={editingDevice} onSave={() => setFormOpen(false)} devices={devices} />
                </div>
              </ScrollArea>
            </DialogContent>
           </Dialog>
      </CardHeader>
      <CardContent>
         <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : devices.length > 0 ? (
            <div className="divide-y rounded-md border">
              {devices.map(device => (
              <div
                key={device.key}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium">{device.deviceId}</p>
                        <p className="text-sm text-muted-foreground">
                            Alert Group: {device.alertContactTag || 'All'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(device)}>
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
                            This will permanently remove device {device.deviceId} from your account.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleRemoveDevice(device.key)}
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
                <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">No devices found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by registering a new device.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
