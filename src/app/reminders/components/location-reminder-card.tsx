'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BellRing, Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LocationReminderCard() {
  const [needs, setNeeds] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reminder, setReminder] = useState<{ reminder: string; isRelevant: boolean } | null>(null);
  const { toast } = useToast();

  const handleGetReminder = () => {
    if (!needs) {
      toast({
        variant: 'destructive',
        title: 'Input needed',
        description: 'Please tell me what you need to do.',
      });
      return;
    }

    setIsLoading(true);
    setReminder(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch('/api/ai/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userLocation: { latitude, longitude },
              userNeeds: needs,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch reminder from API');
          }
          
          const result = await response.json();
          setReminder(result);
        } catch (error) {
          console.error('Failed to get reminder:', error);
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'Could not generate a reminder.',
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not get your location. Please enable location services.',
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Location-Based Reminder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
            <label htmlFor="needs" className="text-sm font-medium">What do you need to do?</label>
            <Input
                id="needs"
                placeholder="e.g., buy vegetables, pick up dry cleaning"
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                disabled={isLoading}
            />
        </div>
        <Button onClick={handleGetReminder} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Remind Me When I'm Out
            </>
          )}
        </Button>
        {reminder && (
          <Alert variant={reminder.isRelevant ? 'success' : 'destructive'}>
            <BellRing className="h-4 w-4" />
            <AlertTitle>Smart Reminder</AlertTitle>
            <AlertDescription>{reminder.reminder}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
