import type { Metadata } from 'next';
import { rooms } from '@/lib/data';
import { RoomDetails } from '@/components/RoomDetails';
import PageHeader from '@/components/PageHeader';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Rooms',
  description: 'Explore our collection of elegant rooms and suites.',
};

export default function RoomsPage() {
  return (
    <div>
      <section className="relative h-[40vh] w-full">
        <Image
          src={getPlaceholderImage('rooms-hero').imageUrl}
          alt=""
          data-ai-hint="elegant hotel rooms"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <PageHeader
            title="Our Rooms & Suites"
            subtitle="Each of our rooms is a sanctuary of comfort, designed with classic elegance and modern amenities to ensure a memorable stay."
          />
        </div>
      </section>
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          {rooms.map((room, index) => (
            <RoomDetails key={room.id} room={room} reverse={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
