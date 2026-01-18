import { NextApiRequest, NextApiResponse } from 'next';
import { createRazorpayOrder } from '@/lib/razorpay';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || !receipt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert amount to paise (smallest currency unit for INR)
    const amountInPaise = Math.round(amount * 100);
    
    const order = await createRazorpayOrder(
      amountInPaise, // Amount in paise
      currency,
      receipt,
      notes
    );

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ 
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
