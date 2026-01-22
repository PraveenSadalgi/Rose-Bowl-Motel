import type { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';
import PageHeader from '@/components/PageHeader';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A visual journey through the elegance of Rose Bowl Motel.',
};

export default function GalleryPage() {
  return (
    <div>
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <VideoPlayer 
            src="/videos/1303-145340146.mp4" 
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
            title="Our Gallery"
            subtitle="Discover the beauty and elegance of Rose Bowl Motel through our curated collection of photographs."
            className="text-white"
          />
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <GalleryGrid />
      </div>
    </div>
  );
}
