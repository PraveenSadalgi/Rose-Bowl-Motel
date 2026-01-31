'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { rooms } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';
import PaymentForm from './PaymentForm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const bookingSchema = z.object({
  checkInDate: z.date({ required_error: 'Check-in date is required.' }),
  checkOutDate: z.date({ required_error: 'Check-out date is required.' }),
  roomType: z.string().min(1, 'Please select a room type.'),
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.'),
  numGuests: z.number().min(1, 'Number of guests is required.').max(10, 'Maximum 10 guests allowed.'),
  specialRequests: z.string().optional(),
}).refine(data => data.checkOutDate > data.checkInDate, {
  message: 'Check-out date must be after check-in date.',
  path: ['checkOutDate'],
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingStep = 'details' | 'payment' | 'confirmation';

type Room = {
  id: number;
  price: number;
};

export default function BookingForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<BookingStep>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);

  const roomSlug = searchParams ? searchParams.get('room') || '' : '';

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomType: searchParams ? searchParams.get('room') || '' : '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      numGuests: 1,
      specialRequests: '',
      checkInDate: undefined,
      checkOutDate: undefined,
    },
  });

  const roomType = form.watch('roomType');
  const checkInDate = form.watch('checkInDate');
  const checkOutDate = form.watch('checkOutDate');

  // Find the selected room based on the slug from the form
  const selectedRoom = roomType ? rooms.find((r) => r.slug === roomType) || null : null;

  // Calculate number of nights
  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Calculate total cost
  const totalCost = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  // Update total amount when dates or room changes
  useEffect(() => {
    if (selectedRoom && checkInDate && checkOutDate) {
      const calculatedNights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
      const total = calculatedNights * selectedRoom.price;
      setTotalAmount(total); // Store the actual amount, will be converted to paise in PaymentForm
    } else {
      setTotalAmount(0);
    }
  }, [selectedRoom, checkInDate, checkOutDate]);

  // Update room state when selectedRoom changes
  useEffect(() => {
    setRoom(selectedRoom);
  }, [selectedRoom]);

  const onSubmit = async (data: BookingFormValues) => {
    if (step === 'details') {
      setStep('payment');
      return;
    }

    // This will be handled by the PaymentForm component
  };

  const handlePaymentSuccess = async () => {
    setStep('confirmation');
    // You can add additional logic here, like sending a confirmation email
  };

  const createBooking = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        throw new Error('You must be logged in to make a booking');
      }

      const roomFromSlug = rooms.find((r) => r.slug === data.roomType);
      if (!roomFromSlug) {
        throw new Error('Please select a valid room before continuing');
      }
      const roomId = roomFromSlug.id;

      // First, get the room details to check capacity
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('capacity')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      if (!roomData) throw new Error('Room not found');

      // Check if the room has enough capacity
      if (data.numGuests > roomData.capacity) {
        toast({
          title: 'Too Many Guests',
          description: `This room can accommodate a maximum of ${roomData.capacity} guest${roomData.capacity > 1 ? 's' : ''}. Please reduce the number of guests.`,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Then check room availability for the dates
      const { data: isAvailable, error: availabilityError } = await supabase
        .rpc('check_room_availability', {
          p_room_id: roomId,
          p_check_in: format(data.checkInDate, 'yyyy-MM-dd'),
          p_check_out: format(data.checkOutDate, 'yyyy-MM-dd')
        });

      if (availabilityError) throw availabilityError;
      if (!isAvailable) {
        throw new Error('Selected room is no longer available for the chosen dates');
      }

      // Create booking with user_id
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          room_id: roomId,
          user_id: user.id,  // Add the logged-in user's ID
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          check_in_date: format(data.checkInDate, 'yyyy-MM-dd'),
          check_out_date: format(data.checkOutDate, 'yyyy-MM-dd'),
          num_guests: data.numGuests,
          total_amount: totalAmount, // Store amount in rupees
          special_requests: data.specialRequests,
          status: 'pending',
          currency: 'USD' // Add required currency field
        })
        .select()
        .single();

      if (bookingError) throw bookingError;
      if (!booking) throw new Error('Failed to create booking');

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount_paid: 1, // Using 1 cent as minimum amount to satisfy the constraint
          payment_status: 'pending',
          currency: 'USD',
        });

      if (paymentError) throw paymentError;

      setBookingId(booking.id);
      return booking.id;
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 'details':
        return (
          <>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="roomType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Choose Room</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a room or suite" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rooms.map((room) => (
                              <SelectItem key={room.slug} value={room.slug}>
                                {room.name} - ₹{room.price.toLocaleString('en-IN')}/night
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-lg font-semibold">Check-in Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              selected={field.value}
                              onChange={(date: Date | null) => field.onChange(date)}
                              selectsStart
                              startDate={field.value}
                              endDate={form.watch('checkOutDate')}
                              minDate={new Date()}
                              placeholderText="Select check-in date"
                              dateFormat="MMM dd, yyyy"
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              wrapperClassName="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-lg font-semibold">Check-out Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              selected={field.value}
                              onChange={(date: Date | null) => field.onChange(date)}
                              selectsEnd
                              startDate={form.watch('checkInDate')}
                              endDate={field.value}
                              minDate={form.watch('checkInDate') || new Date()}
                              placeholderText="Select check-out date"
                              dateFormat="MMM dd, yyyy"
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              wrapperClassName="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                  />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                  />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Email Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                  />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                  />
                  <FormField
                    control={form.control}
                    name="numGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of guests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Guest' : 'Guests'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full mt-8">Continue to Payment</Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              {/* <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button> */}
            </CardFooter>
          </>
        );

      case 'payment':
        return (
          <>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep('details')}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-2">
                <h3 className="text-lg font-semibold">Booking Summary</h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room:</span>
                  <span>{selectedRoom?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span>{format(checkInDate, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span>{format(checkOutDate, 'PPP')}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total ({nights} {nights === 1 ? 'night' : 'nights'}):</span>
                  <span>₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {bookingId ? (
                <PaymentForm
                  amount={totalCost} // Using totalCost directly since it's already in the correct currency
                  currency="INR"
                  bookingId={bookingId}
                  customerEmail={form.getValues('email')}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setStep('details')}
                />
              ) : (
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      const id = await createBooking(form.getValues());
                      setBookingId(id);
                    } catch (error) {
                      // Error is already handled in createBooking
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </>
        );

      case 'confirmation':
        return (
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Booking Confirmed!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for your booking. A confirmation has been sent to {form.getValues('email')}.
            </p>
            <div className="mt-6">
              <Button onClick={() => router.push('/')}>
                Return to Home
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <Card>
        {renderFormStep()}
      </Card>
    </Form>
  );
}
