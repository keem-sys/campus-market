import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Campus Market API (TypeScript version)!" });
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
});