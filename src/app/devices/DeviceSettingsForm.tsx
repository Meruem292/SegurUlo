'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Smartphone, Save } from 'lucide-react';

const formSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required.'),
  deviceContact: z.string().min(10, 'Please enter a valid phone number.'),
  gpsSmsInterval: z.number().min(0).max(60),
  gpsWebInterval: z.number().min(0).max(60),
  alertContactTag: z.string().optional(),
});

type DeviceSettingsFormValues = z.infer<typeof formSchema>;

export default function DeviceSettingsForm() {
  const { toast } = useToast();
  const form = useForm<DeviceSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceId: '',
      deviceContact: '',
      gpsSmsInterval: 15,
      gpsWebInterval: 5,
      alertContactTag: 'all',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: DeviceSettingsFormValues) => {
    // This is a prototype, so we'll just simulate a save.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log(data);
    
    toast({
      title: 'Settings Saved',
      description: 'Your device settings have been successfully updated.',
    });
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Smartphone />
            Register & Configure Device
        </CardTitle>
        <CardDescription>
          Set up your smart helmet and its alert preferences here.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the ID found on your device" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deviceContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Contact Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., +1234567890" {...field} />
                  </FormControl>
                   <FormDescription>
                    The phone number associated with the device's SIM card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="gpsSmsInterval"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Periodic GPS SMS Interval (minutes)</FormLabel>
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
                        Time between automatic GPS location updates via SMS. 0 to disable.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="gpsWebInterval"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Periodic GPS Web Record Interval (minutes)</FormLabel>
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
                        Time between automatic GPS location records to the web service. 0 to disable.
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
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact group to alert" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Emergency Contacts</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Close Friend">Close Friends</SelectItem>
                      <SelectItem value="custom">Custom Tag...</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select which group of emergency contacts should receive alerts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Settings
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
