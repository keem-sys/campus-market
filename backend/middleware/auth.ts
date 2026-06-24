import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const requireAuth = async (
    req: AuthenticatedRequest, // the incoming request from the browser
    res: Response,             // the response we send back
    next: NextFunction         // a function that says "ok, move on"
) => {

    const authHeader = req.headers.authorization;

    // If there is no header, or it doesn't start with "Bearer ", reject it
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Send back a 401 error (401 means "you are not logged in")
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    // If Supabase said the token is bad, or no user was found, reject it
    if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user;

    next();
};