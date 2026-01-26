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

        // 1. Find Donation in Firestore
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
        const pStatus = pData?.status; // 'success', 'failed', 'abandoned', or undefined

        // 3. Determine App Status
        let newStatus = 'Pending';
        
        if (pStatus === 'success') {
            newStatus = 'Success';
        } else if (pStatus === 'failed') {
            newStatus = 'Failed';
        } else if (pStatus === 'abandoned') {
            newStatus = 'Cancelled';
        } else if (!paystackResponse.status) {
            // Transaction not found at Paystack (e.g. user closed immediately)
            newStatus = 'Cancelled';
        }

        // 4. Update Database
        if (docSnapshot.data().status !== newStatus && docSnapshot.data().status !== 'Success') {
            const updateData = {
                status: newStatus,
                updatedAt: serverTimestamp(),
                gateway: "paystack"
            };

            // If we have Paystack data, save it
            if (pData) {
                updateData.paystackReference = pData.reference;
                updateData.paystackTransactionId = String(pData.id);
                updateData.paystackChannel = pData.channel;
                if (pData.amount) updateData.amount = pData.amount / 100;
                if (paystackResponse.message) updateData.paystackMessage = paystackResponse.message;
            }

            await updateDoc(docRef, updateData);
        }

        // 5. Response
        if (newStatus === 'Success') {
            return NextResponse.json({ success: true, message: "Verified successfully" });
        } else {
            return NextResponse.json({ success: false, message: `Transaction ${newStatus}` });
        }

    } catch (error) {
        console.error("Verification API Error:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
