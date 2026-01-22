import type { Metadata } from 'next';
import { rooms } from '@/lib/data';
import { RoomDetails } from '@/components/RoomDetails';
import PageHeader from '@/components/PageHeader';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import Image from 'next/image';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

export const metadata: Metadata = {
  title: 'Our Rooms',
  description: 'Explore our collection of elegant rooms and suites.',
};

export default function RoomsPage() {
  return (
    <div>
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <VideoPlayer 
            src="/videos/135141-761273478_medium.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <PageHeader
            title="Our Rooms & Suites"
            subtitle="Each of our rooms is a sanctuary of comfort, designed with classic elegance and modern amenities to ensure a memorable stay."
            className="text-white"
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
