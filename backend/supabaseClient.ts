import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables - check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    realtime: {
        transport: ws as unknown as typeof WebSocket, // Node 18 WebSocket fix
    },
});