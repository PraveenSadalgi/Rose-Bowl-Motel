'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createRazorpayOrder, verifyPayment } from '@/lib/razorpay';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  bookingId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess?: (paymentId: string) => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  amount,
  currency = 'INR',
  bookingId,
  customerEmail,
  customerName = 'Customer',
  customerPhone = '',
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    
    // Ensure Razorpay script is loaded
    if (typeof window === 'undefined' || !window.Razorpay) {
      await loadRazorpay();
    }

    try {
      // 1. Create order on your server
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount), // Ensure we're sending the correct amount in base units (rupees)
          currency: 'INR',
          // Generate a shorter receipt ID that's under 40 characters
          receipt: `bk_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          notes: {
            bookingId: bookingId,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
          },
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // 2. Configure Razorpay checkout with UPI support
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Rose Bowl Motel',
        description: 'Room Booking Payment',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment on your server
            try {
              const verificationResponse = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  bookingId,
                  amount: amount,
                }),
              });

              const verificationData = await verificationResponse.json();

              if (verificationResponse.ok && verificationData.success) {
                toast({
                  title: 'Payment Successful!',
                  description: 'Your booking has been confirmed.',
                  variant: 'default',
                });
                onSuccess?.(response.razorpay_payment_id);
                return; // Exit the function after successful verification
              } else {
                // If verification failed but we have a message, use it
                const errorMessage = verificationData.message || 
                                  verificationData.error?.message || 
                                  'Payment verification failed';
                throw new Error(errorMessage);
              }
            } catch (verificationError) {
              console.error('Verification error:', verificationError);
              throw new Error(verificationError instanceof Error ? verificationError.message : 'Payment verification failed');
            }
          } catch (error) {
            console.error('Error in payment processing:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
            
            toast({
              title: 'Payment Processing Error',
              description: errorMessage,
              variant: 'destructive',
            });
            
            // Optional: Add retry logic here if needed
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#2563eb', // Updated blue color
        },
        modal: {
          ondismiss: function() {
            onCancel?.();
          },
          escape: true,
          backdropclose: true,
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['collect', 'intent']
                  }
                ]
              },
              card: {
                name: 'Pay using Card',
                instruments: [
                  {
                    method: 'card',
                    flows: ['form']
                  }
                ]
              },
              netbanking: {
                name: 'Net Banking',
                instruments: [
                  {
                    method: 'netbanking',
                    banks: ['HDFC', 'ICICI', 'SBI', 'AXIS']
                  }
                ]
              }
            },
            sequence: ['block.upi', 'block.card', 'block.netbanking'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        notes: {
          bookingId: bookingId,
          customerName: customerName,
          customerEmail: customerEmail,
        },
        retry: {
          enabled: true,
          max_count: 4,
        },
        timeout: 300, // 5 minutes
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      toast({
        title: 'Payment failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gray-50">
        <div className="text-2xl font-bold mb-2">₹{(amount / 100).toFixed(2)}</div>
        <div className="text-sm text-gray-500 mb-6">Total Amount</div>
        
        <Button 
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full max-w-xs"
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </Button>
        
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="mt-4 w-full max-w-xs"
          >
            Cancel
          </Button>
        )}
        
        {error && (
          <div className="mt-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Secure payment powered by Razorpay
      </div>
    </div>
  );
}
