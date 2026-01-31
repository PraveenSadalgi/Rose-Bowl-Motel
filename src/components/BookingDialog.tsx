'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BookingDialogProps {
  room: Room;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function BookingDialog({
  room,
  isOpen,
  onOpenChange,
}: BookingDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isChecking, setIsChecking] = useState(false);

  const checkAvailability = async () => {
    // Check if number of guests exceeds room capacity
    if (guests > room.capacity) {
      toast({
        title: 'Too Many Guests',
        description: `This room can accommodate a maximum of ${room.capacity} guest${room.capacity > 1 ? 's' : ''}. Please select a different room or reduce the number of guests.`,
        variant: 'destructive',
      });
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast({
        title: 'Missing Dates',
        description: 'Please select both check-in and check-out dates.',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);

    try {
      // Get room ID from the room object
      const roomId = room.id;

      // Use the same RPC function as BookingForm
      const { data: isAvailable, error: availabilityError } = await supabase
        .rpc('check_room_availability', {
          p_room_id: roomId,
          p_check_in: format(checkInDate, 'yyyy-MM-dd'),
          p_check_out: format(checkOutDate, 'yyyy-MM-dd')
        });

      if (availabilityError) {
        console.error('Error checking availability:', availabilityError);
        toast({
          title: 'Error',
          description: 'Failed to check availability. Please try again.',
          variant: 'destructive',
        });
        setIsChecking(false);
        return;
      }

      // If room is not available
      if (!isAvailable) {
        toast({
          title: 'Room Unavailable',
          description: `This room is unavailable on the selected dates. Please choose different dates.`,
          variant: 'destructive',
        });
        setIsChecking(false);
        return;
      }

      // Room is available, proceed to booking
      toast({
        title: 'Room Available!',
        description: 'Redirecting to complete your booking.',
      });

      const params = new URLSearchParams({
        room: room.slug,
        from: format(checkInDate, 'yyyy-MM-dd'),
        to: format(checkOutDate, 'yyyy-MM-dd'),
        guests: guests.toString(),
      });

      router.push(`/booking?${params.toString()}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            Book {room.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-medium mb-2">Check-in Date</h3>
              <DatePicker
                selected={checkInDate}
                onChange={(date: Date | null) => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                placeholderText="Select check-in"
                dateFormat="MMM dd, yyyy"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12"
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">Check-out Date</h3>
              <DatePicker
                selected={checkOutDate}
                onChange={(date: Date | null) => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate || new Date()}
                placeholderText="Select check-out"
                dateFormat="MMM dd, yyyy"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-12"
                wrapperClassName="w-full"
              />
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium mb-2">Number of Guests</h3>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                max={room.capacity}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="pl-10 h-12 bg-background border-input"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Maximum capacity: {room.capacity} guests</p>
          </div>
        </div>
        <Button
          onClick={checkAvailability}
          size="lg"
          className="w-full text-base"
          disabled={isChecking || !checkInDate || !checkOutDate}
        >
          {isChecking ? 'Checking Availability...' : 'Check Availability & Continue'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
