// Global type declarations for the application
declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface OrderOptions {
    amount: number;
    currency: string;
    receipt: string;
    payment_capture: number;
    notes?: Record<string, any>;
  }

  interface Order {
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

  class Razorpay {
    constructor(options: RazorpayOptions);
    orders: {
      create(options: OrderOptions): Promise<Order>;
    };
  }

  export = Razorpay;
}

declare module '@/lib/razorpay' {
  import { Razorpay } from 'razorpay';

  export const razorpay: Razorpay | null;
  
  export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    notes: Record<string, any>;
    created_at: number;
  }

  export function createRazorpayOrder(
    amount: number,
    currency: string,
    receipt: string,
    notes?: Record<string, any>
  ): Promise<RazorpayOrder>;

  export function verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<{ success: boolean; message: string }>;
}
