import type { Room, Amenity, Testimonial, GalleryImage } from '@/lib/types';
import {
  Wifi,
  Tv,
  Coffee,
  Wind,
  ParkingCircle,
  Utensils,
  Sun,
  Waves,
  Bike,
  Dumbbell,
  Sparkles,
  ConciergeBell,
} from 'lucide-react';
import { getPlaceholderImage } from './placeholder-images';

export const rooms: Room[] = [
  {
    id: 8,
    name: 'Deluxe King Room',
    slug: 'deluxe-king-room',
    description: 'A spacious room with a comfortable king-sized bed.',
    longDescription:
      'Indulge in the comfort of our Deluxe King Room. Featuring a plush king-sized bed, a modern en-suite bathroom with a rainfall shower, and a cozy seating area. Enjoy stunning views of the city skyline or our tranquil gardens. Perfect for couples or solo travelers seeking a touch of luxury.',
    price: 100,
    images: ['deluxe-king-1', 'deluxe-king-2'],
    amenities: ['wifi', 'tv', 'air-conditioning', 'mini-bar', 'marble-bathroom', 'coffee-maker'],
    capacity: 2,
    sqft: 450,
  },
  {
    id: 9,
    name: 'Executive Suite',
    slug: 'executive-suite',
    description: 'A luxurious suite with a separate living area.',
    longDescription:
      'Experience unparalleled luxury in our Executive Suite. This expansive suite offers a private bedroom with a king-sized bed, a separate, elegantly furnished living room, and a spa-like bathroom with a soaking tub. Ideal for business travelers or those desiring extra space and comfort.',
    price: 7999,
    images: ['executive-suite-1', 'executive-suite-2'],
    amenities: ['wifi', 'tv', 'air-conditioning', 'mini-bar', 'room-service', 'private-balcony'],
    capacity: 3,
    sqft: 750,
  },
  {
    id: 10,
    name: 'Garden View Queen',
    slug: 'garden-view-queen',
    description: 'A charming room with beautiful garden views.',
    longDescription:
      'Wake up to serene views of our lush, manicured gardens in the Garden View Queen room. This charming room features a comfortable queen-sized bed, a private balcony, and all the modern amenities you need for a relaxing stay. A peaceful retreat from the everyday hustle.',
    price: 3999,
    images: ['garden-view-queen-1', 'garden-view-queen-2'],
    amenities: ['wifi', 'tv', 'air-conditioning', 'balcony', 'coffee-maker', 'smart-tv'],
    capacity: 2,
    sqft: 400,
  },
  {
    id: 11,
    name: 'Presidential Suite',
    slug: 'presidential-suite',
    description: 'The pinnacle of luxury with panoramic views.',
    longDescription:
      'Our Presidential Suite is the epitome of opulence. Occupying the top floor, it boasts panoramic views, a grand master bedroom, a separate dining area for eight, a private study, and a dedicated butler service. Every detail is meticulously curated for an extraordinary experience.',
    price: 4000,
    images: ['presidential-suite-1', 'presidential-suite-2'],
    amenities: ['wifi', 'tv', 'air-conditioning', 'mini-bar', 'room-service', 'butler-service', 'private-balcony'],
    capacity: 4,
    sqft: 2200,
  },
];

export const featuredRooms = rooms.slice(0, 2);

export const amenities: Amenity[] = [
  { id: 1, name: 'High-Speed WiFi', description: 'Stay connected with free, high-speed internet access throughout the hotel.', icon: Wifi, image: 'amenity-wifi' },
  { id: 2, name: 'On-Site Restaurant', description: 'Enjoy exquisite dining experiences at our renowned on-site restaurant.', icon: Utensils, image: 'amenity-restaurant' },
  { id: 3, name: 'Swimming Pool', description: 'Relax and unwind by our stunning outdoor swimming pool.', icon: Waves, image: 'amenity-pool' },
  { id: 4, name: 'Fitness Center', description: 'Keep up with your fitness routine in our state-of-the-art gym.', icon: Dumbbell, image: 'amenity-gym' },
  { id: 5, name: 'Spa & Wellness', description: 'Rejuvenate your body and mind at our luxurious spa.', icon: Sparkles, image: 'amenity-spa' },
  { id: 6, name: 'Free Parking', description: 'Complimentary and secure parking for all our guests.', icon: ParkingCircle, image: 'amenity-parking' },
  { id: 7, name: '24/7 Concierge', description: 'Our dedicated concierge team is available around the clock to assist you.', icon: ConciergeBell, image: 'amenity-concierge' },
  { id: 8, name: 'In-Room Coffee', description: 'Enjoy complimentary premium coffee and tea in the comfort of your room.', icon: Coffee, image: 'amenity-coffee' },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jane Doe',
    location: 'New York, USA',
    rating: 5,
    comment: 'An absolutely unforgettable experience! The elegance and attention to detail were second to none. I felt like royalty.',
    avatar: 'avatar-jane-doe',
  },
  {
    id: 2,
    name: 'John Smith',
    location: 'London, UK',
    rating: 5,
    comment: 'The service was impeccable from the moment we arrived. The staff went above and beyond to make our stay special. We will be back!',
    avatar: 'avatar-john-smith',
  },
  {
    id: 3,
    name: 'Emily Jones',
    location: 'Sydney, Australia',
    rating: 5,
    comment: 'Rose Bowl Motel is a true oasis. The rooms are beautiful, the food is divine, and the atmosphere is so peaceful.',
    avatar: 'avatar-emily-jones',
  },
];

export const galleryImages: GalleryImage[] = [
    { id: 'gallery-1', src: getPlaceholderImage('gallery-1').imageUrl, alt: 'Elegant hotel exterior facade', width: 600, height: 400, hint: getPlaceholderImage('gallery-1').imageHint },
    { id: 'gallery-2', src: getPlaceholderImage('gallery-2').imageUrl, alt: 'Interior of a fine dining restaurant', width: 400, height: 600, hint: getPlaceholderImage('gallery-2').imageHint },
    { id: 'gallery-3', src: getPlaceholderImage('gallery-3').imageUrl, alt: 'Tranquil hotel spa area', width: 600, height: 400, hint: getPlaceholderImage('gallery-3').imageHint },
    { id: 'gallery-4', src: getPlaceholderImage('gallery-4').imageUrl, alt: 'Modern cocktail bar with seating', width: 600, height: 400, hint: getPlaceholderImage('gallery-4').imageHint },
    { id: 'gallery-5', src: getPlaceholderImage('gallery-5').imageUrl, alt: 'Outdoor wedding venue setup', width: 400, height: 600, hint: getPlaceholderImage('gallery-5').imageHint },
    { id: 'gallery-6', src: getPlaceholderImage('gallery-6').imageUrl, alt: 'Well-equipped hotel fitness center', width: 600, height: 400, hint: getPlaceholderImage('gallery-6').imageHint },
    { id: 'gallery-7', src: getPlaceholderImage('gallery-7').imageUrl, alt: 'Spacious conference room for meetings', width: 600, height: 400, hint: getPlaceholderImage('gallery-7').imageHint },
    { id: 'gallery-8', src: getPlaceholderImage('gallery-8').imageUrl, alt: 'Rooftop terrace with a city view', width: 400, height: 600, hint: getPlaceholderImage('gallery-8').imageHint },
];
