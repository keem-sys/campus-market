import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from "./supabaseClient";
import { requireAuth, AuthenticatedRequest } from './middleware/auth';
import paymentRouter from './routes/payment';

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',                    // frontend running locally on your computer
    'https://cput-campus-market.vercel.app'     // frontend deployed on Vercel (live site)
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

app.use('/api/payment', express.urlencoded({ extended: false }), paymentRouter);

app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from('products').select('*');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(data);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

app.post('/api/products', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, description, price, image_url } = req.body;

        const { data, error } = await supabase
            .from('products')
            .insert({
                title,          // the product name e.g. "Chemistry Textbook"
                description,    // details about the product
                price,          // the price e.g. 150
                image_url,      // link to the product photo
                seller_id: req.user?.id  // the logged in user's ID
            });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json(data);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
});