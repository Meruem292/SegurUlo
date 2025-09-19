
'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  Bike,
  Sparkles,
  Loader2,
  Map,
  Mountain,
  MapPin,
} from 'lucide-react';
import {
  getRouteSuggestions,
  type RouteSuggestionsOutput,
} from '@/ai/flows/route-suggestions';
import { generateImage } from '@/ai/flows/generate-image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const terrains = [
  'Road',
  'Gravel',
  'Singletrack',
  'Mixed-terrain (dirt + pavement)',
];
const disciplines = [
  'Mountain biking (general)',
  'Bikepacking (multi-day on dirt or varied surfaces)',
  'Cycle touring (road-focused, longer rides)',
  'BMX (stunts, park, jumps)',
  'Cross-country (XC – endurance trail riding)',
  'Downhill (steep, descending mountain biking)',
];

type RouteSuggestion = RouteSuggestionsOutput['routes'][number];
interface RouteSuggestionWithImage extends RouteSuggestion {
  imageUrl?: string;
}

export default function RouteSuggester() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedTerrains, setSelectedTerrains] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<
    RouteSuggestionWithImage[]
  >([]);

  const handleCheckboxChange = (
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const getLocation = () => {
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsFetchingLocation(false);
        toast({
          title: 'Location Acquired',
          description: 'Your current location has been successfully fetched.',
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsFetchingLocation(false);
        toast({
          title: 'Location Error',
          description: `Could not get your location: ${error.message}`,
          variant: 'destructive',
        });
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast({
        title: 'Location Missing',
        description: 'Please allow location access first.',
        variant: 'destructive',
      });
      return;
    }
    if (selectedTerrains.length === 0 && selectedDisciplines.length === 0) {
      toast({
        title: 'Preferences Missing',
        description: 'Please select at least one terrain or discipline.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        setSuggestions([]); // Clear previous suggestions
        const result = await getRouteSuggestions({
          ...location,
          terrains: selectedTerrains,
          disciplines: selectedDisciplines,
        });
        
        // Set suggestions without images first for a faster UI update
        const initialSuggestions = result.routes.map(route => ({...route, imageUrl: undefined}));
        setSuggestions(initialSuggestions);

        // Fetch images one by one
        for (const [index, route] of result.routes.entries()) {
            try {
                const imageResult = await generateImage({ prompt: route.imagePrompt });
                setSuggestions(prev => {
                    const newSuggestions = [...prev];
                    newSuggestions[index].imageUrl = imageResult.imageUrl;
                    return newSuggestions;
                });
            } catch (imageError) {
                 console.error(`Failed to generate image for "${route.name}":`, imageError);
                 // Optionally update the UI to show a placeholder for the failed image
            }
        }
        
      } catch (error) {
        console.error('Failed to get route suggestions:', error);
        toast({
          title: 'AI Suggestion Error',
          description: 'Could not fetch route suggestions. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bike className="h-6 w-6 text-primary" />
              AI Route Suggestions
            </CardTitle>
            <CardDescription>
              Find your next adventure. Select your preferences, and let our AI
              recommend the perfect cycling routes near you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                Step 1: Your Location
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We need your location to find the best routes nearby.
              </p>
              <Button
                type="button"
                onClick={getLocation}
                disabled={isFetchingLocation}
                variant="outline"
              >
                {isFetchingLocation && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {location ? 'Location Acquired' : 'Get My Location'}
              </Button>
               {location && (
                <p className="text-xs text-muted-foreground mt-2">
                    Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Mountain className="h-5 w-5" />
                Step 2: Ride Preferences
              </h3>
              <div>
                <Label className="font-medium">By Terrain</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {terrains.map((terrain) => (
                    <div key={terrain} className="flex items-center gap-2">
                      <Checkbox
                        id={`terrain-${terrain}`}
                        checked={selectedTerrains.includes(terrain)}
                        onCheckedChange={() =>
                          handleCheckboxChange(
                            selectedTerrains,
                            setSelectedTerrains,
                            terrain
                          )
                        }
                      />
                      <Label htmlFor={`terrain-${terrain}`} className="font-normal">{terrain}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="font-medium">By Discipline</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {disciplines.map((discipline) => (
                    <div key={discipline} className="flex items-center gap-2">
                      <Checkbox
                        id={`discipline-${discipline}`}
                        checked={selectedDisciplines.includes(discipline)}
                        onCheckedChange={() =>
                          handleCheckboxChange(
                            selectedDisciplines,
                            setSelectedDisciplines,
                            discipline
                          )
                        }
                      />
                      <Label htmlFor={`discipline-${discipline}`} className="font-normal">{discipline}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Suggest Routes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && (
        <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
                <Card key={i} className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-28 w-full rounded-lg" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Map className="h-6 w-6 text-accent" />
                Your AI-Powered Route Recommendations
            </h2>
          {suggestions.map((route, index) => (
            <Card key={index} className="rounded-2xl shadow-lg overflow-hidden animate-in fade-in-50 duration-500">
                <CardHeader className="p-0">
                  {route.imageUrl ? (
                     <div className="aspect-video relative w-full">
                        <Image
                            src={route.imageUrl}
                            alt={route.name}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                     </div>
                  ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                    <CardTitle>{route.name}</CardTitle>
                    <CardDescription className="mt-4 whitespace-pre-wrap">{route.description}</CardDescription>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
