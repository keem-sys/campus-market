import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
        }

        const token = authHeader.split(' ')[1];

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        req.user = user;

        next();
    } catch (error: any) {
        res.status(500).json({ error: 'Authentication middleware crashed' });
    }
};