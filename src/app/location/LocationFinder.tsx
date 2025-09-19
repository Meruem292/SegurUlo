
'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function LocationFinder() {
  const [coordinates, setCoordinates] = useState('');
  const [mapSrc, setMapSrc] = useState('');
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const [lat, long] = coordinates.split(',').map(c => c.trim());
    
    if (lat && long && !isNaN(Number(lat)) && !isNaN(Number(long))) {
      const embedUrl = `https://maps.google.com/maps?q=${lat},${long}&hl=es;z=14&t=k&output=embed`;
      setMapSrc(embedUrl);
    } else {
      toast({
        title: 'Invalid Coordinates',
        description: 'Please enter coordinates in the format "latitude, longitude".',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Find a Location
        </CardTitle>
        <CardDescription>
            Enter latitude and longitude to display the location on the map.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4 mb-6">
            <div className="w-full">
              <Label htmlFor="coordinates">Coordinates (lat, long)</Label>
              <Input
                  id="coordinates"
                  type="text"
                  placeholder="e.g., 14.310614, 120.962985"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Search</Button>
        </form>
        {mapSrc && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
