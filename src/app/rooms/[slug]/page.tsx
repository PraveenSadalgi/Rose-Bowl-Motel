'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { rooms, amenities as allAmenities } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Users, BedDouble, Square, Check, ArrowLeft } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import type { Room } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import BookingDialog from '@/components/BookingDialog';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay";
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<any>(null);

  // Ensure params.slug exists before proceeding
  const slug = params?.slug as string;
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
    });

    if (!slug) {
      router.push('/rooms');
      return;
    }

    const foundRoom = rooms.find((r) => r.slug === slug);
    if (foundRoom) {
      setRoom(foundRoom);
    } else {
      router.push('/rooms');
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [slug, router]); // Using slug instead of params.slug

  const handleReserveClick = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in or sign up to book a room.',
        variant: 'destructive',
      });
      router.push('/auth/signup');
    } else {
      setIsBookingDialogOpen(true);
    }
  };

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Rooms
            </Link>
          </Button>
        </div>
        <div className="w-full h-[50vh] mb-8">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const roomAmenities = allAmenities.filter((amenity) =>
    room.amenities.includes(amenity.name.toLowerCase().replace(/ /g, '-'))
  );

  return (
    <div>
      <div className="relative">
        <Carousel
          className="w-full"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-0">
            {room.images.map((imgId, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="h-screen w-full relative">
                  <Image
                    src={getPlaceholderImage(imgId).imageUrl}
                    alt={`${room.name} - Image ${index + 1}`}
                    data-ai-hint={getPlaceholderImage(imgId).imageHint}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 text-white z-10 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container mx-auto px-4">
            <div className="lg:w-1/2">
              <h1 className="font-headline text-4xl md:text-6xl font-bold">{room.name}</h1>
              <p className="mt-4 text-lg max-w-2xl text-balance">{room.longDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/rooms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Rooms
            </Link>
          </Button>
        </div>
        <div className="grid lg:grid-cols-3 gap-x-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-headline font-semibold mb-6">Room Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-muted-foreground border-y py-6">
              <div className='flex items-center gap-3 text-lg'>
                <BedDouble className="w-8 h-8 text-primary" />
                <div>
                  <div className='text-sm font-bold text-foreground'>Bed Type</div>
                  <span>King</span>
                </div>
              </div>
              <div className='flex items-center gap-3 text-lg'>
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <div className='text-sm font-bold text-foreground'>Capacity</div>
                  <span>Up to {room.capacity} guests</span>
                </div>
              </div>
              <div className='flex items-center gap-3 text-lg'>
                <Square className="w-8 h-8 text-primary" />
                <div>
                  <div className='text-sm font-bold text-foreground'>Room Size</div>
                  <span>{room.sqft} sq ft</span>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-headline font-semibold mb-6">Room Amenities</h2>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                {roomAmenities.map(amenity => (
                  <li key={amenity.id} className="flex items-center gap-3 text-lg">
                    <Check className="w-6 h-6 text-primary p-1 bg-primary/10 rounded-full" />
                    <span>{amenity.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row-start-1 lg:row-auto lg:mt-[-250px] z-20">
            <Card className="shadow-2xl sticky top-24">
              <CardContent className="p-8">
                <p className="text-muted-foreground">Price per night</p>
                <p><span className="text-5xl font-bold">₹{room.price.toLocaleString('en-IN')}</span></p>
                <Button size="lg" className="w-full mt-6 text-lg py-7" onClick={handleReserveClick}>
                  Reserve this room
                </Button>
                <Separator className='my-6' />
                <ul className='space-y-4'>
                  <li className="flex items-center gap-3 text-base text-muted-foreground">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Free cancellation</span>
                  </li>
                  <li className="flex items-center gap-3 text-base text-muted-foreground">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>No prepayment needed</span>
                  </li>
                  <li className="flex items-center gap-3 text-base text-muted-foreground">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Best price guarantee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BookingDialog
        room={room}
        isOpen={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
      />
    </div>
  );
}
