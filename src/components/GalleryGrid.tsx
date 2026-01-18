'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { galleryImages } from '@/lib/data';
import type { GalleryImage } from '@/lib/types';
import { Card } from './ui/card';
import { Search } from 'lucide-react';

export default function GalleryGrid() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {galleryImages.map((image) => (
          <div key={image.id} className="group relative" onClick={() => setSelectedImage(image)}>
            <Card className="overflow-hidden cursor-pointer">
              <Image
                src={image.src}
                alt={image.alt}
                data-ai-hint={image.hint}
                width={image.width}
                height={image.height}
                className="w-full h-auto aspect-[3/2] object-cover transition-transform duration-300 group-hover:scale-105"
              />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white text-center">
                <Search className="w-8 h-8 mb-2" />
                <p className="font-semibold text-lg">{image.alt}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0">
          {selectedImage && (
            <>
              <DialogTitle className="sr-only">{selectedImage.alt}</DialogTitle>
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                data-ai-hint={selectedImage.hint}
                width={1200}
                height={800}
                className="w-full h-auto object-contain rounded-lg"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
