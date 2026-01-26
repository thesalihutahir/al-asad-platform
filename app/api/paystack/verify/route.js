import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { verifyPaystackTransaction } from '@/lib/paystack';
import { collection, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request) {
    try {
        const { reference } = await request.json();

        if (!reference) {
            return NextResponse.json({ success: false, message: "No reference provided" }, { status: 400 });
        }

        // 1. Find Donation in Firestore FIRST
        const donationsRef = collection(db, 'donations');
        const q = query(donationsRef, where('reference', '==', reference));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return NextResponse.json({ success: false, message: "Donation record not found" }, { status: 404 });
        }

        const docSnapshot = snapshot.docs[0];
        const docRef = docSnapshot.ref;

        // 2. Verify with Paystack
        const paystackResponse = await verifyPaystackTransaction(reference);
        const pData = paystackResponse?.data;

        // 3. Check for Failure
        if (!paystackResponse.status || pData?.status !== 'success') {
            // Mark as Failed in Database
            if (docSnapshot.data().status !== 'Failed') {
                 await updateDoc(docRef, {
                    status: 'Failed',
                    updatedAt: serverTimestamp(),
                    gateway: "paystack",
                    paystackMessage: paystackResponse.message || "Verification failed"
                });
            }
            return NextResponse.json({ success: false, message: "Transaction failed or declined" }, { status: 400 });
        }

        // 4. Update Success (If success)
        if (docSnapshot.data().status !== 'Success') {
            await updateDoc(docRef, {
                status: 'Success',
                paidAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                paystackReference: pData.reference,
                paystackTransactionId: String(pData.id),
                paystackChannel: pData.channel,
                amount: pData.amount / 100,
                gateway: "paystack"
            });
        }

        return NextResponse.json({ success: true, message: "Verified successfully" });

    } catch (error) {
        console.error("Verification API Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
