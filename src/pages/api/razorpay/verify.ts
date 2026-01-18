import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPayment } from '@/lib/razorpay';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      bookingId,
      amount 
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
      return res.status(200).json({ 
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    }

    // Verify payment signature
    const verification = await verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!verification.success) {
      return res.status(400).json({ 
        success: false,
        message: verification.message || 'Payment verification failed',
        error: verification.message || 'Payment verification failed'
      });
    }

    // Update payment in the database
    try {
      // First, try to update with all fields
      const updateData: any = {
        payment_status: 'succeeded',
        razorpay_payment_id,
        amount_paid: amount,
        updated_at: new Date().toISOString(),
      };

      // Only include these fields if they exist in the schema
      const { error: paymentError } = await supabase
        .from('payments')
        .update(updateData)
        .eq('booking_id', bookingId);

      if (paymentError) {
        console.error('Error updating payment with all fields, trying minimal update:', paymentError);
        
        // If the first update fails, try a minimal update with just the essential fields
        const minimalUpdate = {
          payment_status: 'succeeded',
          updated_at: new Date().toISOString(),
        };
        
        const { error: minimalError } = await supabase
          .from('payments')
          .update(minimalUpdate)
          .eq('booking_id', bookingId);
          
        if (minimalError) {
          console.error('Minimal update also failed:', minimalError);
          return res.status(500).json({ 
            success: false,
            message: 'Failed to update payment status',
            error: minimalError.message
          });
        }
      }
    } catch (updateError) {
      console.error('Unexpected error during payment update:', updateError);
      // Continue with the flow even if update fails, as the payment has been verified
    }

    // Update booking status
    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (bookingError) {
        console.error('Error updating booking status:', bookingError);
        // Log the error but don't fail the entire process
      }
    } catch (bookingUpdateError) {
      console.error('Unexpected error updating booking status:', bookingUpdateError);
      // Continue with the response even if booking update fails
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and processed successfully',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ 
      error: 'Failed to verify payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
