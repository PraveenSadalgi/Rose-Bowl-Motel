import Razorpay from 'razorpay';

// Type declarations
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

interface RazorpayPayment {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Initialize Razorpay client (server-side only)
const razorpayClient = process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    }) 
  : null;

export const createRazorpayOrder = async (
  amount: number, 
  currency: string = 'INR', // Default to INR
  receipt: string, 
  notes: Record<string, any> = {}
): Promise<RazorpayOrder> => {
  if (!razorpayClient) {
    throw new Error('Razorpay client not initialized');
  }
  
  try {
    const order = await razorpayClient.orders.create({
      amount: Math.round(amount), // Convert to paise
      currency,
      receipt,
      notes,
      payment_capture: 1 // Auto capture payment
    });
    
    return order as RazorpayOrder;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyPayment = async (
  orderId: string, 
  paymentId: string, 
  signature: string
): Promise<{ success: boolean; message: string }> => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
  hmac.update(orderId + '|' + paymentId);
  const generatedSignature = hmac.digest('hex');
  
  const isValid = generatedSignature === signature;
  return {
    success: isValid,
    message: isValid ? 'Payment signature verified' : 'Invalid payment signature',
  };
};
