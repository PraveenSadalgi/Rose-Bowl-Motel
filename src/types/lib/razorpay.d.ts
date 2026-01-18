import { RazorpayOrder } from '@/lib/razorpay';

declare module '@/lib/razorpay' {
  export interface RazorpayOrder {
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

  export const createRazorpayOrder: (
    amount: number,
    currency: string,
    receipt: string,
    notes?: Record<string, any>
  ) => Promise<RazorpayOrder>;

  export const verifyPayment: (
    orderId: string,
    paymentId: string,
    signature: string
  ) => Promise<{ success: boolean; message: string }>;
}
