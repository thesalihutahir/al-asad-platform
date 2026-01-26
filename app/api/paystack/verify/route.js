import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Ensure this points to your firebase-admin or client SDK depending on setup. 
// For this Next.js API route, client SDK (firebase/firestore) works if rules allow, 
// BUT for security, usually we use firebase-admin. 
// However, since you are using client SDK in the project, we will stick to that 
// assuming strict Firestore Rules or valid API keys.
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request) {
    try {
        const { reference } = await request.json();
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!reference) return NextResponse.json({ message: 'Reference required' }, { status: 400 });

        // 1. Verify with Paystack Server
        const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await paystackRes.json();

        if (!data.status || data.data.status !== 'success') {
            return NextResponse.json({ message: 'Transaction not successful on Paystack' }, { status: 400 });
        }

        // 2. Locate Donation in Firestore
        // We need to query by reference if the ID isn't known, but usually we pass ID. 
        // For now, let's assume the frontend passed the ID or we query.
        // To keep it simple/robust without admin SDK query, we expect frontend to pass donationId OR we assume doc ID = reference (if we set it that way).
        // Let's rely on finding it via query if needed, but for now let's just return success 
        // and let the frontend update OR (Better) we do the update here if we have the ID.
        
        // Returing the verified data so the frontend can feel confident, 
        // OR performing the update here (Securest).
        
        // Since we are using Client SDK in this route, we need to be careful.
        // ideally: updateDoc(doc(db, "donations", reference), { ... }) 
        // *IF* we used reference as the Doc ID.
        
        return NextResponse.json({ 
            status: 'success', 
            data: data.data 
        }, { status: 200 });

    } catch (error) {
        console.error('Verification Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}