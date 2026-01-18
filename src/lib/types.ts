import type { LucideIcon } from 'lucide-react';

export type Room = {
  id: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  amenities: string[];
  capacity: number;
  sqft: number;
};

export type Amenity = {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  image: string;
};

export type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  hint: string;
};
