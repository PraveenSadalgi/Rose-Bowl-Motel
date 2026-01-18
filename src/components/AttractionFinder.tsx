'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getAttractionDecision } from '@/app/actions';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Loader2, Sparkles, Building, Utensils, Landmark } from 'lucide-react';
import type { ShouldAddNearbyAttractionsOutput } from '@/ai/flows/decide-nearby-attractions';

const initialState: ShouldAddNearbyAttractionsOutput & { message?: string } = {
  includeAttractions: false,
};

const attractions = [
    { name: 'Rose Bowl Stadium', category: 'Landmark', icon: Landmark },
    { name: 'The Gamble House', category: 'Architecture', icon: Building },
    { name: 'Old Pasadena', category: 'Dining & Shopping', icon: Utensils },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className='w-full'>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Ask AI
    </Button>
  );
}

export function AttractionFinder() {
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const preference = formData.get('attractions-toggle') === 'on' 
      ? "Yes, I'd like to see attractions" 
      : "No, just show me the map";
    return getAttractionDecision(preference);
  }, initialState);
  
  const [toggle, setToggle] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Nearby Attractions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="attractions-toggle" name="attractions-toggle" checked={toggle} onCheckedChange={setToggle} />
            <Label htmlFor="attractions-toggle">Show me nearby points of interest</Label>
          </div>
          <SubmitButton />
        </form>

        {state.includeAttractions && (
          <div className="border-t pt-4 mt-4 space-y-4">
            <h3 className="font-semibold">Our AI suggests these attractions:</h3>
            <ul className="space-y-3">
              {attractions.map(attraction => {
                const Icon = attraction.icon;
                return (
                  <li key={attraction.name} className="flex items-center gap-3 p-2 bg-secondary/50 rounded-md">
                    <Icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{attraction.name}</p>
                      <p className="text-sm text-muted-foreground">{attraction.category}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
