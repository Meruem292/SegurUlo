
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
  BookUser,
} from 'lucide-react';
import Link from 'next/link';
import { ref, query, onValue } from 'firebase/database';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import RouteSuggester from '../settings/RouteSuggester';

interface Contact {
  key: string;
  name: string;
  phone: string;
  tags?: string[];
}

function EmergencyContacts() {
  const [user, userLoading] = useAuthState(auth);
  
  const contactsQuery = user ? query(ref(db, `users/${user.uid}/contacts`)) : null;
  const [contactsSnapshots, contactsLoading] = useList(contactsQuery);
  const contacts: Contact[] =
    contactsSnapshots?.map(snapshot => ({
      key: snapshot.key as string,
      ...snapshot.val(),
    })) || [];

  const isLoading = userLoading || contactsLoading;

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
                    A quick look at your emergency contacts.
                </CardDescription>
            </div>
            <Button asChild variant="outline">
                <Link href="/contacts">
                    <BookUser className="mr-2 h-4 w-4" />
                    Manage Contacts
                </Link>
            </Button>
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
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No contacts found.
            </p>
          )}
        </div>
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
            <div className="lg:col-span-2">
              <RouteSuggester />
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
