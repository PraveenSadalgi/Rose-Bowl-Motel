'use client';

import PageHeader from '@/components/PageHeader';
import { AttractionFinder } from '@/components/AttractionFinder';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export default function LocationPage() {
  return (
    <div>
      <section className="relative h-[40vh] w-full">
        <Image
          src={getPlaceholderImage('location-hero').imageUrl}
          alt="Map indicating location"
          data-ai-hint={getPlaceholderImage('location-hero').imageHint}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <PageHeader
            title="Our Location"
            subtitle="Conveniently located to offer both tranquility and easy access to local points of interest. Find us and start your journey."
          />
        </div>
      </section>
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9876543210123!2d72.55!3d23.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzEyLjAiTiA3MsKwMzMnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin&q=Ellish+bridge,+opp.+Kothawala,+Pritam+Nagar,+Paldi,+Ahmedabad,+Gujarat"
              width="100%"
              height="700"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map of Rose Bowl Motel Location - Paldi, Ahmedabad"
            ></iframe>
          </div>
          <div>
            <AttractionFinder />
          </div>
        </div>
      </div>
    </div>
  );
}
