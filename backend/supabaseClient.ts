import {createClient, SupabaseClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing supabase environment variables: supabaseUrl or anonKey");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);