// src/app/api/paystack/verify/route.js
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin'; // Ensure you have firebase-admin set up
import { verifyPaystackTransaction } from '@/lib/paystack';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request) {
    try {
        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json({ success: false, message: "No reference provided" }, { status: 400 });
        }

        // 1. Verify with Paystack
        const paystackResponse = await verifyPaystackTransaction(reference);

        if (!paystackResponse.status || paystackResponse.data.status !== 'success') {
            return NextResponse.json({ success: false, message: "Transaction not successful" }, { status: 400 });
        }

        const pData = paystackResponse.data;

        // 2. Update Firestore (Admin SDK)
        // We query by reference because doc ID might differ, though best practice is ref = docID
        const donationsRef = adminDb.collection('donations');
        const snapshot = await donationsRef.where('reference', '==', reference).limit(1).get();

        if (snapshot.empty) {
            return NextResponse.json({ success: false, message: "Donation record not found" }, { status: 404 });
        }

        const docRef = snapshot.docs[0].ref;
        
        // Only update if not already success to avoid overwriting audit trails
        if (snapshot.docs[0].data().status !== 'Success') {
            await docRef.update({
                status: 'Success',
                paidAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
                paystackReference: pData.reference,
                paystackTransactionId: pData.id,
                paystackChannel: pData.channel,
                paystackFees: pData.fees,
                amount: pData.amount / 100, // Ensure exact match
                gateway: "paystack"
            });
        }

        return NextResponse.json({ success: true, message: "Verified successfully" });

    } catch (error) {
        console.error("Verification API Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
