import { Router, Response } from 'express';
import crypto from 'crypto';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase } from '../supabaseClient';

const router = Router();

const PAYFAST_MERCHANT_ID  = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PAYFAST_PASSPHRASE   = process.env.PAYFAST_PASSPHRASE!;
const FRONTEND_URL         = process.env.FRONTEND_URL!;
const BACKEND_URL          = process.env.BACKEND_URL!;

const PAYFAST_SANDBOX_URL = 'https://sandbox.payfast.co.za/eng/process';

const generateSignature = (
    data: Record<string, string>, // all the payment fields
    passphrase: string             // your secret passphrase from .env
): string => {

    const sorted = Object.keys(data)
        .filter(key => data[key] !== '' && key !== 'signature')
        .sort()
        .reduce((acc: Record<string, string>, key) => {
            acc[key] = data[key];
            return acc;
        }, {});

    let queryString = Object.entries(sorted)
        .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
        .join('&');

    if (passphrase) {
        queryString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;
    }

    return crypto.createHash('md5').update(queryString).digest('hex');
};

router.post('/initiate', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { amount, item_name, order_id } = req.body;

        if (!amount || !item_name || !order_id) {
            return res.status(400).json({ error: 'Missing required payment fields' });
        }

        const payload: Record<string, string> = {
            merchant_id:   PAYFAST_MERCHANT_ID,   // your PayFast account ID
            merchant_key:  PAYFAST_MERCHANT_KEY,   // your PayFast account key
            return_url:    `${FRONTEND_URL}/payment/success`, // where to go after paying
            cancel_url:    `${FRONTEND_URL}/payment/cancel`,  // where to go if cancelled
            notify_url:    `${BACKEND_URL}/api/payment/notify`, // where PayFast tells us payment is done
            name_first:    req.user?.user_metadata?.first_name ?? 'Student', // buyer's name
            email_address: req.user?.email ?? '',  // buyer's email
            m_payment_id:  order_id,               // our internal order ID
            amount:        parseFloat(amount).toFixed(2), // e.g. "100.00"
            item_name:     item_name,              // e.g. "Second Hand Textbook"
        };

        payload.signature = generateSignature(payload, PAYFAST_PASSPHRASE);

        return res.status(200).json({
            payfast_url: PAYFAST_SANDBOX_URL,
            payload,
        });

    } catch (err) {
        console.error('Payment initiation error:', err);
        return res.status(500).json({ error: 'Payment initiation failed' });
    }
});

router.post('/notify', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const data = req.body as Record<string, string>;
        const receivedSignature = data.signature;
        const expectedSignature = generateSignature(data, PAYFAST_PASSPHRASE);

        if (receivedSignature !== expectedSignature) {
            console.error('PayFast ITN: Invalid signature - possible fake request');
            return res.status(400).send('Invalid signature');
        }

        if (data.payment_status !== 'COMPLETE') {
            return res.status(200).send('Payment not complete, ignoring');
        }

        const { error } = await supabase
            .from('transactions')
            .update({
                status: 'paid',
                payfast_payment_id: data.pf_payment_id
            })
            .eq('id', data.m_payment_id);

        if (error) {
            console.error('Database update error:', error);
            return res.status(500).send('Could not update transaction');
        }

        return res.status(200).send('OK');

    } catch (err) {
        console.error('ITN handler error:', err);
        return res.status(500).send('Error');
    }
});

export default router;