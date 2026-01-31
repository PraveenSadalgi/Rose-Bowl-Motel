'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Room } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ruler, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoomCardProps {
    room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
    const { imageUrl, imageHint } = getPlaceholderImage(room.images[0]);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-full"
        >
            <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col group bg-card">
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={room.name}
                        data-ai-hint={imageHint}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                        <div className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                            ₹{room.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-muted-foreground">/ night</span>
                        </div>
                    </div>
                </div>

                <CardHeader className="pb-2 pt-6">
                    <h3 className="font-headline text-2xl font-bold group-hover:text-primary transition-colors">
                        {room.name}
                    </h3>
                </CardHeader>

                <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                        {room.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
                        <div className="flex items-center gap-2" title="Capacity">
                            <Users size={18} className="text-primary" />
                            <span>{room.capacity} Guests</span>
                        </div>
                        <div className="flex items-center gap-2" title="Room Size">
                            <Ruler size={18} className="text-primary" />
                            <span>{room.sqft} sqft</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-0 pb-6">
                    <Button asChild className="w-full bg-primary/95 hover:bg-primary transition-all duration-300">
                        <Link href={`/rooms/${room.slug}`} className="flex items-center justify-center">
                            View Details <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
