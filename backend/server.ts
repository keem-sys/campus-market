import express, { Request, Response } from 'express';
import cors from 'cors';
import {supabase} from "./supabaseClient";
import { requireAuth, AuthenticatedRequest } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'https://cput-campus-market.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());

app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const {data, error } = await supabase.from('products').select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
})

app.get('/api/bulletin_posts', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bulletin_posts')
            .select('*, user_profiles(name, role)')
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bulletin_posts', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const authorId = req.user.id;
        const { title, content, type, expires_at } = req.body;

        const { data, error } = await supabase
            .from('bulletin_posts')
            .insert([{ author_id: authorId, title, content, type, expires_at }])
            .select()
            .single();

        if (error) throw error;
        res.json({ message: 'Post published!', post: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/transactions', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const buyerId = req.user.id;
        const { items, total_amount, payment_method } = req.body;

        const transactionRows = items.map((item: any) => ({
            product_id: item.product_id,
            buyer_id: buyerId,
            amount: item.amount,
            status: 'escrow'
        }));

        const { data, error } = await supabase.from('transactions').insert(transactionRows).select();

        if (error) throw error;
        res.json({ message: 'Transaction created in escrow status', transactions: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sellerId = req.user.id;
        const { title, description, price, image_url, category } = req.body;

        const { data, error } = await supabase
            .from('products')
            .insert([{
                seller_id: sellerId,
                title,
                description,
                price,
                image_url,
                status: 'active'
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Product listed successfully!', product: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
});