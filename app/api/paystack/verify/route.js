// app/api/paystack/verify/route.js

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Assuming your firebase init is in lib/firebase (or use @/lib/firebase)
import { doc, setDoc } from 'firebase/firestore';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_VERIFY_BASE_URL = 'https://api.paystack.co/transaction/verify/';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
    }

    // 1. Make the secure server-side call to Paystack's Verify endpoint
    const paystackResponse = await fetch(`${PAYSTACK_VERIFY_BASE_URL}${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await paystackResponse.json();

    // 2. Check Verification Status
    if (!paystackResponse.ok || data.data.status !== 'success') {
      console.error("Paystack Verification Failed:", data);
      // Return unverified status (Frontend will show an error message)
      return NextResponse.json({ status: 'failed', message: 'Payment verification failed' }, { status: 400 });
    }
    
    // 3. Extract necessary data
    const transaction = data.data;
    const donorEmail = transaction.customer.email;
    const amount = transaction.amount / 100; // Convert Kobo back to Naira
    const metadata = transaction.metadata.custom_fields || [];
    
    // Extract custom fields
    const donorName = metadata.find(f => f.variable_name === 'donor_name')?.value || 'Anonymous';
    const donationType = metadata.find(f => f.variable_name === 'donation_type')?.value || 'One-Time';

    // 4. Record successful transaction in Firestore
    const donationRecord = {
      reference: reference,
      amount: amount,
      email: donorEmail,
      name: donorName,
      type: donationType,
      date: transaction.paid_at,
      channel: transaction.channel,
      isVerified: true
    };

    // Use the Paystack reference as the document ID for easy lookup
    await setDoc(doc(db, "donations", reference), donationRecord);

    // 5. Return success status (Frontend will redirect or display confirmation)
    return NextResponse.json({ status: 'success', donation: donationRecord });

  } catch (error) {
    console.error('API Error during verification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
