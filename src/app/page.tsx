import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BedDouble,
  Calendar,
  GalleryVertical,
  Star,
  Wifi,
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { testimonials, featuredRooms } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <VideoPlayer 
            src="/videos/1188-143842652_medium.mp4" 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-balance animate-rise-up" style={{ animationDelay: '0.2s' }}>
            Welcome to <i>Rose Bowl Motel</i>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-balance animate-rise-up" style={{ animationDelay: '0.4s' }}>
            Where timeless elegance meets modern comfort. Experience exceptional hospitality in our beautifully appointed accommodations.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 animate-rise-up text-lg px-12 py-6" style={{ animationDelay: '0.6s' }}>
            <Link href="/rooms">
              Explore Our Rooms <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold mb-4">An Unforgettable Retreat Awaits</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground text-lg text-balance">
            Nestled in a serene landscape, Rose Bowl Motel offers a perfect blend of timeless charm and contemporary comfort. Our commitment to exceptional service ensures that every moment of your stay is nothing short of perfect.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 view-animation">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Featured Rooms</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              {featuredRooms.map((room) => (
                <Link href={`/rooms/${room.slug}`} key={room.id} className="group">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={getPlaceholderImage(room.images[0]).imageUrl}
                      alt={room.name}
                      data-ai-hint={getPlaceholderImage(room.images[0]).imageHint}
                      width={400}
                      height={300}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold mt-3">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">₹{room.price.toLocaleString('en-IN')} / night</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="relative flex flex-col justify-between overflow-hidden view-animation min-h-[400px]">
             <Image
              src={getPlaceholderImage('amenities-pool').imageUrl}
              alt="Hotel swimming pool"
              data-ai-hint="hotel swimming pool"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative flex flex-col justify-end h-full p-6 text-white">
              <CardTitle className="font-headline text-2xl">Exquisite Amenities</CardTitle>
              <p className="mt-2 text-sm">From our tranquil spa to the state-of-the-art fitness center, every detail is designed for your comfort.</p>
              <Button variant="secondary" asChild className="mt-4 w-fit">
                <Link href="/amenities">Explore More</Link>
              </Button>
            </div>
          </Card>

          <Card className="relative flex flex-col justify-between overflow-hidden view-animation min-h-[400px]">
            <Image
              src={getPlaceholderImage('gallery-lobby').imageUrl}
              alt="Elegant hotel lobby"
              data-ai-hint="elegant hotel lobby"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative flex flex-col justify-end h-full p-6 text-white">
              <CardTitle className="font-headline text-2xl">Visual Journey</CardTitle>
              <p className="mt-2 text-sm">Step into a world of elegance. Browse our gallery to see what makes our hotel special.</p>
               <Button variant="secondary" asChild className="mt-4 w-fit">
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-3 view-animation">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">What Our Guests Say</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-4">
                        <Card className="h-full flex flex-col justify-between">
                          <CardContent className="p-6">
                            <div className="flex mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-primary fill-current' : 'text-muted'}`} />
                              ))}
                            </div>
                            <p className="italic">"{testimonial.comment}"</p>
                          </CardContent>
                          <CardHeader className="flex flex-row items-center gap-4 pt-0">
                            <Avatar>
                              <AvatarImage src={getPlaceholderImage(testimonial.avatar).imageUrl} alt={testimonial.name} data-ai-hint={getPlaceholderImage(testimonial.avatar).imageHint}/>
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{testimonial.name}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
