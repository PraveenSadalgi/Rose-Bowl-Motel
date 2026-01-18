
'use client';
import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';
import PageHeader from '@/components/PageHeader';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';


function BookingPageContent() {
  const searchParams = useSearchParams();
  const roomSlug = searchParams.get('room');

  return (
    <div>
      <PageHeader
        title="Reserve Your Stay"
        subtitle="Complete the steps below to finalize your booking at Rose Bowl Motel. We look forward to welcoming you."
      />
      <div className="container mx-auto px-4 pb-16">
        {roomSlug && (
            <div className="mb-8">
                <Button asChild variant="outline">
                    <Link href={`/rooms/${roomSlug}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Room Details
                    </Link>
                </Button>
            </div>
        )}
        <BookingForm />
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}
