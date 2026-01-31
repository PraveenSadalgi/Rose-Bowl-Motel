'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
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
import { testimonials, featuredRooms, rooms } from '@/lib/data';
import Autoplay from 'embla-carousel-autoplay';


import { getPlaceholderImage } from '@/lib/placeholder-images';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { Reveal } from '@/components/ui/Reveal';
import { RoomCard } from '@/components/ui/RoomCard';

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <Reveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-balance drop-shadow-lg tracking-tight">
              Welcome to <span className="text-primary-foreground/90 italic">Rose Bowl Motel</span>
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-balance drop-shadow-md font-light tracking-wide opacity-90">
              Where timeless elegance meets modern comfort. Experience exceptional hospitality in our beautifully appointed accommodations.
            </p>
          </Reveal>

          <Reveal delay={0.6}>
            <Button asChild size="lg" className="mt-10 bg-primary hover:bg-primary/90 text-white border-2 border-primary/20 bg-primary/80 backdrop-blur-sm text-lg px-12 py-7 h-auto rounded-full shadow-xl hover:scale-105 transition-all duration-300">
              <Link href="/rooms">
                Explore Our Rooms <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 md:py-32 bg-background pattern-grid-lg">
        <div className="container mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6 text-foreground">An Unforgettable Retreat Awaits</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-3xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed text-balance">
              Nestled in a serene landscape, Rose Bowl Motel offers a perfect blend of timeless charm and contemporary comfort. Our commitment to exceptional service ensures that every moment of your stay is nothing short of perfect.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="container mx-auto px-4 pb-12">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-2">Featured Rooms</h2>
              <p className="text-muted-foreground">Select from our most popular accommodations</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex gap-2 group">
              <Link href="/rooms">
                View All Rooms <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.slice(0, 3).map((room, index) => (
            <Reveal key={room.id} delay={index * 0.1}>
              <div className="h-[450px]">
                <RoomCard room={room} />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Button variant="outline" asChild className="w-full">
            <Link href="/rooms">View All Rooms</Link>
          </Button>
        </div>
      </section>

      {/* Amenities & Gallery Highlights */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[500px]">
          <Reveal width="100%" delay={0.2} className="h-[400px] lg:h-full">
            <Card className="relative flex flex-col justify-between overflow-hidden h-full border-none shadow-xl group cursor-pointer">
              <Image
                src={getPlaceholderImage('amenities-pool').imageUrl}
                alt="Hotel swimming pool"
                data-ai-hint="hotel swimming pool"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative flex flex-col justify-end h-full p-8 text-white z-10">
                <CardTitle className="font-headline text-3xl md:text-4xl mb-3 translate-y-2 group-hover:translate-y-0 transition-transform">Exquisite Amenities</CardTitle>
                <p className="text-lg text-white/90 mb-8 max-w-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  From our tranquil spa to the state-of-the-art fitness center, every detail is designed for your comfort.
                </p>
                <Button variant="outline" asChild className="w-fit border-white text-white hover:bg-white hover:text-black bg-transparent">
                  <Link href="/amenities">Explore Amenities</Link>
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal width="100%" delay={0.3} className="h-[400px] lg:h-full">
            <Card className="relative flex flex-col justify-between overflow-hidden h-full border-none shadow-xl group cursor-pointer">
              <Image
                src={getPlaceholderImage('gallery-lobby').imageUrl}
                alt="Elegant hotel lobby"
                data-ai-hint="elegant hotel lobby"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative flex flex-col justify-end h-full p-8 text-white z-10">
                <CardTitle className="font-headline text-3xl md:text-4xl mb-3 translate-y-2 group-hover:translate-y-0 transition-transform">Visual Journey</CardTitle>
                <p className="text-lg text-white/90 mb-8 max-w-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Step into a world of elegance. Browse our gallery to see what makes our hotel special.
                </p>
                <Button variant="outline" asChild className="w-fit border-white text-white hover:bg-white hover:text-black bg-transparent">
                  <Link href="/gallery">View Gallery</Link>
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-6xl font-bold mb-6 text-foreground">Our Story</h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                A legacy of hospitality, elegance, and unforgettable experiences spanning decades
              </p>
            </div>
          </Reveal>

          {/* Story Timeline */}
          <div className="max-w-6xl mx-auto space-y-24">
            {/* Story Item 1 - Heritage */}
            <Reveal delay={0.2}>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                      src="/neon-wang-kfnWOD1Tbp8-unsplash.jpg"
                      alt="Rose Bowl Motel Heritage"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>
                <div className="order-1 md:order-2 space-y-4">
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                    <span className="text-primary font-semibold text-sm">Since 1985</span>
                  </div>
                  <h3 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    A Heritage of Excellence
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    For over three decades, Rose Bowl Motel has been a beacon of hospitality and comfort.
                    What started as a small family-owned establishment has grown into a beloved destination,
                    while never losing sight of our core values: warmth, elegance, and genuine care for every guest.
                  </p>
                  <div className="flex gap-8 pt-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">35+</div>
                      <div className="text-sm text-muted-foreground">Years of Service</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">50K+</div>
                      <div className="text-sm text-muted-foreground">Happy Guests</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">98%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Story Item 2 - Philosophy */}
            <Reveal delay={0.3}>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                    <span className="text-primary font-semibold text-sm">Our Philosophy</span>
                  </div>
                  <h3 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    Where Luxury Meets Heart
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We believe that true luxury isn't just about opulent surroundings—it's about creating
                    moments that matter. Every detail, from our carefully curated interiors to our attentive
                    service, is designed to make you feel not just welcomed, but truly at home.
                  </p>
                  <ul className="space-y-3 pt-4">
                    {[
                      'Personalized service tailored to your needs',
                      'Sustainable practices for a better tomorrow',
                      'Local experiences that connect you to our community',
                      'Unwavering commitment to your comfort and safety'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                      src="/neon-wang-vEO-8ck28fY-unsplash.jpg"
                      alt="Rose Bowl Motel Philosophy"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Story Item 3 - Future */}
            <Reveal delay={0.4}>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                      src={getPlaceholderImage('rooftop-lounge').imageUrl}
                      alt="Rose Bowl Motel Future"
                      data-ai-hint="modern hotel rooftop lounge"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>
                <div className="order-1 md:order-2 space-y-4">
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                    <span className="text-primary font-semibold text-sm">Looking Ahead</span>
                  </div>
                  <h3 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                    Building Tomorrow's Memories
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    As we look to the future, our commitment remains unchanged: to create extraordinary
                    experiences that become cherished memories. We're constantly evolving, embracing
                    innovation while honoring the timeless traditions that make Rose Bowl Motel special.
                  </p>
                  <div className="bg-accent/10 rounded-xl p-6 mt-6 border border-accent/20">
                    <p className="text-foreground italic text-lg font-medium">
                      "Every guest who walks through our doors becomes part of our story,
                      and we're honored to be part of theirs."
                    </p>
                    <p className="text-muted-foreground mt-3 text-sm">
                      — The Rose Bowl Motel Family
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-b from-background to-accent/5">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-6xl font-bold mb-4">Guest Experiences</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Hear what our guests have to say about their unforgettable stays
              </p>
            </div>
          </Reveal>

          {/* Testimonials Carousel */}
          <Reveal delay={0.2}>
            <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <div className="flex w-max animate-marquee gap-6 py-8 hover:pause">
                {[...testimonials, ...testimonials].map((testimonial, idx) => (
                  <div key={`${testimonial.id}-${idx}`} className="w-[350px] md:w-[450px] flex-shrink-0">
                    <div className="h-full">
                      <Card className="group h-full flex flex-col justify-between border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card to-card/50 hover:scale-[1.02] overflow-hidden relative">
                        {/* Decorative quote mark */}
                        <div className="absolute top-4 right-4 text-6xl text-primary/10 font-headline leading-none">"</div>

                        <CardContent className="p-8 relative z-10">
                          {/* Star Rating */}
                          <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 transition-all duration-300 ${i < testimonial.rating
                                  ? 'text-amber-500 fill-amber-500 scale-100'
                                  : 'text-gray-300 scale-90'
                                  }`}
                              />
                            ))}
                          </div>

                          {/* Comment */}
                          <p className="text-muted-foreground leading-relaxed text-base mb-6 line-clamp-4">
                            "{testimonial.comment}"
                          </p>
                        </CardContent>

                        {/* Author Info */}
                        <CardHeader className="flex flex-row items-center gap-4 pt-0 px-8 pb-8 bg-gradient-to-r from-accent/30 to-accent/10 mt-auto">
                          <Avatar className="h-12 w-12 border-2 border-primary/20 ring-2 ring-background">
                            <AvatarImage
                              src={getPlaceholderImage(testimonial.avatar).imageUrl}
                              alt={testimonial.name}
                              data-ai-hint={getPlaceholderImage(testimonial.avatar).imageHint}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                          </div>
                        </CardHeader>

                        {/* Hover gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Call to Action */}
          <Reveal delay={0.4}>
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Ready to create your own story?</p>
              <Button asChild size="lg" className="group">
                <Link href="/booking">
                  Book Your Stay
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
