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

app.post('/api/products', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
try{
    const { title, description, price } = req.body;

    if (!title || !price) {
        return res.status(400).json({ error: 'Title and price are required' })
    }

    const {data, error} = await supabase
        .from('products')
        .insert([
            {
                title,
                description,
                price,
                seller_id: req.user.id,
            }
        ])
        .select();

    if(error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
} catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occured';
    res.status(500).json({ error: errorMessage });
}
});

app.post('/api/transactions', requireAuth, async (req: AuthenticatedRequest, res: Response) =>{
    try {
        const {product_id} = req.body;
        if (!product_id) {
            return res.status(400).json({error: 'product_id id required'});
        }
        const {data: product, error: productError} = await supabase
            .from('products')
            .select('price')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return res.status(404).json({error: 'Product not found'});
        }

        const {data, error} = await supabase
            .from('transactions')
            .insert([
                {
                    product_id,
                    buyer_id: req.user.id,
                    amount: product.price,
                    status: 'pending',
                }
            ])
            .select();

        if (error) {
            return res.status(500).json({error: error.message})
        }

        res.status(201).json(data[0]);

    }catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

app.get('/api/bulletin_posts', async (req: Request, res: Response) => {
    try {
        const {data, error} = await supabase
            .from('bulletin_posts')
            .select('*')
            .gt('expires_at', new Date().toISOString());

        if (error) {
            return res.status(500).json({error: error.message});
        }

        res.json(data);
    }catch(error){
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

app.post('/api/bulletin_posts', requireAuth, async (req: AuthenticatedRequest, res: Response)=> {
    try {
        const {title, content, type, expires_at} = req.body;

        if (!title || !content || !type || !expires_at) {
            return res.status(400).json({error: 'All fields are required'});
        }

        const {data, error} = await supabase
            .from('bulletin_posts')
            .insert([
                {
                    title,
                    content,
                    type,
                    expires_at,
                    author_id: req.user.id
                }
            ])
            .select();

        if (error) {
            return res.status(500).json({error: error.message});
        }

        res.status(201).json(data[0]);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error has occurred';
        res.status(500).json({ error: errorMessage });
    }
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
});