import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request) {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        const signature = request.headers.get('x-paystack-signature');
        
        if (!secret) {
            return NextResponse.json({ message: "Secret key missing" }, { status: 500 });
        }

        const rawBody = await request.text();
        
        const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

        if (hash !== signature) {
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(rawBody);

        if (event.event === 'charge.success') {
            const data = event.data;
            const reference = data.reference;

            const donationsRef = collection(db, 'donations');
            const q = query(donationsRef, where('reference', '==', reference));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const docSnapshot = snapshot.docs[0];
                if (docSnapshot.data().status !== 'Success') {
                    await updateDoc(docSnapshot.ref, {
                        status: 'Success',
                        paidAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        paystackReference: data.reference,
                        paystackTransactionId: String(data.id),
                        gateway: "paystack"
                    });
                }
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
