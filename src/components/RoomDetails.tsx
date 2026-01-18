'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BedDouble, Users, Square } from 'lucide-react';
import type { Room } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { amenities } from '@/lib/data';

interface RoomDetailsProps {
  room: Room;
  reverse?: boolean;
}

export function RoomDetails({ room, reverse = false }: RoomDetailsProps) {
    const roomAmenities = amenities
    .filter(amenity => amenity.name && room.amenities.includes(amenity.name.toLowerCase().replace(/ /g, '-')))
    .slice(0, 6);


  return (
    <div className={cn("grid md:grid-cols-2 gap-12 items-center view-animation")}>
      <div className={cn("overflow-hidden rounded-lg", reverse && "md:order-2")}>
        <Image
          src={getPlaceholderImage(room.images[0]).imageUrl}
          alt={room.name}
          data-ai-hint={getPlaceholderImage(room.images[0]).imageHint}
          width={800}
          height={600}
          className="w-full object-cover aspect-[4/3] transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className={cn(reverse && "md:order-1")}>
        <h2 className="font-headline text-4xl font-bold">{room.name}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{room.longDescription}</p>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5" />
            <span>King Bed</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Up to {room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5" />
            <span>{room.sqft} sq ft</span>
          </div>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-semibold tracking-wider uppercase text-muted-foreground mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-2">
                {roomAmenities.map(amenity => (
                    <Badge key={amenity.id} variant="secondary" className='font-normal'>{amenity.name}</Badge>
                ))}
            </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p><span className="text-3xl font-bold">₹{room.price.toLocaleString('en-IN')}</span><span className="text-muted-foreground">/night</span></p>
            </div>
          <Button asChild size="lg">
            <Link href={`/rooms/${room.slug}`}>
              View Details <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
