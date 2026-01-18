import type { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';
import PageHeader from '@/components/PageHeader';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A visual journey through the elegance of Rose Bowl Motel.',
};

export default function GalleryPage() {
  return (
    <div>
      <section className="relative h-[40vh] w-full">
        <Image
          src={getPlaceholderImage('amenities-pool').imageUrl}
          alt="Hotel swimming pool"
          data-ai-hint="hotel swimming pool"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <PageHeader
            title="Our Gallery"
            subtitle="Discover the beauty and elegance of Rose Bowl Motel through our curated collection of photographs."
          />
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <GalleryGrid />
      </div>
    </div>
  );
}
