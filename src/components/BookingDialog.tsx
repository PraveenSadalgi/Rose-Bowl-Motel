'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { addDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });
  const [guests, setGuests] = useState(1);

  const handleContinue = () => {
    toast({
      title: 'Booking In Progress',
      description: 'Redirecting to complete your booking.',
    });
    const params = new URLSearchParams({
      room: room.slug,
      from: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      to: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      guests: guests.toString(),
    });
    router.push(`/booking?${params.toString()}`);
    onOpenChange(false);
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
          <div>
            <h3 className="text-base font-medium mb-2">Select Dates</h3>
            <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-auto",
                      !date?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <div className='flex-grow'>
                        <span className='text-xs text-muted-foreground'>Check-in - Check-out</span>
                        <div className='font-semibold'>
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date</span>
                            )}
                        </div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
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
        <Button onClick={handleContinue} size="lg" className="w-full text-base">
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
