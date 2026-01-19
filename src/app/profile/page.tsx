'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { generateBookingPdf } from '@/lib/pdf/generator';
import { useToast } from '@/hooks/use-toast';
import { CardDescription } from '@/components/ui/card';

type Room = {
  id: number;
  name: string;
  slug: string;
  price_per_night: number;
};

type Booking = {
  id: string;
  room_id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_amount: number;
  currency: string;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  rooms: Room;
};

// Supabase client is already imported

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // First, get all bookings where the user is the booker (using their auth ID)
        const { data: userBookings, error: userBookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            rooms!bookings_room_id_fkey(id, name, slug, price_per_night)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (userBookingsError) throw userBookingsError;

        // Then get all bookings where the user is the guest (using their email)
        const { data: guestBookings, error: guestBookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            rooms!bookings_room_id_fkey(id, name, slug, price_per_night)
          `)
          .eq('email', user.email || '')
          .order('created_at', { ascending: false });

        if (guestBookingsError) throw guestBookingsError;

        // Combine and deduplicate bookings
        const allBookings = [...(userBookings || []), ...(guestBookings || [])];
        const uniqueBookings = allBookings.filter(
          (booking, index, self) => index === self.findIndex(b => b.id === booking.id)
        );

        setBookings(uniqueBookings as Booking[]);
      } catch (error) {
        console.error('Error in fetchBookings:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          name: error?.constructor?.name
        });

        toast({
          title: 'Error',
          description: error instanceof Error
            ? `Failed to load bookings: ${error.message}`
            : 'Failed to load your bookings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, toast]);

  const handleDownloadTicket = async (booking: Booking) => {
    try {
      // Get the full booking details with room information
      const { data: fullBooking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms!bookings_room_id_fkey(id, name, slug, price_per_night)
        `)
        .eq('id', booking.id)
        .single();

      if (error) throw error;

      // Transform the booking data to match the expected format for generateBookingPdf
      const pdfData = {
        id: fullBooking.id,
        room_type: fullBooking.rooms?.name || 'Standard Room',
        check_in_date: fullBooking.check_in_date,
        check_out_date: fullBooking.check_out_date,
        total_price: fullBooking.total_amount,
        guest_name: `${fullBooking.first_name} ${fullBooking.last_name}`,
        guest_email: fullBooking.email,
        guest_phone: fullBooking.phone,
        payment_intent_id: fullBooking.id, // Using booking ID as fallback for payment intent ID
        created_at: fullBooking.created_at
      };

      // @ts-ignore - jsPDF types are not perfect
      const pdfBytes = await generateBookingPdf(pdfData);

      // Create a blob and download link
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `booking-${fullBooking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate booking PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading state while fetching bookings
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.user_metadata?.full_name || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You don't have any bookings yet.</p>
          <Button className="mt-4" onClick={() => router.push('/rooms')}>
            Book a Room
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.rooms?.name || 'Room'}</CardTitle>
                    <CardDescription className="mt-1">
                      Booking #{booking.id.split('-')[0].toUpperCase()}
                    </CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Check-in</p>
                    <p>{format(new Date(booking.check_in_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Check-out</p>
                    <p>{format(new Date(booking.check_out_date), 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p>₹{booking.total_amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTicket(booking)}
                  >
                    Download Ticket
                  </Button>
                  {booking.status === 'confirmed' && (
                    <Button variant="outline" size="sm">
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
