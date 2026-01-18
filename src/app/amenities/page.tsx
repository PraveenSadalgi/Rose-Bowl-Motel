import type { Metadata } from 'next';
import Image from 'next/image';
import { amenities } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Amenities',
  description: 'Explore the world-class amenities at Rose Bowl Motel.',
};

export default function AmenitiesPage() {
  return (
    <div>
      <PageHeader
        title="World-Class Amenities"
        subtitle="From relaxation to recreation, we provide an array of amenities to enrich your stay and ensure utmost comfort."
      />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <Card key={amenity.id} className="overflow-hidden view-animation" style={{ animationDelay: `${index * 100}ms`}}>
              <div className="relative h-48 w-full">
                <Image
                  src={getPlaceholderImage(amenity.image).imageUrl}
                  alt={amenity.name}
                  data-ai-hint={getPlaceholderImage(amenity.image).imageHint}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="flex-row items-center gap-4">
                <div className="bg-primary/20 text-primary p-3 rounded-full">
                  <amenity.icon className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline text-xl">{amenity.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{amenity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
