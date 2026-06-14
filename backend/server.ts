import express, { Request, Response } from 'express';
import cors from 'cors';

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

app.get('/api/test', (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Campus Market API (TypeScript version)!" });
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
});